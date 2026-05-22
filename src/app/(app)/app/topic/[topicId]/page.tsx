import Link from 'next/link'
import { notFound } from 'next/navigation'

import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'
import { ModeChooser } from '@/components/ModeChooser'

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const payload = await payloadClient()

  let topic
  try {
    topic = await payload.findByID({
      collection: 'topics',
      id: topicId,
      depth: 1,
      overrideAccess: true,
    })
  } catch {
    notFound()
  }

  const tp = topic as {
    id: string | number
    title: string
    description?: string
    subject?: { id: string | number; title?: string } | string | number
  }
  const subjectId = typeof tp.subject === 'object' ? String(tp.subject?.id) : String(tp.subject ?? '')

  const t = await ServerT()

  return (
    <section className="pt-8">
      <Link
        href={subjectId ? `/app/subject/${subjectId}` : '/app'}
        className="text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]"
      >
        ← {t('common.back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-2">{tp.title}</h1>
      {tp.description ? (
        <p className="text-[color:var(--color-text-dim)] mb-2">{tp.description}</p>
      ) : null}
      <ModeChooser scope="topic" id={String(tp.id)} label={t('topic.study')} />
    </section>
  )
}
