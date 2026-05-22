import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/session'
import { ServerT } from '@/lib/i18n/server'
import { SignInForm } from '@/components/SignInForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const sp = await searchParams
  const user = await getCurrentUser()
  if (user) redirect('/app')

  const t = await ServerT()
  const callbackUrl = safeInternalPath(sp.callbackUrl)
  const errorKey =
    sp.error === 'NotAuthorized' ? t('auth.notAuthorized') : sp.error ? t('auth.invalidCredentials') : null

  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/40 p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">{t('auth.signInTitle')}</h1>
        <p className="text-sm text-[color:var(--color-text-dim)] mb-6">SZZ Flashcards</p>
        {errorKey ? (
          <div className="mb-4 rounded-md border border-[color:var(--color-bad)]/40 bg-[color:var(--color-bad)]/10 text-[color:var(--color-bad)] px-3 py-2 text-sm">
            {errorKey}
          </div>
        ) : null}
        <SignInForm
          callbackUrl={callbackUrl}
          googleOnly={Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)}
          labels={{
            email: t('auth.email'),
            password: t('auth.password'),
            signIn: t('auth.signIn'),
            google: t('auth.signInWithGoogle'),
            invalidCredentials: t('auth.invalidCredentials'),
          }}
        />
      </div>
    </main>
  )
}

function safeInternalPath(raw: string | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/app'
  return raw
}
