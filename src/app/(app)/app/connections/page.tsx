import Link from 'next/link'
import { headers } from 'next/headers'

import { getCurrentUser } from '@/lib/auth/session'
import { getServerLocale, ServerT } from '@/lib/i18n/server'
import { revokeMcpConnection } from '@/lib/mcp/actions'
import { MCP_SCOPES, getMcpResourceUrl, getPublicOrigin } from '@/lib/mcp/oauth'
import { getStore } from '@/lib/mcp/store'

export const dynamic = 'force-dynamic'

// Connector address and the Claude apps connected to this account, with revoke.
export default async function ConnectionsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const t = await ServerT()
  const locale = await getServerLocale()
  const mcpUrl = getMcpResourceUrl(getPublicOrigin(await headers()))

  const grants = (await getStore().listActiveGrants()).filter(
    (g) => user.role === 'admin' || g.user_id === String(user.id),
  )
  const fmt = (iso: string | null | undefined) =>
    iso ? new Date(iso).toLocaleString(locale === 'cs' ? 'cs-CZ' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : t('mcp.never')

  return (
    <section className="pt-8">
      <Link href="/app" className="text-sm text-[color:var(--color-text-dim)] hover:text-[color:var(--color-text)]">
        ← {t('common.back')}
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2 mb-6">{t('mcp.connectionsTitle')}</h1>

      <div className="rounded-xl border border-[color:var(--color-border)] p-4 space-y-3 mb-8">
        <p className="text-sm text-[color:var(--color-text-dim)]">{t('mcp.connectionsIntro')}</p>
        <div>
          <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-faint)] mb-1">{t('mcp.connectorUrl')}</p>
          <code className="block break-all rounded-md bg-[color:var(--color-bg-hover)] px-3 py-2 text-sm">{mcpUrl}</code>
        </div>
        <code className="block break-all rounded-md bg-[color:var(--color-bg-hover)] px-3 py-2 text-sm">
          claude mcp add --transport http --scope user study-cards {mcpUrl}
        </code>
      </div>

      {grants.length === 0 ? (
        <p className="text-[color:var(--color-text-dim)]">{t('mcp.noConnections')}</p>
      ) : (
        <ul className="space-y-3">
          {grants.map((g) => (
            <li
              key={String(g._id)}
              className="rounded-xl border border-[color:var(--color-border)] p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium">
                  {g.client_name}{' '}
                  <span className="text-sm font-normal text-[color:var(--color-text-dim)]">
                    · {(g.scopes as string[]).includes(MCP_SCOPES.WRITE) ? t('mcp.canWrite') : t('mcp.canRead')}
                  </span>
                </p>
                <p className="text-sm text-[color:var(--color-text-dim)]">
                  {user.role === 'admin' ? `${g.email} · ` : ''}
                  {t('mcp.connectedAt')} {fmt(g.created_at)} · {t('mcp.lastUsed')} {fmt(g.last_used_at)}
                </p>
              </div>
              <form action={revokeMcpConnection}>
                <input type="hidden" name="grantId" value={String(g._id)} />
                <button
                  type="submit"
                  className="shrink-0 rounded-md border border-[color:var(--color-border)] px-3 py-1.5 text-sm hover:bg-[color:var(--color-bg-hover)]"
                >
                  {t('mcp.revoke')}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
