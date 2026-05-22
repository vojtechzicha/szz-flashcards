import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Outfit } from 'next/font/google'

import '../globals.css'
import { DEFAULT_LOCALE, isLocale, pickLocaleFromHeader } from '@/lib/i18n'
import { getCurrentUser } from '@/lib/auth/session'

const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'SZZ Flashcards',
  description: 'Flashcards for SZZ exam prep — Globální podnikání a management.',
}

export default async function PublicRootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const user = await getCurrentUser()
  const locale = isLocale(user?.preferredLanguage)
    ? user!.preferredLanguage
    : pickLocaleFromHeader(h.get('accept-language'))

  return (
    <html
      lang={locale ?? DEFAULT_LOCALE}
      data-theme={user?.preferredTheme ?? 'dark'}
      className={outfit.variable}
    >
      <body>{children}</body>
    </html>
  )
}
