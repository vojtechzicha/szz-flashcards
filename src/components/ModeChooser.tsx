'use client'

import Link from 'next/link'

import { useI18n } from '@/lib/i18n/context'

type Scope = 'study' | 'subject' | 'topic'

export function ModeChooser({ scope, id, label }: { scope: Scope; id: string; label?: string }) {
  const { t } = useI18n()
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] p-4 mt-4 bg-[color:var(--color-bg-elevated)]/40">
      {label ? <div className="text-sm font-medium mb-3">{label}</div> : null}
      <div className="text-xs uppercase tracking-wider text-[color:var(--color-text-dim)] mb-2">
        {t('mode.choose')}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          href={`/app/learn/${scope}/${id}?mode=tutorial`}
          className="rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-hover)] p-3 transition"
        >
          <div className="font-medium">{t('mode.tutorial')}</div>
          <div className="text-xs text-[color:var(--color-text-dim)] mt-0.5">
            {t('mode.tutorial.desc')}
          </div>
        </Link>
        <Link
          href={`/app/learn/${scope}/${id}?mode=learning`}
          className="rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-accent)] hover:bg-[color:var(--color-bg-hover)] p-3 transition"
        >
          <div className="font-medium">{t('mode.learning')}</div>
          <div className="text-xs text-[color:var(--color-text-dim)] mt-0.5">
            {t('mode.learning.desc')}
          </div>
        </Link>
      </div>
    </div>
  )
}
