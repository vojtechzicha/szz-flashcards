import type { McpStore } from '@/lib/mcp/store'

type Row = Record<string, any>

/** In-memory McpStore for tests. */
export function memoryStore(): McpStore & { tables: Record<string, Map<string, Row>> } {
  const tables: Record<string, Map<string, Row>> = {
    clients: new Map(),
    codes: new Map(),
    grants: new Map(),
    tokens: new Map(),
    audit: new Map(),
  }
  let seq = 0
  const id = () => `id${++seq}`
  return {
    tables,
    async createClient(data) {
      const doc = { _id: id(), ...data }
      tables.clients.set(doc._id, doc)
      return doc
    },
    async getClient(cid) {
      return tables.clients.get(cid) ?? null
    },
    async createAuthCode(hash, data) {
      tables.codes.set(hash, { _id: hash, ...data })
    },
    async consumeAuthCode(hash) {
      const row = tables.codes.get(hash) ?? null
      tables.codes.delete(hash)
      return row
    },
    async createGrant(data) {
      const doc = { _id: id(), ...data, revoked_at: null, last_used_at: null, created_at: new Date().toISOString() }
      tables.grants.set(doc._id, doc)
      return doc
    },
    async getGrant(gid) {
      return tables.grants.get(gid) ?? null
    },
    async listActiveGrants() {
      return [...tables.grants.values()].filter((g) => !g.revoked_at)
    },
    async touchGrant(gid) {
      const g = tables.grants.get(gid)
      if (g) g.last_used_at = new Date().toISOString()
    },
    async revokeGrant(gid) {
      const g = tables.grants.get(gid)
      if (g && !g.revoked_at) g.revoked_at = new Date().toISOString()
      for (const [hash, t] of tables.tokens) if (t.grant_id === gid) tables.tokens.delete(hash)
    },
    async insertToken(hash, data) {
      tables.tokens.set(hash, { _id: hash, ...data, used_at: null })
    },
    async getToken(hash) {
      return tables.tokens.get(hash) ?? null
    },
    async claimRefreshToken(hash) {
      const t = tables.tokens.get(hash)
      if (!t || t.kind !== 'refresh' || t.used_at) return null
      const before = { ...t }
      t.used_at = new Date().toISOString()
      return before
    },
    async deleteToken(hash) {
      tables.tokens.delete(hash)
    },
    async insertAudit(data) {
      const doc = { _id: id(), ...data, at: new Date().toISOString() }
      tables.audit.set(doc._id, doc)
    },
    async listAudit(limit) {
      return [...tables.audit.values()].reverse().slice(0, limit)
    },
  }
}
