'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { getCurrentUser } from '@/lib/auth/session'
import {
  MCP_SCOPES,
  buildRedirect,
  getPublicOrigin,
  issueAuthorizationCode,
  validateAuthorizeRequest,
  type McpUser,
} from '@/lib/mcp/oauth'
import { getStore } from '@/lib/mcp/store'

function readParams(formData: FormData): Record<string, string | undefined> {
  try {
    const parsed = JSON.parse(String(formData.get('params') ?? '{}'))
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, v]) => typeof v === 'string'),
    ) as Record<string, string>
  } catch {
    return {}
  }
}

// The consent page posts the original authorize query back here, so the request is
// validated again on the server rather than trusted from the page.
export async function decideMcpAuthorization(formData: FormData) {
  const params = readParams(formData)
  const user = await getCurrentUser()
  if (!user) {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/oauth/authorize?${query}`)}`)
  }

  const origin = getPublicOrigin(await headers())
  const validation = await validateAuthorizeRequest(params, origin)
  if (!validation.ok) {
    redirect(validation.redirectTo ?? `/oauth/authorize?${new URLSearchParams(params as Record<string, string>)}`)
  }
  const { request } = validation

  if (formData.get('decision') !== 'allow') {
    redirect(buildRedirect(request.redirectUri, { error: 'access_denied', state: request.state, iss: origin }))
  }

  const mcpUser: McpUser = { id: String(user.id), email: user.email, name: user.name ?? null, role: user.role }
  const allowWrite = formData.get('access') === 'write'
  const scopes = allowWrite ? request.scopes : request.scopes.filter((s) => s === MCP_SCOPES.READ)
  const code = await issueAuthorizationCode(request, mcpUser, scopes)
  redirect(buildRedirect(request.redirectUri, { code, state: request.state, iss: origin }))
}

export async function revokeMcpConnection(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) return
  const id = String(formData.get('grantId') ?? '')
  const store = getStore()
  const grant = await store.getGrant(id)
  if (!grant) return
  if (user.role !== 'admin' && grant.user_id !== String(user.id)) return
  await store.revokeGrant(id)
  revalidatePath('/app/connections')
}
