import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/session'
import { payloadClient } from '@/lib/payload-client'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { cardId?: string; state?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }
  const cardId = body.cardId
  const state = body.state
  if (!cardId || (state !== 'known' && state !== 'unknown')) {
    return NextResponse.json({ error: 'invalid_input' }, { status: 400 })
  }

  const payload = await payloadClient()

  const existing = await payload.find({
    collection: 'progress',
    where: {
      and: [
        { user: { equals: user.id } },
        { card: { equals: cardId } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  const now = new Date().toISOString()
  if (existing.totalDocs === 0) {
    await payload.create({
      collection: 'progress',
      data: {
        user: user.id as string,
        card: cardId,
        state,
        knownCount: state === 'known' ? 1 : 0,
        unknownCount: state === 'unknown' ? 1 : 0,
        lastSeenAt: now,
      },
      overrideAccess: true,
    })
  } else {
    const cur = existing.docs[0] as {
      id: string | number
      knownCount?: number
      unknownCount?: number
    }
    await payload.update({
      collection: 'progress',
      id: cur.id,
      data: {
        state,
        knownCount: (cur.knownCount ?? 0) + (state === 'known' ? 1 : 0),
        unknownCount: (cur.unknownCount ?? 0) + (state === 'unknown' ? 1 : 0),
        lastSeenAt: now,
      },
      overrideAccess: true,
    })
  }

  return NextResponse.json({ ok: true })
}
