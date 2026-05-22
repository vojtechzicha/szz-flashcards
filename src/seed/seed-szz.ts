import { getPayload } from 'payload'

import config from '@/payload.config'
import { legacyHtmlToLexical } from '@/lexical/html-import'
import { loadLegacyData } from './load-legacy'

const STUDY_SLUG = 'szz-gpm'
const STUDY_TITLE = 'SZZ — Globální podnikání a management'

async function upsertStudy(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({
    collection: 'studies',
    where: { slug: { equals: STUDY_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return existing.docs[0] as { id: string | number }
  const created = await payload.create({
    collection: 'studies',
    data: {
      title: STUDY_TITLE,
      slug: STUDY_SLUG,
      description: 'Imported from the legacy SZZ flashcards bundle.',
      order: 0,
    },
    overrideAccess: true,
  })
  return created as { id: string | number }
}

async function upsertSubject(
  payload: Awaited<ReturnType<typeof getPayload>>,
  studyId: string | number,
  legacyId: string,
  title: string,
  order: number,
) {
  const existing = await payload.find({
    collection: 'subjects',
    where: {
      and: [
        { study: { equals: studyId } },
        { title: { equals: title } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return existing.docs[0] as { id: string | number }
  const created = await payload.create({
    collection: 'subjects',
    data: {
      study: studyId as string,
      title,
      mode: 'topical',
      order,
    },
    overrideAccess: true,
  })
  return created as { id: string | number }
}

async function upsertTopic(
  payload: Awaited<ReturnType<typeof getPayload>>,
  subjectId: string | number,
  title: string,
  description: string | undefined,
  order: number,
) {
  const existing = await payload.find({
    collection: 'topics',
    where: {
      and: [
        { subject: { equals: subjectId } },
        { title: { equals: title } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return existing.docs[0] as { id: string | number }
  const created = await payload.create({
    collection: 'topics',
    data: {
      subject: subjectId as string,
      title,
      description,
      order,
    },
    overrideAccess: true,
  })
  return created as { id: string | number }
}

async function upsertCard(
  payload: Awaited<ReturnType<typeof getPayload>>,
  subjectId: string | number,
  topicId: string | number,
  legacyId: string,
  frontHtml: string,
  backHtml: string,
  order: number,
) {
  // We use a synthetic preview key (`legacyId`) tucked into the order field
  // would be lossy. Instead, idempotency keys on (topic, order, legacyId) by
  // searching for a matching topic + order pair we created in a previous run.
  const existing = await payload.find({
    collection: 'cards',
    where: {
      and: [
        { topic: { equals: topicId } },
        { order: { equals: order } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const front = legacyHtmlToLexical(frontHtml)
  const back = legacyHtmlToLexical(backHtml)
  if (existing.totalDocs > 0) {
    const cur = existing.docs[0] as { id: string | number }
    await payload.update({
      collection: 'cards',
      id: cur.id,
      data: { subject: subjectId as string, topic: topicId as string, front, back, order },
      overrideAccess: true,
    })
    return cur
  }
  const created = await payload.create({
    collection: 'cards',
    data: {
      subject: subjectId as string,
      topic: topicId as string,
      front,
      back,
      order,
    },
    overrideAccess: true,
  })
  return created as { id: string | number }
}

async function main() {
  const data = await loadLegacyData()
  const payload = await getPayload({ config })

  const study = await upsertStudy(payload)
  console.log(`Study: ${STUDY_TITLE} (${String(study.id)})`)

  // Map legacy questionId -> topicId
  const topicByLegacyQ: Map<string, string | number> = new Map()
  // Map legacy subjectId -> subjectId
  const subjectByLegacyS: Map<string, string | number> = new Map()

  // Subjects
  let subjectOrder = 0
  for (const s of data.subjects) {
    const subj = await upsertSubject(payload, study.id, s.id, s.name, subjectOrder++)
    subjectByLegacyS.set(s.id, subj.id)
  }
  console.log(`Subjects: ${data.subjects.length}`)

  // Topics (= legacy questions)
  let topicOrder = 0
  for (const s of data.subjects) {
    const subjectId = subjectByLegacyS.get(s.id)!
    let order = 0
    for (const qId of s.questionIds) {
      const q = data.questions.find((qq) => qq.id === qId)
      if (!q) continue
      const topic = await upsertTopic(payload, subjectId, q.title, q.subtitle, order++)
      topicByLegacyQ.set(q.id, topic.id)
      topicOrder++
    }
  }
  console.log(`Topics: ${topicOrder}`)

  // Cards
  let cardOrderByTopic: Map<string | number, number> = new Map()
  let cardCount = 0
  for (const c of data.cards) {
    const topicId = topicByLegacyQ.get(c.questionId)
    if (!topicId) {
      console.warn(`Skip card ${c.id}: legacy question ${c.questionId} not found`)
      continue
    }
    // find subject for this topic
    let subjectIdForCard: string | number | undefined
    for (const [legacyS, subjectId] of subjectByLegacyS.entries()) {
      const s = data.subjects.find((ss) => ss.id === legacyS)
      if (s?.questionIds.includes(c.questionId)) {
        subjectIdForCard = subjectId
        break
      }
    }
    if (!subjectIdForCard) {
      console.warn(`Skip card ${c.id}: subject not found for topic ${c.questionId}`)
      continue
    }
    const order = cardOrderByTopic.get(topicId) ?? 0
    cardOrderByTopic.set(topicId, order + 1)
    await upsertCard(payload, subjectIdForCard, topicId, c.id, c.front, c.back, order)
    cardCount++
  }
  console.log(`Cards: ${cardCount}`)

  console.log('Seed complete.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
