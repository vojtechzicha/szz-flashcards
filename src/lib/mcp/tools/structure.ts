import { z } from 'zod'

import {
  as,
  cardOut,
  findAll,
  getById,
  nextOrder,
  relId,
  studyOut,
  subjectOut,
  topicOut,
} from '@/lib/mcp/content'
import { audit, defineTool, diffFields, ToolError, type ToolContext } from '@/lib/mcp/tool-kit'

// Studies → subjects → topics: the deck structure cards hang off.

const id = z.string().trim().min(1).max(64)
const title = z.string().trim().min(1).max(200)
const description = z.string().trim().max(2000).nullable().optional().describe('Empty string or null clears it.')
const order = z.number().int().optional().describe('Sort position; defaults to after the last sibling.')
const dryRun = z.boolean().optional().describe('Return what would change without saving.')
const mode = z
  .enum(['flat', 'topical'])
  .describe('flat: cards attach directly to the subject. topical: cards live in topics under the subject.')

const cleanDescription = (value: string | null | undefined) =>
  value === undefined ? undefined : value === null || value.trim() === '' ? null : value

async function countCards(ctx: ToolContext, where: Record<string, any>) {
  const { payload, opts } = await as(ctx)
  return (await payload.count({ collection: 'cards', where, ...opts } as any)).totalDocs
}

/**
 * Deletes cards matching `where` and their study progress. Returns the deleted
 * cards so the audit entry can hold their content.
 */
async function deleteCardsWhere(ctx: ToolContext, where: Record<string, any>) {
  const { payload, opts } = await as(ctx)
  const cards = await findAll(payload, opts, 'cards', where)
  if (cards.length === 0) return []
  const ids = cards.map((c) => c.id)
  await payload.delete({ collection: 'progress', where: { card: { in: ids } }, ...opts } as any)
  await payload.delete({ collection: 'cards', where: { id: { in: ids } }, ...opts } as any)
  return cards.map((c) => cardOut(c))
}

