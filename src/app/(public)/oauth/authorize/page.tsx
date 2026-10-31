import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/session'
import { ServerT } from '@/lib/i18n/server'
import { decideMcpAuthorization } from '@/lib/mcp/actions'
import { MCP_SCOPES, getPublicOrigin, validateAuthorizeRequest } from '@/lib/mcp/oauth'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Connect Claude — Study Cards',
  robots: { index: false },
}

// OAuth authorization endpoint for the MCP connector (see src/lib/mcp/oauth.ts).
export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const params = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  ) as Record<string, string | undefined>
  const t = await ServerT()

  const origin = getPublicOrigin(await headers())
  const validation = await validateAuthorizeRequest(params, origin)
  if (!validation.ok) {
    if (validation.redirectTo) redirect(validation.redirectTo)
    return (
      <Shell title={t('mcp.errorTitle')}>
        <p className="rounded-md border border-[color:var(--color-bad)]/40 bg-[color:var(--color-bad)]/10 text-[color:var(--color-bad)] px-3 py-2 text-sm">
          {validation.error}
        </p>
      </Shell>
    )
  }

  const user = await getCurrentUser()
  if (!user) {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/oauth/authorize?${query}`)}`)
  }

  const { request } = validation
  const canWrite = user.role === 'admin' && request.scopes.includes(MCP_SCOPES.WRITE)

  return (
    <Shell title={t('mcp.consentTitle')} subtitle={t('mcp.consentDesc', { client: request.clientName })}>
      <form action={decideMcpAuthorization} className="space-y-5">
        <input type="hidden" name="params" value={JSON.stringify(params)} />

        {canWrite ? (
          <fieldset className="space-y-2">
            <label className="flex items-start gap-3 rounded-lg border border-[color:var(--color-border)] p-3 cursor-pointer">
              <input type="radio" name="access" value="write" defaultChecked className="mt-1" />
              <span>
                <span className="block font-medium">{t('mcp.accessWrite')}</span>
                <span className="block text-sm text-[color:var(--color-text-dim)]">{t('mcp.accessWriteDesc')}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-[color:var(--color-border)] p-3 cursor-pointer">
              <input type="radio" name="access" value="read" className="mt-1" />
              <span className="font-medium">{t('mcp.accessRead')}</span>
            </label>
          </fieldset>
        ) : (
          <>
            <input type="hidden" name="access" value="read" />
            {request.scopes.includes(MCP_SCOPES.WRITE) ? (
              <p className="text-sm text-[color:var(--color-text-dim)]">{t('mcp.readOnlyNote')}</p>
            ) : null}
          </>
        )}

        <dl className="rounded-lg bg-[color:var(--color-bg-hover)]/60 p-3 text-sm space-y-1">
          <div className="flex gap-2">
            <dt className="text-[color:var(--color-text-dim)]">{t('mcp.account')}:</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-[color:var(--color-text-dim)]">{t('mcp.returnTo')}:</dt>
            <dd>{new URL(request.redirectUri).host}</dd>
          </div>
        </dl>

        <div className="flex gap-3">
          <button
            type="submit"
            name="decision"
            value="deny"
            className="flex-1 rounded-md border border-[color:var(--color-border)] px-4 py-2.5 font-medium hover:bg-[color:var(--color-bg-hover)]"
          >
            {t('mcp.deny')}
          </button>
          <button
            type="submit"
            name="decision"
            value="allow"
            className="flex-1 rounded-md bg-[color:var(--color-accent)] text-black font-medium px-4 py-2.5"
          >
            {t('mcp.allow')}
          </button>
        </div>
      </form>
    </Shell>
  )
}

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)]/40 p-6 sm:p-8">
        <p className="text-sm text-[color:var(--color-text-dim)] mb-1">Study Cards</p>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
        {subtitle ? <p className="text-sm text-[color:var(--color-text-dim)] mb-6">{subtitle}</p> : <div className="mb-4" />}
        {children}
      </div>
    </main>
  )
}
