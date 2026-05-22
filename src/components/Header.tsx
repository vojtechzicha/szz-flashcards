'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

import type { AppUser } from '@/lib/auth/session'
import { signOutAction } from '@/lib/auth/sign-out-action'
import { useI18n } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n'
import { useTheme, type Theme } from '@/lib/theme/context'
import { cn } from '@/lib/utils'

export function Header({ user }: { user: AppUser }) {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useTheme()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const switchLocale = (next: Locale) => {
    if (next === locale) return
    setLocale(next) // optimistic — flips client-side strings immediately
    startTransition(async () => {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ preferredLanguage: next }),
        })
      } catch {
        // ignore — client-side state already updated
      }
      // Refresh server components so any server-rendered text (locale-aware
      // dates, server-translated labels) re-renders in the new language too.
      router.refresh()
    })
  }

  const switchTheme = (next: Theme) => {
    if (next === theme) return
    setTheme(next)
    startTransition(async () => {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ preferredTheme: next }),
        })
      } catch {
        // ignore — client-side state already updated
      }
    })
  }

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-[color:var(--color-bg-base)]/85 border-b border-[color:var(--color-border)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/app"
          className="font-semibold tracking-tight text-[color:var(--color-text)] hover:text-[color:var(--color-accent-bright)] transition"
        >
          {t('app.title')}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/app/stats"
            className="px-3 py-1.5 rounded-md hover:bg-[color:var(--color-bg-hover)] text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]"
          >
            {t('nav.stats')}
          </Link>
          {user.role === 'admin' ? (
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-md hover:bg-[color:var(--color-bg-hover)] text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]"
            >
              {t('nav.admin')}
            </Link>
          ) : null}
          <div
            role="group"
            aria-label={t('theme.toggle')}
            className="ml-2 inline-flex rounded-full bg-[color:var(--color-bg-elevated)] p-0.5 text-xs"
          >
            {(['dark', 'light'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => switchTheme(mode)}
                disabled={pending}
                aria-label={t(mode === 'dark' ? 'theme.dark' : 'theme.light')}
                aria-pressed={theme === mode}
                title={t(mode === 'dark' ? 'theme.dark' : 'theme.light')}
                className={cn(
                  'px-2 py-1 rounded-full transition leading-none',
                  theme === mode
                    ? 'bg-[color:var(--color-accent)] text-black font-semibold'
                    : 'text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]',
                )}
              >
                {mode === 'dark' ? '☾' : '☀'}
              </button>
            ))}
          </div>
          <div
            role="group"
            aria-label={t('lang.toggle')}
            className="ml-1 inline-flex rounded-full bg-[color:var(--color-bg-elevated)] p-0.5 text-xs"
          >
            {(['cs', 'en'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => switchLocale(code)}
                disabled={pending}
                className={cn(
                  'px-2.5 py-1 rounded-full uppercase tracking-wide transition',
                  locale === code
                    ? 'bg-[color:var(--color-accent)] text-black font-semibold'
                    : 'text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]',
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <form action={signOutAction} className="ml-1">
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]"
            >
              {t('nav.signOut')}
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
