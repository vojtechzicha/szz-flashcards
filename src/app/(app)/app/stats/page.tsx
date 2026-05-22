import Link from 'next/link'

import { getCurrentUser } from '@/lib/auth/session'
import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'

export default async function StatsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const payload = await payloadClient()
  const t = await ServerT()

  const totalCardsRes = await payload.find({
    collection: 'cards',
    limit: 0,
    depth: 0,
    overrideAccess: true,
  })

  const knownRes = await payload.find({
    collection: 'progress',
    where: {
      and: [{ user: { equals: user.id } }, { state: { equals: 'known' } }],
    },
    limit: 0,
    overrideAccess: true,
  })
  const unknownRes = await payload.find({
    collection: 'progress',
    where: {
      and: [{ user: { equals: user.id } }, { state: { equals: 'unknown' } }],
    },
    limit: 0,
    overrideAccess: true,
  })

  const total = totalCardsRes.totalDocs
  const known = knownRes.totalDocs
  const unknown = unknownRes.totalDocs
  const unseen = Math.max(0, total - known - unknown)

  return (
    <section className="pt-8">
      <Link href="/app" className="text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]">
        ← {t('common.back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-6">{t('stats.title')}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label={t('stats.total')} value={total} />
        <Stat label={t('stats.known')} value={known} tone="good" />
        <Stat label={t('stats.unknown')} value={unknown} tone="bad" />
        <Stat label={t('stats.unseen')} value={unseen} />
      </div>
    </section>
  )
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: 'good' | 'bad' }) {
  const color =
    tone === 'good'
      ? 'text-[color:var(--color-good)]'
      : tone === 'bad'
        ? 'text-[color:var(--color-bad)]'
        : 'text-[color:var(--color-text)]'
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] p-4 bg-[color:var(--color-bg-elevated)]/40">
      <div className={`text-3xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs uppercase tracking-wider text-[color:var(--color-text-dim)] mt-1">{label}</div>
    </div>
  )
}