export const structureTools = [
  // ─── Read ───────────────────────────────────────────────────────────────
  defineTool({
    name: 'list_studies',
    title: 'List studies',
    description: 'All studies (top-level decks) with their subject and card counts. Start here.',
    access: 'read',
    input: {},
    handler: async (_args, ctx) => {
      const { payload, opts } = await as(ctx)
      const [studies, subjects, cards] = await Promise.all([
        findAll(payload, opts, 'studies', {}),
        findAll(payload, { ...opts, select: { study: true } }, 'subjects', {}),
        findAll(payload, { ...opts, select: { subject: true } }, 'cards', {}),
      ])
      const studyOfSubject = new Map(subjects.map((s) => [String(s.id), relId(s.study)]))
      const cardsPerStudy = new Map<string, number>()
      for (const card of cards) {
        const study = studyOfSubject.get(relId(card.subject) ?? '')
        if (study) cardsPerStudy.set(study, (cardsPerStudy.get(study) ?? 0) + 1)
      }
      return studies.map((s) => ({
        ...studyOut(s),
        subject_count: subjects.filter((sub) => relId(sub.study) === String(s.id)).length,
        card_count: cardsPerStudy.get(String(s.id)) ?? 0,
      }))
    },
  }),

  defineTool({
    name: 'get_study',
    title: 'Get study structure',
    description:
      'One study with its full structure: subjects (with mode flat/topical), their topics, and card counts at every level. Use the ids from here for list_cards and create_cards.',
    access: 'read',
    input: { study_id: id },
    handler: async ({ study_id }, ctx) => {
      const { payload, opts } = await as(ctx)
      const study = await getById(payload, opts, 'studies', study_id, 'Study')
      const subjects = await findAll(payload, opts, 'subjects', { study: { equals: study_id } })
      const subjectIds = subjects.map((s) => s.id)
      const [topics, cards] = subjectIds.length
        ? await Promise.all([
            findAll(payload, opts, 'topics', { subject: { in: subjectIds } }),
            findAll(payload, { ...opts, select: { subject: true, topic: true } }, 'cards', { subject: { in: subjectIds } }),
          ])
        : [[], []]
      const count = (key: 'subject' | 'topic', value: string) => cards.filter((c) => relId(c[key]) === value).length
      return {
        ...studyOut(study),
        subjects: subjects.map((s) => ({
          ...subjectOut(s),
          card_count: count('subject', String(s.id)),
          topics:
            s.mode === 'topical'
              ? topics
                  .filter((t) => relId(t.subject) === String(s.id))
                  .map((t) => ({ ...topicOut(t), card_count: count('topic', String(t.id)) }))
              : undefined,
        })),
      }
    },
  }),

  // ─── Studies ────────────────────────────────────────────────────────────
  defineTool({
    name: 'create_study',
    title: 'Create study',
    description: 'Create a top-level study (deck). The slug is generated from the title unless given.',
    access: 'write',
    input: {
      title,
      description,
      slug: z.string().trim().regex(/^[a-z0-9-]{1,80}$/).optional(),
      order,
    },
    handler: async ({ title, description, slug, order }, ctx) => {
      const { payload, opts } = await as(ctx)
      const doc = await payload.create({
        collection: 'studies',
        data: {
          title,
          description: cleanDescription(description) ?? null,
          ...(slug ? { slug } : {}),
          order: order ?? (await nextOrder(payload, opts, 'studies', {})),
        },
        ...opts,
      } as any)
      const out = studyOut(doc)
      await audit(ctx, { tool: 'create_study', action: 'create', collection: 'studies', documentId: out.id, after: out })
      return { created: out }
    },
  }),

  defineTool({
    name: 'update_study',
    title: 'Update study',
    description: 'Change a study’s title, description, slug or order. Only the fields you pass change.',
    access: 'write',
    input: {
      study_id: id,
      title: title.optional(),
      description,
      slug: z.string().trim().regex(/^[a-z0-9-]{1,80}$/).optional(),
      order,
      dry_run: dryRun,
    },
    handler: async ({ study_id, dry_run, ...fields }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = studyOut(await getById(payload, opts, 'studies', study_id, 'Study'))
      const patch = { ...fields, description: cleanDescription(fields.description) }
      const changes = diffFields(before, patch)
      if (dry_run || Object.keys(changes).length === 0) return { dry_run: !!dry_run, changes }
      const after = studyOut(
        await payload.update({ collection: 'studies', id: study_id, data: patchData(changes), ...opts } as any),
      )
      await audit(ctx, { tool: 'update_study', action: 'update', collection: 'studies', documentId: study_id, before, after })
      return { changes, updated: after }
    },
  }),

  defineTool({
    name: 'delete_study',
    title: 'Delete study',
    description: 'Delete an empty study. Delete or move its subjects first; the tool refuses otherwise.',
    access: 'delete',
    input: { study_id: id, dry_run: dryRun },
    handler: async ({ study_id, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = studyOut(await getById(payload, opts, 'studies', study_id, 'Study'))
      const subjects = await payload.count({ collection: 'subjects', where: { study: { equals: study_id } }, ...opts } as any)
      if (subjects.totalDocs > 0) {
        throw new ToolError(`Study "${before.title}" still has ${subjects.totalDocs} subject(s). Delete them first.`)
      }
      if (dry_run) return { dry_run: true, would_delete: before }
      await payload.delete({ collection: 'studies', id: study_id, ...opts } as any)
      await audit(ctx, { tool: 'delete_study', action: 'delete', collection: 'studies', documentId: study_id, before })
      return { deleted: before }
    },
  }),

  // ─── Subjects ───────────────────────────────────────────────────────────
  defineTool({
    name: 'create_subject',
    title: 'Create subject',
    description:
      'Create a subject in a study. Choose mode "topical" when cards should be grouped into topics (create those with create_topic), "flat" when cards attach directly to the subject.',
    access: 'write',
    input: { study_id: id, title, mode, description, order },
    handler: async ({ study_id, title, mode, description, order }, ctx) => {
      const { payload, opts } = await as(ctx)
      await getById(payload, opts, 'studies', study_id, 'Study')
      const doc = await payload.create({
        collection: 'subjects',
        data: {
          study: study_id,
          title,
          mode,
          description: cleanDescription(description) ?? null,
          order: order ?? (await nextOrder(payload, opts, 'subjects', { study: { equals: study_id } })),
        },
        ...opts,
      } as any)
      const out = subjectOut(doc)
      await audit(ctx, { tool: 'create_subject', action: 'create', collection: 'subjects', documentId: out.id, after: out })
      return { created: out }
    },
  }),

  defineTool({
    name: 'update_subject',
    title: 'Update subject',
    description:
      'Change a subject’s title, description, order, mode or study. Changing mode is only allowed while the subject has no cards (and, for topical → flat, no topics).',
    access: 'write',
    input: {
      subject_id: id,
      title: title.optional(),
      description,
      order,
      mode: mode.optional(),
      study_id: id.optional().describe('Move the subject (with its topics and cards) to another study.'),
      dry_run: dryRun,
    },
    handler: async ({ subject_id, dry_run, ...fields }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = subjectOut(await getById(payload, opts, 'subjects', subject_id, 'Subject'))
      const patch = { ...fields, description: cleanDescription(fields.description) }
      const changes = diffFields(before, patch)

      if (changes.mode) {
        const cards = await countCards(ctx, { subject: { equals: subject_id } })
        const topics = await payload.count({ collection: 'topics', where: { subject: { equals: subject_id } }, ...opts } as any)
        if (cards > 0 || (changes.mode.to === 'flat' && topics.totalDocs > 0)) {
          throw new ToolError(
            `Can't switch "${before.title}" to ${changes.mode.to}: it has ${cards} card(s) and ${topics.totalDocs} topic(s). Move or delete them first.`,
          )
        }
      }
      if (changes.study_id) await getById(payload, opts, 'studies', String(changes.study_id.to), 'Study')

      if (dry_run || Object.keys(changes).length === 0) return { dry_run: !!dry_run, changes }
      const data = patchData(changes)
      if ('study_id' in data) {
        data.study = data.study_id
        delete data.study_id
      }
      const after = subjectOut(await payload.update({ collection: 'subjects', id: subject_id, data, ...opts } as any))
      await audit(ctx, { tool: 'update_subject', action: 'update', collection: 'subjects', documentId: subject_id, before, after })
      return { changes, updated: after }
    },
  }),

  defineTool({
    name: 'delete_subject',
    title: 'Delete subject',
    description:
      'Delete a subject. If it still has topics or cards, pass cascade: true to delete them too (with everyone’s study progress on those cards). Run with dry_run first to see the counts.',
    access: 'delete',
    input: { subject_id: id, cascade: z.boolean().optional(), dry_run: dryRun },
    handler: async ({ subject_id, cascade, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = subjectOut(await getById(payload, opts, 'subjects', subject_id, 'Subject'))
      const cards = await countCards(ctx, { subject: { equals: subject_id } })
      const topics = (await payload.count({ collection: 'topics', where: { subject: { equals: subject_id } }, ...opts } as any))
        .totalDocs
      const alsoDeleted = { cards, topics }
      if ((cards > 0 || topics > 0) && !cascade && !dry_run) {
        throw new ToolError(
          `Subject "${before.title}" has ${topics} topic(s) and ${cards} card(s). Pass cascade: true to delete them as well.`,
        )
      }
      if (dry_run) return { dry_run: true, would_delete: before, also_deleted: alsoDeleted }

      const deletedTopics = (await findAll(payload, opts, 'topics', { subject: { equals: subject_id } })).map(topicOut)
      const deletedCards = await deleteCardsWhere(ctx, { subject: { equals: subject_id } })
      if (topics > 0) await payload.delete({ collection: 'topics', where: { subject: { equals: subject_id } }, ...opts } as any)
      await payload.delete({ collection: 'subjects', id: subject_id, ...opts } as any)
      await audit(ctx, {
        tool: 'delete_subject',
        action: 'delete',
        collection: 'subjects',
        documentId: subject_id,
        before: { ...before, deleted_topics: deletedTopics, deleted_cards: deletedCards },
      })
      return { deleted: before, also_deleted: alsoDeleted }
    },
  }),

  // ─── Topics ─────────────────────────────────────────────────────────────
  defineTool({
    name: 'create_topic',
    title: 'Create topic',
    description: 'Create a topic under a topical subject.',
    access: 'write',
    input: { subject_id: id, title, description, order },
    handler: async ({ subject_id, title, description, order }, ctx) => {
      const { payload, opts } = await as(ctx)
      const subject = await getById(payload, opts, 'subjects', subject_id, 'Subject')
      if (subject.mode !== 'topical') {
        throw new ToolError(`Subject "${subject.title}" is flat: it has no topics. Switch it to topical first.`)
      }
      const doc = await payload.create({
        collection: 'topics',
        data: {
          subject: subject_id,
          title,
          description: cleanDescription(description) ?? null,
          order: order ?? (await nextOrder(payload, opts, 'topics', { subject: { equals: subject_id } })),
        },
        ...opts,
      } as any)
      const out = topicOut(doc)
      await audit(ctx, { tool: 'create_topic', action: 'create', collection: 'topics', documentId: out.id, after: out })
      return { created: out }
    },
  }),

  defineTool({
    name: 'update_topic',
    title: 'Update topic',
    description: 'Change a topic’s title, description or order.',
    access: 'write',
    input: { topic_id: id, title: title.optional(), description, order, dry_run: dryRun },
    handler: async ({ topic_id, dry_run, ...fields }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = topicOut(await getById(payload, opts, 'topics', topic_id, 'Topic'))
      const changes = diffFields(before, { ...fields, description: cleanDescription(fields.description) })
      if (dry_run || Object.keys(changes).length === 0) return { dry_run: !!dry_run, changes }
      const after = topicOut(
        await payload.update({ collection: 'topics', id: topic_id, data: patchData(changes), ...opts } as any),
      )
      await audit(ctx, { tool: 'update_topic', action: 'update', collection: 'topics', documentId: topic_id, before, after })
      return { changes, updated: after }
    },
  }),

  defineTool({
    name: 'delete_topic',
    title: 'Delete topic',
    description:
      'Delete a topic. If it has cards, pass cascade: true to delete them too (with their study progress), or move them first with update_cards.',
    access: 'delete',
    input: { topic_id: id, cascade: z.boolean().optional(), dry_run: dryRun },
    handler: async ({ topic_id, cascade, dry_run }, ctx) => {
      const { payload, opts } = await as(ctx)
      const before = topicOut(await getById(payload, opts, 'topics', topic_id, 'Topic'))
      const cards = await countCards(ctx, { topic: { equals: topic_id } })
      if (cards > 0 && !cascade && !dry_run) {
        throw new ToolError(`Topic "${before.title}" has ${cards} card(s). Pass cascade: true to delete them as well.`)
      }
      if (dry_run) return { dry_run: true, would_delete: before, also_deleted: { cards } }
      const deletedCards = await deleteCardsWhere(ctx, { topic: { equals: topic_id } })
      await payload.delete({ collection: 'topics', id: topic_id, ...opts } as any)
      await audit(ctx, {
        tool: 'delete_topic',
        action: 'delete',
        collection: 'topics',
        documentId: topic_id,
        before: { ...before, deleted_cards: deletedCards },
      })
      return { deleted: before, also_deleted: { cards } }
    },
  }),
]

function patchData(changes: Record<string, { to: unknown }>): Record<string, any> {
  return Object.fromEntries(Object.entries(changes).map(([key, { to }]) => [key, to]))
}
