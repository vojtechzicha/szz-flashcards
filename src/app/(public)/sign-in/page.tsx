import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/session'
import { payloadClient } from '@/lib/payload-client'
import { ServerT } from '@/lib/i18n/server'
import { SignInForm } from '@/components/SignInForm'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>
}) {
  const sp = await searchParams
  const callbackUrl = safeInternalPath(sp.callbackUrl)
  const user = await getCurrentUser()
  if (user) {
    // Already signed in: continue where the sign-in was requested (admin, Claude's
    // connector consent). If only the Google session is left, Payload's cookie
    // must be re-issued first or /admin would send us straight back here.
    const payload = await payloadClient()
    const payloadAuth = await payload.auth({ headers: await headers() })
    if (payloadAuth.user) redirect(callbackUrl)
    redirect(`/sign-in/continue?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  const t = await ServerT()
  const errorKey =
    sp.error === 'NotAuthorized' ? t('auth.notAuthorized') : sp.error ? t('auth.invalidCredentials') : null

  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/40 p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">{t('auth.signInTitle')}</h1>
        <p className="text-sm text-[color:var(--color-text-dim)] mb-6">Study Cards</p>
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
