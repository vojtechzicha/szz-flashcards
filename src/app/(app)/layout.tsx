import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Outfit } from 'next/font/google'

import '../globals.css'
import { getCurrentUser } from '@/lib/auth/session'
import { I18nProvider } from '@/lib/i18n/context'
import { ThemeProvider } from '@/lib/theme/context'
import { Header } from '@/components/Header'

const outfit = Outfit({ subsets: ['latin', 'latin-ext'], variable: '--font-outfit' })

export const metadata: Metadata = {
  title: 'SZZ Flashcards',
  description: 'Flashcards for SZZ exam prep — Globální podnikání a management.',
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/sign-in')

  return (
    <html
      lang={user.preferredLanguage ?? 'cs'}
      data-theme={user.preferredTheme ?? 'dark'}
      className={outfit.variable}
    >
      <body>
        <I18nProvider initialLocale={user.preferredLanguage}>
          <ThemeProvider initialTheme={user.preferredTheme}>
            <div className="min-h-dvh flex flex-col">
              <Header user={user} />
              <main className="flex-1 px-4 sm:px-6 max-w-3xl w-full mx-auto pb-12">{children}</main>
            </div>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
