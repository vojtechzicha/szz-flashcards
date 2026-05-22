import { notFound, redirect } from 'next/navigation'
import type { Where } from 'payload'

import { payloadClient } from '@/lib/payload-client'
import { getCurrentUser } from '@/lib/auth/session'
import { LearnSession } from '@/components/LearnSession'

type Scope = 'study' | 'subject' | 'topic'

const isScope = (v: string): v is Scope => v === 'study' || v === 'subject' || v === 'topic'

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ scope: string; id: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { scope, id } = await params
  const { mode: modeRaw } = await searchParams
  const mode = modeRaw === 'tutorial' ? 'tutorial' : 'learning'

  if (!isScope(scope)) notFound()

  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  const payload = await payloadClient()
  const where = await whereForScope(payload, scope, id)
  if (!where) notFound()

  const cardsRes = await payload.find({
    collection: 'cards',
    where,
    sort: 'order',
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  })

  const cards = cardsRes.docs.map((c) => {
    const raw = c as {
      id: string | number
      front: unknown
      back: unknown
      order?: number | null
    }
    return {
      id: String(raw.id),
      order: raw.order ?? 0,
      front: raw.front,
      back: raw.back,
    }
  })

  return <LearnSession mode={mode} cards={cards} userId={String(user.id)} backHref={backHrefForScope(scope, id)} />
}

async function whereForScope(
  payload: Awaited<ReturnType<typeof payloadClient>>,
  scope: Scope,
  id: string,
): Promise<Where | null> {
  if (scope === 'topic') return { topic: { equals: id } }
  if (scope === 'subject') return { subject: { equals: id } }
  if (scope === 'study') {
    const subjects = await payload.find({
      collection: 'subjects',
      where: { study: { equals: id } },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })
    const ids = subjects.docs.map((doc) => (doc as unknown as { id: string | number }).id)
    if (ids.length === 0) return { subject: { equals: '__none__' } }
    return { subject: { in: ids } }
  }
  return null
}

function backHrefForScope(scope: Scope, id: string): string {
  if (scope === 'study') return `/app/study/${id}`
  if (scope === 'subject') return `/app/subject/${id}`
  return `/app/topic/${id}`
}
