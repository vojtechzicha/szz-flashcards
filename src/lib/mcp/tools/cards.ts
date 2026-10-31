import { z } from 'zod'
import type { Where } from 'payload'

import {
  as,
  cardOut,
  cardSummary,
  cardPlainText,
  findAll,
  nextOrder,
  parseFace,
  PlacementResolver,
  scopeKey,
  scopeWhere,
  type Placement,
  type ParsedFace,
} from '@/lib/mcp/content'
import { audit, defineTool, ToolError } from '@/lib/mcp/tool-kit'

const id = z.string().trim().min(1).max(64)
const face = z.string().max(20000)
const dryRun = z.boolean().optional().describe('Validate and return what would be saved, without saving.')
const allowMathErrors = z
  .boolean()
  .optional()
  .describe('Save even if KaTeX cannot parse some math (it then renders as an error). Default false: such cards are rejected.')

const MAX_BATCH = 200

const fold = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Runs writes one by one; on failure reports what was already saved. */
async function runSequential<T, R>(items: T[], write: (item: T, index: number) => Promise<R>) {
  const done: R[] = []
  for (let i = 0; i < items.length; i++) {
    try {
      done.push(await write(items[i], i))
    } catch (err: any) {
      const message = err?.data?.errors?.map((e: any) => e.message).join('; ') || err?.message || String(err)
      throw new ToolError(
        JSON.stringify(
          {
            error: `Item ${i} failed: ${message}`,
            saved_before_failure: done,
            not_attempted: items.length - i - 1,
          },
          null,
          2,
        ),
      )
    }
  }
  return done
}

