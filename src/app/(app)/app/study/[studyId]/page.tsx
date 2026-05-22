import Link from 'next/link'
import { notFound } from 'next/navigation'

import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'
import { ModeChooser } from '@/components/ModeChooser'

export default async function StudyPage({ params }: { params: Promise<{ studyId: string }> }) {
  const { studyId } = await params
  const payload = await payloadClient()

  let study
  try {
    study = await payload.findByID({ collection: 'studies', id: studyId, depth: 0, overrideAccess: true })
  } catch {
    notFound()
  }

  const subjects = await payload.find({
    collection: 'subjects',
    where: { study: { equals: studyId } },
    sort: 'order',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  const t = await ServerT()

  return (
    <section className="pt-8">
      <Link href="/app" className="text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]">
        ← {t('common.back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-2">
        {(study as unknown as { title: string }).title}
      </h1>
      <ModeChooser scope="study" id={studyId} label={t('study.studyAll')} />
      <h2 className="text-sm uppercase tracking-wider text-[color:var(--color-text-dim)] mt-8 mb-3">
        {t('study.subjects')}
      </h2>
      <ul className="grid gap-2">
        {subjects.docs.map((doc) => {
          const s = doc as unknown as { id: string | number; title: string; mode?: string }
          const id = String(s.id)
          return (
            <li key={id}>
              <Link
                href={`/app/subject/${id}`}
                className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-bg-hover)] px-4 py-3 transition"
              >
                <span>{s.title}</span>
                <span className="text-xs text-[color:var(--color-text-faint)]">
                  {s.mode === 'flat' ? '·' : '›'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
