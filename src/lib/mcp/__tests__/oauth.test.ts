import crypto from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { memoryStore } from './memory-store'

// Payload is only used to look users up; stand in a tiny users table.
const users = new Map<string, Record<string, any>>()
vi.mock('@/lib/payload-client', () => ({
  payloadClient: async () => ({
    findByID: async ({ id }: { id: string }) => {
      const user = users.get(id)
      if (!user) throw new Error('NotFound')
      return user
    },
  }),
}))

const { setStoreForTests } = await import('@/lib/mcp/store')
const oauth = await import('@/lib/mcp/oauth')

const ORIGIN = 'https://cards.example'
const REDIRECT = 'https://claude.ai/api/mcp/auth_callback'

const pkce = () => {
  const verifier = crypto.randomBytes(32).toString('base64url')
  return { verifier, challenge: crypto.createHash('sha256').update(verifier).digest('base64url') }
}

let store: ReturnType<typeof memoryStore>

beforeEach(() => {
  store = memoryStore()
  setStoreForTests(store)
  users.clear()
  users.set('u1', { id: 'u1', email: 'admin@example.test', role: 'admin' })
  users.set('u2', { id: 'u2', email: 'reader@example.test', role: 'user' })
})

afterEach(() => setStoreForTests(null))

async function connect(userId = 'u1', scope = 'cards:read cards:write') {
  const client = await oauth.registerClient({ client_name: 'Claude', redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none' })
  const { verifier, challenge } = pkce()
  const validation = await oauth.validateAuthorizeRequest(
    {
      client_id: client.client_id,
      redirect_uri: REDIRECT,
      response_type: 'code',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      scope,
      state: 's',
    },
    ORIGIN,
  )
  if (!validation.ok) throw new Error(validation.error)
  const user = (await oauth.loadMcpUser(userId))!
  const code = await oauth.issueAuthorizationCode(validation.request, user, validation.request.scopes)
  const clientRow = (await store.getClient(client.client_id))!
  const tokens = await oauth.exchangeAuthorizationCode(
    new URLSearchParams({ code, code_verifier: verifier, redirect_uri: REDIRECT }),
    clientRow,
    ORIGIN,
  )
  return { client: clientRow, tokens, code, verifier }
}

describe('MCP OAuth', () => {
  it('only accepts Claude and loopback redirect URIs', () => {
    expect(oauth.isAllowedRedirectUri(REDIRECT)).toBe(true)
    expect(oauth.isAllowedRedirectUri('http://localhost:53682/callback')).toBe(true)
    expect(oauth.isAllowedRedirectUri('https://evil.example/cb')).toBe(false)
    expect(oauth.isAllowedRedirectUri('http://example.com/cb')).toBe(false)
  })

  it('runs the code flow and authenticates MCP requests', async () => {
    const { tokens } = await connect()
    expect(tokens.scope).toBe('cards:read cards:write')
    const auth = await oauth.verifyAccessToken(tokens.access_token, ORIGIN)
    expect(auth?.user.email).toBe('admin@example.test')
    expect(auth?.scopes).toEqual(['cards:read', 'cards:write'])
  })

  it('binds tokens to the issuing origin', async () => {
    const { tokens } = await connect()
    expect(await oauth.verifyAccessToken(tokens.access_token, 'https://preview.example')).toBeNull()
  })

  it('codes are single use', async () => {
    const { client, code, verifier } = await connect()
    await expect(
      oauth.exchangeAuthorizationCode(new URLSearchParams({ code, code_verifier: verifier }), client, ORIGIN),
    ).rejects.toThrow(/invalid or expired/)
  })

  it('rejects a wrong PKCE verifier', async () => {
    const client = await oauth.registerClient({ redirect_uris: [REDIRECT], token_endpoint_auth_method: 'none' })
    const { challenge } = pkce()
    const v = await oauth.validateAuthorizeRequest(
      { client_id: client.client_id, response_type: 'code', code_challenge: challenge, code_challenge_method: 'S256' },
      ORIGIN,
    )
    if (!v.ok) throw new Error(v.error)
    const code = await oauth.issueAuthorizationCode(v.request, (await oauth.loadMcpUser('u1'))!, v.request.scopes)
    await expect(
      oauth.exchangeAuthorizationCode(
        new URLSearchParams({ code, code_verifier: pkce().verifier }),
        (await store.getClient(client.client_id))!,
        ORIGIN,
      ),
    ).rejects.toThrow(/PKCE/)
  })

  it('never grants write access to non-admins', async () => {
    const { tokens } = await connect('u2')
    expect(tokens.scope).toBe('cards:read')
  })

  it('drops write access when an admin is demoted, and all access when the user is deleted', async () => {
    const { tokens } = await connect()
    users.set('u1', { ...users.get('u1'), role: 'user' })
    expect((await oauth.verifyAccessToken(tokens.access_token, ORIGIN))?.scopes).toEqual(['cards:read'])
    users.delete('u1')
    expect(await oauth.verifyAccessToken(tokens.access_token, ORIGIN)).toBeNull()
  })

  it('rotates refresh tokens and revokes the grant on reuse', async () => {
    const { client, tokens } = await connect()
    const next = await oauth.refreshAccessToken(new URLSearchParams({ refresh_token: tokens.refresh_token }), client)
    expect(next.refresh_token).not.toBe(tokens.refresh_token)
    await expect(
      oauth.refreshAccessToken(new URLSearchParams({ refresh_token: tokens.refresh_token }), client),
    ).rejects.toThrow(/invalid/)
    expect(await oauth.verifyAccessToken(next.access_token, ORIGIN)).toBeNull()
  })

  it('refresh can narrow but not widen scopes', async () => {
    const { client, tokens } = await connect('u1', 'cards:read')
    await expect(
      oauth.refreshAccessToken(new URLSearchParams({ refresh_token: tokens.refresh_token, scope: 'cards:write' }), client),
    ).rejects.toThrow(/cannot add/)
  })
})