export const cardTools = [
  defineTool({
    name: 'list_cards',
    title: 'List cards',
    description:
      'Cards of a topic, a flat subject, a whole subject, or by id, sorted by order. Faces come back as Card Markdown (see the server instructions). A card with "not_representable" holds formatting Markdown can’t express; rewriting that face drops it.',
    access: 'read',
    input: {
      topic_id: id.optional(),
      subject_id: id.optional().describe('All cards of the subject, across its topics.'),
      card_ids: z.array(id).max(500).optional(),
      include_content: z.boolean().optional().describe('Default true. false returns only ids, placement, order and a short preview.'),
      limit: z.number().int().min(1).max(500).optional().describe('Default 200.'),
      page: z.number().int().min(1).optional(),
    },
    handler: async ({ topic_id, subject_id, card_ids, include_content, limit, page }, ctx) => {
      const where: Where[] = []
      if (topic_id) where.push({ topic: { equals: topic_id } })
      if (subject_id) where.push({ subject: { equals: subject_id } })
      if (card_ids?.length) where.push({ id: { in: card_ids } })
      if (where.length === 0) throw new ToolError('Pass topic_id, subject_id or card_ids.')
      const { payload, opts } = await as(ctx)
      const result = await payload.find({
        collection: 'cards',
        where: { and: where },
        sort: ['order', 'createdAt'],
        limit: limit ?? 200,
        page: page ?? 1,
        ...opts,
      } as any)
      return {
        total: result.totalDocs,
        page: result.page,
        total_pages: result.totalPages,
        cards: (result.docs as any[]).map((d) => (include_content === false ? cardSummary(d) : cardOut(d))),
      }
    },
  }),

  defineTool({
    name: 'search_cards',
    title: 'Search cards',
    description:
      'Full-text search over both faces (case- and diacritics-insensitive, all words must match), optionally within a study, subject or topic. Use it to find duplicates before adding cards, or to locate a card to fix.',
    access: 'read',
    input: {
      query: z.string().trim().min(1).max(200),
      study_id: id.optional(),
      subject_id: id.optional(),
      topic_id: id.optional(),
      limit: z.number().int().min(1).max(100).optional().describe('Default 20.'),
    },
    handler: async ({ query, study_id, subject_id, topic_id, limit }, ctx) => {
      const { payload, opts } = await as(ctx)
      const where: Where[] = []
      if (topic_id) where.push({ topic: { equals: topic_id } })
      if (subject_id) where.push({ subject: { equals: subject_id } })
      if (study_id) {
        const subjects = await findAll(payload, { ...opts, select: { id: true } }, 'subjects', { study: { equals: study_id } })
        where.push({ subject: { in: subjects.map((s) => s.id) } })
      }
      const cards = await findAll(payload, opts, 'cards', where.length ? { and: where } : {})
      const terms = fold(query).split(/\s+/).filter(Boolean)
      const matches = cards.filter((card) => {
        const text = fold(cardPlainText(card))
        return terms.every((t) => text.includes(t))
      })
      return {
        total_matches: matches.length,
        cards: matches.slice(0, limit ?? 20).map((c) => cardOut(c)),
      }
    },
  }),

  defineTool({
    name: 'create_cards',
    title: 'Create cards',
    description: `Create up to ${MAX_BATCH} cards in one call. Faces are Card Markdown. Each card goes to topic_id (topical subjects) or subject_id (flat subjects); set them once at the top level or per card. Without "order", cards are appended after the existing ones in their topic/subject, in the given sequence. Everything is validated (placement, Markdown, KaTeX) before anything is saved; use dry_run to preview.`,
    access: 'write',
    input: {
      topic_id: id.optional().describe('Default topic for cards that don’t name one.'),
      subject_id: id.optional().describe('Default flat subject for cards that don’t name a topic.'),
      cards: z
        .array(
          z.object({
            front: face,
            back: face,
            topic_id: id.optional(),
            subject_id: id.optional(),
            order: z.number().optional(),
          }),
        )
        .min(1)
        .max(MAX_BATCH),
      allow_math_errors: allowMathErrors,
      dry_run: dryRun,
    },
    handler: async ({ topic_id, subject_id, cards, allow_math_errors, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const resolver = new PlacementResolver(payload, opts)
      const problems: string[] = []
      const planned: Array<{ placement: Placement; front: ParsedFace; back: ParsedFace; order?: number }> = []

      for (const [i, card] of cards.entries()) {
        let placement: Placement | null = null
        try {
          placement = await resolver.resolve(
            card.subject_id ?? (card.topic_id ? undefined : subject_id),
            card.topic_id ?? (card.subject_id ? undefined : topic_id),
          )
        } catch (err) {
          problems.push(`cards[${i}]: ${(err as Error).message}`)
        }
        const front = parseFace(card.front, `cards[${i}].front`, !!allow_math_errors, problems)
        const back = parseFace(card.back, `cards[${i}].back`, !!allow_math_errors, problems)
        if (placement && front && back) planned.push({ placement, front, back, order: card.order })
      }
      if (problems.length) throw new ToolError(`Nothing was saved. Fix these and retry:\n- ${problems.join('\n- ')}`)

      // Append after the last card of each topic/subject, keeping the given sequence.
      const next = new Map<string, number>()
      for (const p of planned) {
        if (p.order !== undefined) continue
        const key = scopeKey(p.placement)
        if (!next.has(key)) next.set(key, await nextOrder(payload, opts, 'cards', scopeWhere(p.placement)))
        p.order = next.get(key)!
        next.set(key, p.order + 1)
      }

      const preview = planned.map((p) => ({
        subject_id: String(p.placement.subject.id),
        subject: p.placement.subject.title,
        topic_id: p.placement.topic ? String(p.placement.topic.id) : null,
        topic: p.placement.topic?.title ?? null,
        order: p.order,
        front: p.front.markdown,
        back: p.back.markdown,
      }))
      if (dry_run) return { dry_run: true, would_create: preview }

      const created = await runSequential(planned, async (p) => {
        const doc = await payload.create({
          collection: 'cards',
          data: {
            subject: p.placement.subject.id,
            topic: p.placement.topic?.id ?? null,
            front: p.front.doc,
            back: p.back.doc,
            order: p.order,
          },
          ...opts,
        } as any)
        const out = cardOut(doc)
        await audit(ctx, { tool: 'create_cards', action: 'create', collection: 'cards', documentId: out.id, after: out })
        return { id: out.id, topic_id: out.topic_id, subject_id: out.subject_id, order: out.order }
      })
      return { created_count: created.length, created }
    },
  }),

  defineTool({
    name: 'update_cards',
    title: 'Update cards',
    description: `Edit up to ${MAX_BATCH} cards in one call: rewrite a face (Card Markdown), move to another topic/subject, or change order. Only the fields you pass change. Read the cards first (list_cards / search_cards) and edit the Markdown you got back. Validated before anything is saved; dry_run shows the diff.`,
    access: 'write',
    input: {
      updates: z
        .array(
          z.object({
            card_id: id,
            front: face.optional(),
            back: face.optional(),
            topic_id: id.optional().describe('Move to this topic (its subject follows).'),
            subject_id: id.optional().describe('Move to this flat subject.'),
            order: z.number().optional(),
          }),
        )
        .min(1)
        .max(MAX_BATCH),
      allow_math_errors: allowMathErrors,
      dry_run: dryRun,
    },
    handler: async ({ updates, allow_math_errors, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const ids = [...new Set(updates.map((u) => u.card_id))]
      if (ids.length !== updates.length) throw new ToolError('Each card_id may appear only once per call.')
      const existing = await findAll(payload, opts, 'cards', { id: { in: ids } })
      const byId = new Map(existing.map((c) => [String(c.id), c]))
      const resolver = new PlacementResolver(payload, opts)
      const problems: string[] = []
      const planned: Array<{ id: string; before: ReturnType<typeof cardOut>; data: Record<string, any>; changes: Record<string, unknown> }> = []

      for (const [i, u] of updates.entries()) {
        const card = byId.get(u.card_id)
        if (!card) {
          problems.push(`updates[${i}]: card ${u.card_id} not found.`)
          continue
        }
        const before = cardOut(card)
        const data: Record<string, any> = {}
        const changes: Record<string, unknown> = {}

        for (const side of ['front', 'back'] as const) {
          if (u[side] === undefined) continue
          const parsed = parseFace(u[side]!, `updates[${i}].${side}`, !!allow_math_errors, problems)
          if (parsed && parsed.markdown !== before[side]) {
            data[side] = parsed.doc
            changes[side] = { from: before[side], to: parsed.markdown }
          }
        }

        if (u.topic_id !== undefined || u.subject_id !== undefined) {
          try {
            const placement = await resolver.resolve(u.subject_id, u.topic_id)
            const subjectId = String(placement.subject.id)
            const topicId = placement.topic ? String(placement.topic.id) : null
            if (subjectId !== before.subject_id || topicId !== before.topic_id) {
              data.subject = subjectId
              data.topic = topicId
              changes.placement = {
                from: { subject_id: before.subject_id, topic_id: before.topic_id },
                to: { subject_id: subjectId, topic_id: topicId },
              }
              if (u.order === undefined) {
                data.order = await nextOrder(payload, opts, 'cards', scopeWhere(placement))
                changes.order = { from: before.order, to: data.order }
              }
            }
          } catch (err) {
            problems.push(`updates[${i}]: ${(err as Error).message}`)
          }
        }

        if (u.order !== undefined && u.order !== before.order) {
          data.order = u.order
          changes.order = { from: before.order, to: u.order }
        }

        // The collection hook only checks placement when `subject` is in the patch.
        if (data.topic === undefined && data.subject === undefined && Object.keys(data).length) {
          data.subject = before.subject_id
          data.topic = before.topic_id
        }
        if (Object.keys(changes).length) planned.push({ id: u.card_id, before, data, changes })
      }
      if (problems.length) throw new ToolError(`Nothing was saved. Fix these and retry:\n- ${problems.join('\n- ')}`)

      const unchanged = updates.length - planned.length
      if (dry_run) return { dry_run: true, would_update: planned.map((p) => ({ card_id: p.id, changes: p.changes })), unchanged }

      const updated = await runSequential(planned, async (p) => {
        const doc = await payload.update({ collection: 'cards', id: p.id, data: p.data, ...opts } as any)
        const after = cardOut(doc)
        await audit(ctx, { tool: 'update_cards', action: 'update', collection: 'cards', documentId: p.id, before: p.before, after })
        return { card_id: p.id, changed: Object.keys(p.changes) }
      })
      return { updated_count: updated.length, updated, unchanged }
    },
  }),

  defineTool({
    name: 'delete_cards',
    title: 'Delete cards',
    description: `Delete up to ${MAX_BATCH} cards, together with everyone’s study progress on them. The audit log keeps their content. Use dry_run to confirm the selection first.`,
    access: 'delete',
    input: { card_ids: z.array(id).min(1).max(MAX_BATCH), dry_run: dryRun },
    handler: async ({ card_ids, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const ids = [...new Set(card_ids)]
      const cards = await findAll(payload, opts, 'cards', { id: { in: ids } })
      const missing = ids.filter((cid) => !cards.some((c) => String(c.id) === cid))
      if (missing.length) throw new ToolError(`Nothing was deleted. Cards not found: ${missing.join(', ')}`)
      const progress = await payload.count({ collection: 'progress', where: { card: { in: ids } }, ...opts } as any)
      const snapshots = cards.map((c) => cardOut(c))
      if (dry_run) {
        return {
          dry_run: true,
          would_delete: snapshots.map((c) => ({ id: c.id, topic_id: c.topic_id, subject_id: c.subject_id, front: c.front })),
          progress_records: progress.totalDocs,
        }
      }

      await payload.delete({ collection: 'progress', where: { card: { in: ids } }, ...opts } as any)
      const deleted = await runSequential(snapshots, async (snap) => {
        await payload.delete({ collection: 'cards', id: snap.id, ...opts } as any)
        await audit(ctx, { tool: 'delete_cards', action: 'delete', collection: 'cards', documentId: snap.id, before: snap })
        return snap.id
      })
      return { deleted_count: deleted.length, deleted, progress_records_deleted: progress.totalDocs }
    },
  }),

  defineTool({
    name: 'preview_card_markdown',
    title: 'Check Card Markdown',
    description:
      'Parse Card Markdown without saving anything: returns how it will read back after saving and any KaTeX errors. Handy for checking tricky formulas.',
    access: 'read',
    input: { markdown: face },
    handler: async ({ markdown }) => {
      const problems: string[] = []
      const parsed = parseFace(markdown, 'markdown', false, problems)
      return { valid: problems.length === 0, problems, normalized: parsed?.markdown ?? null }
    },
  }),
]
