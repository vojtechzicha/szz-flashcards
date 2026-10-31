import type { Payload, Where } from 'payload'

import { payloadClient } from '@/lib/payload-client'
import { lexicalToMarkdown, lexicalToPlainText, markdownToLexical, type LexicalDoc } from '@/lexical/markdown'
import { ToolError, type ToolContext } from '@/lib/mcp/tool-kit'

// Shared data access for the MCP tools: Payload Local API calls made as the
// connector's user (overrideAccess: false), and the compact record shapes the
// tools return. Card faces are exchanged as Card Markdown.

type Row = Record<string, any>

export type Collection = 'studies' | 'subjects' | 'topics' | 'cards' | 'progress'

const userDocs = new WeakMap<ToolContext, Promise<Row>>()

/** Payload instance plus the request options that make it act as the MCP user. */
export async function as(ctx: ToolContext) {
  const payload = await payloadClient()
  let user = userDocs.get(ctx)
  if (!user) {
    user = payload
      .findByID({ collection: 'users', id: ctx.auth.user.id, depth: 0, overrideAccess: true })
      .then((doc) => ({ ...doc, collection: 'users' }))
    userDocs.set(ctx, user)
  }
  return { payload, opts: { user: (await user) as any, overrideAccess: false as const, depth: 0 } }
}

export function relId(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'object') {
    const id = (value as { id?: unknown }).id
    return id === undefined || id === null ? null : String(id)
  }
  return String(value)
}

export async function findAll(payload: Payload, opts: Row, collection: Collection, where: Where, sort = 'order') {
  const result = await payload.find({ collection, where, sort, pagination: false, ...opts } as any)
  return result.docs as Row[]
}

export async function getById(payload: Payload, opts: Row, collection: Collection, id: string, what: string) {
  try {
    const doc = await payload.findByID({ collection, id, ...opts } as any)
    if (doc) return doc as Row
  } catch {
    // NotFound, or a malformed id
  }
  throw new ToolError(`${what} ${id} not found.`)
}

/** Next free `order` value (max + 1) among records matching `where`. */
export async function nextOrder(payload: Payload, opts: Row, collection: Collection, where: Where): Promise<number> {
  const result = await payload.find({ collection, where, sort: '-order', limit: 1, ...opts } as any)
  const last = result.docs[0] as Row | undefined
  return typeof last?.order === 'number' ? last.order + 1 : 1
}

// ─── Record shapes returned to the agent ────────────────────────────────────

export function studyOut(doc: Row) {
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug ?? null,
    description: doc.description ?? null,
    order: doc.order ?? 0,
  }
}

export function subjectOut(doc: Row) {
  return {
    id: String(doc.id),
    study_id: relId(doc.study),
    title: doc.title,
    mode: doc.mode,
    description: doc.description ?? null,
    order: doc.order ?? 0,
  }
}

export function topicOut(doc: Row) {
  return {
    id: String(doc.id),
    subject_id: relId(doc.subject),
    title: doc.title,
    description: doc.description ?? null,
    order: doc.order ?? 0,
  }
}

function cardBase(doc: Row) {
  return {
    id: String(doc.id),
    subject_id: relId(doc.subject),
    topic_id: relId(doc.topic),
    order: (doc.order ?? 0) as number,
  }
}

export function cardSummary(doc: Row) {
  return { ...cardBase(doc), preview: (doc.preview ?? '') as string }
}

export function cardOut(doc: Row) {
  const base = cardBase(doc)
  const front = lexicalToMarkdown(doc.front)
  const back = lexicalToMarkdown(doc.back)
  const lossy = [...new Set([...front.lossy, ...back.lossy])]
  return {
    ...base,
    front: front.markdown,
    back: back.markdown,
    // Present only when the card holds formatting Card Markdown can't express;
    // rewriting that face would drop it.
    ...(lossy.length ? { not_representable: lossy } : {}),
    updated_at: doc.updatedAt ?? null,
  }
}

export function cardPlainText(doc: Row): string {
  return `${lexicalToPlainText(doc.front)} ${lexicalToPlainText(doc.back)}`
}

// ─── Card faces ─────────────────────────────────────────────────────────────

export interface ParsedFace {
  doc: LexicalDoc
  /** The Markdown as it will read back after saving. */
  markdown: string
}

export function parseFace(markdown: string, label: string, allowMathErrors: boolean, problems: string[]): ParsedFace | null {
  try {
    const { doc, mathErrors } = markdownToLexical(markdown)
    if (mathErrors.length && !allowMathErrors) {
      problems.push(...mathErrors.map((e) => `${label}: math error ${e}`))
    }
    return { doc, markdown: lexicalToMarkdown(doc).markdown }
  } catch (err) {
    problems.push(`${label}: ${(err as Error).message}`)
    return null
  }
}

// ─── Placement: which subject/topic a card belongs to ───────────────────────

export interface Placement {
  subject: Row
  topic: Row | null
}

/**
 * Resolves and checks where a card goes. A topic implies its subject; a flat
 * subject takes no topic; a topical subject requires one.
 */
export class PlacementResolver {
  private subjects = new Map<string, Promise<Row>>()
  private topics = new Map<string, Promise<Row>>()

  constructor(
    private payload: Payload,
    private opts: Row,
  ) {}

  subject(id: string) {
    if (!this.subjects.has(id)) this.subjects.set(id, getById(this.payload, this.opts, 'subjects', id, 'Subject'))
    return this.subjects.get(id)!
  }

  topic(id: string) {
    if (!this.topics.has(id)) this.topics.set(id, getById(this.payload, this.opts, 'topics', id, 'Topic'))
    return this.topics.get(id)!
  }

  async resolve(subjectId: string | null | undefined, topicId: string | null | undefined): Promise<Placement> {
    if (topicId) {
      const topic = await this.topic(topicId)
      const topicSubject = relId(topic.subject)!
      if (subjectId && subjectId !== topicSubject) {
        throw new ToolError(`Topic ${topicId} belongs to subject ${topicSubject}, not ${subjectId}.`)
      }
      return { subject: await this.subject(topicSubject), topic }
    }
    if (!subjectId) throw new ToolError('Give a topic_id (topical subjects) or a subject_id (flat subjects).')
    const subject = await this.subject(subjectId)
    if (subject.mode === 'topical') {
      throw new ToolError(`Subject "${subject.title}" (${subjectId}) is topical: cards need a topic_id.`)
    }
    return { subject, topic: null }
  }
}

/** Where-clause for the cards sharing a card's ordering scope (its topic, or its flat subject). */
export function scopeWhere(placement: Placement): Where {
  return placement.topic
    ? { topic: { equals: placement.topic.id } }
    : { subject: { equals: placement.subject.id } }
}

export function scopeKey(placement: Placement): string {
  return placement.topic ? `topic:${placement.topic.id}` : `subject:${placement.subject.id}`
}
