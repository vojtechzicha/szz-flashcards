import Link from 'next/link'

import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'

export default async function HomePage() {
  const payload = await payloadClient()
  const studies = await payload.find({
    collection: 'studies',
    limit: 100,
    sort: 'order',
    overrideAccess: true,
    depth: 0,
  })
  const t = await ServerT()

  return (
    <section className="pt-8">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">{t('home.title')}</h1>
      {studies.totalDocs === 0 ? (
        <p className="text-[color:var(--color-text-dim)]">{t('home.empty')}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {studies.docs.map((doc) => {
            const s = doc as unknown as { id: string | number; title: string; description?: string }
            return (
              <li key={String(s.id)}>
                <Link
                  href={`/app/study/${s.id}`}
                  className="block rounded-xl border border-[color:var(--color-border)] hover:border-[color:var(--color-border-accent)] hover:bg-[color:var(--color-bg-hover)] p-5 transition"
                >
                  <div className="text-lg font-medium">{s.title}</div>
                  {s.description ? (
                    <div className="text-sm text-[color:var(--color-text-dim)] mt-1 line-clamp-2">
                      {s.description}
                    </div>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
