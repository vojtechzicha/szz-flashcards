import Link from 'next/link'
import { notFound } from 'next/navigation'

import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'
import { ModeChooser } from '@/components/ModeChooser'

export default async function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = await params
  const payload = await payloadClient()

  let subject
  try {
    subject = await payload.findByID({
      collection: 'subjects',
      id: subjectId,
      depth: 1,
      overrideAccess: true,
    })
  } catch {
    notFound()
  }

  const subj = subject as {
    id: string | number
    title: string
    mode: 'flat' | 'topical'
    study?: { id: string | number; title?: string } | string | number
  }
  const studyId = typeof subj.study === 'object' ? String(subj.study?.id) : String(subj.study ?? '')

  const t = await ServerT()

  let topics: { docs: Array<{ id: string | number; title: string }>; totalDocs: number } | null = null
  if (subj.mode === 'topical') {
    const r = await payload.find({
      collection: 'topics',
      where: { subject: { equals: subjectId } },
      sort: 'order',
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })
    topics = { docs: r.docs as Array<{ id: string | number; title: string }>, totalDocs: r.totalDocs }
  }

  return (
    <section className="pt-8">
      <Link
        href={studyId ? `/app/study/${studyId}` : '/app'}
        className="text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]"
      >
        ← {t('common.back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-2">{subj.title}</h1>
      <ModeChooser scope="subject" id={String(subj.id)} label={t('subject.studyAll')} />
      {topics && topics.totalDocs > 0 ? (
        <>
          <h2 className="text-sm uppercase tracking-wider text-[color:var(--color-text-dim)] mt-8 mb-3">
            {t('subject.topics')}
          </h2>
          <ul className="grid gap-2">
            {topics.docs.map((tp) => (
              <li key={String(tp.id)}>
                <Link
                  href={`/app/topic/${tp.id}`}
                  className="block rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-bg-hover)] px-4 py-3 transition"
                >
                  {tp.title}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}
