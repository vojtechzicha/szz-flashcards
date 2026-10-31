import crypto from 'node:crypto'

import type { MongooseAdapter } from '@payloadcms/db-mongodb'

import { payloadClient } from '@/lib/payload-client'

// Storage for the MCP connector: OAuth clients, codes, grants, tokens and the
// audit log. Plain MongoDB collections on Payload's connection, kept out of the
// Payload admin. Codes and tokens are stored only as SHA-256 hashes under _id.
// expires_at is a Date so TTL indexes prune expired rows.

type Row = Record<string, any>
// The driver's types live in a transitive dependency (mongodb via mongoose), so
// describe only what this file uses.
type Collection = {
  insertOne(doc: Row): Promise<unknown>
  findOne(filter: Row): Promise<Row | null>
  findOneAndDelete(filter: Row): Promise<Row | null>
  findOneAndUpdate(filter: Row, update: Row): Promise<Row | null>
  updateOne(filter: Row, update: Row): Promise<unknown>
  deleteOne(filter: Row): Promise<unknown>
  deleteMany(filter: Row): Promise<unknown>
  createIndex(spec: Row, options?: Row): Promise<string>
  find(filter: Row): { sort(spec: Row): { limit(n: number): { toArray(): Promise<Row[]> }; toArray(): Promise<Row[]> } }
}
type Db = { collection(name: string): Collection }

let indexes: Promise<void> | null = null

async function getDb(): Promise<Db> {
  const payload = await payloadClient()
  const db = (payload.db as unknown as MongooseAdapter).connection.db as unknown as Db | undefined
  if (!db) throw new Error('MongoDB connection is not ready.')
  return db
}

function ensureIndexes(db: Db) {
  if (!indexes) {
    indexes = Promise.all([
      db.collection('mcp_auth_codes').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }),
      db.collection('mcp_tokens').createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 }),
      db.collection('mcp_tokens').createIndex({ grant_id: 1 }),
      db.collection('mcp_audit').createIndex({ at: -1 }),
    ])
      .then(() => undefined)
      .catch((err) => {
        indexes = null
        throw err
      })
  }
  return indexes
}

async function col(name: string): Promise<Collection> {
  const db = await getDb()
  await ensureIndexes(db)
  return db.collection(name)
}

const newId = () => crypto.randomBytes(12).toString('hex')
const now = () => new Date().toISOString()

export interface McpStore {
  createClient(data: Row): Promise<Row>
  getClient(id: string): Promise<Row | null>
  createAuthCode(hash: string, data: Row): Promise<void>
  consumeAuthCode(hash: string): Promise<Row | null>
  createGrant(data: Row): Promise<Row>
  getGrant(id: string): Promise<Row | null>
  listActiveGrants(): Promise<Row[]>
  touchGrant(id: string): Promise<void>
  revokeGrant(id: string): Promise<void>
  insertToken(hash: string, data: Row): Promise<void>
  getToken(hash: string): Promise<Row | null>
  claimRefreshToken(hash: string): Promise<Row | null>
  deleteToken(hash: string): Promise<void>
  insertAudit(data: Row): Promise<void>
  listAudit(limit: number, filter?: { collection?: string; documentId?: string }): Promise<Row[]>
}

export const mongoStore: McpStore = {
  async createClient(data) {
    const doc = { _id: newId() as any, ...data, created_at: now() }
    await (await col('mcp_clients')).insertOne(doc)
    return doc
  },
  async getClient(id) {
    return (await col('mcp_clients')).findOne({ _id: id as any })
  },
  async createAuthCode(hash, data) {
    await (await col('mcp_auth_codes')).insertOne({ _id: hash as any, ...data, created_at: now() })
  },
  async consumeAuthCode(hash) {
    return (await col('mcp_auth_codes')).findOneAndDelete({ _id: hash as any })
  },
  async createGrant(data) {
    const doc = { _id: newId() as any, ...data, revoked_at: null, last_used_at: null, created_at: now() }
    await (await col('mcp_grants')).insertOne(doc)
    return doc
  },
  async getGrant(id) {
    return (await col('mcp_grants')).findOne({ _id: id as any })
  },
  async listActiveGrants() {
    return (await col('mcp_grants')).find({ revoked_at: null }).sort({ created_at: -1 }).toArray()
  },
  async touchGrant(id) {
    await (await col('mcp_grants')).updateOne({ _id: id as any }, { $set: { last_used_at: now() } })
  },
  async revokeGrant(id) {
    await (await col('mcp_grants')).updateOne({ _id: id as any, revoked_at: null }, { $set: { revoked_at: now() } })
    await (await col('mcp_tokens')).deleteMany({ grant_id: id })
  },
  async insertToken(hash, data) {
    await (await col('mcp_tokens')).insertOne({ _id: hash as any, ...data, used_at: null, created_at: now() })
  },
  async getToken(hash) {
    return (await col('mcp_tokens')).findOne({ _id: hash as any })
  },
  async claimRefreshToken(hash) {
    // Atomic, so two concurrent refreshes can't both succeed.
    return (await col('mcp_tokens')).findOneAndUpdate(
      { _id: hash as any, kind: 'refresh', used_at: null },
      { $set: { used_at: now() } },
    )
  },
  async deleteToken(hash) {
    await (await col('mcp_tokens')).deleteOne({ _id: hash as any })
  },
  async insertAudit(data) {
    await (await col('mcp_audit')).insertOne({ _id: newId() as any, ...data, at: now() })
  },
  async listAudit(limit, filter = {}) {
    const query: Row = {}
    if (filter.collection) query.collection = filter.collection
    if (filter.documentId) query.document_id = filter.documentId
    return (await col('mcp_audit')).find(query).sort({ at: -1 }).limit(limit).toArray()
  },
}

// Tests swap in an in-memory store.
let active: McpStore = mongoStore

export function getStore(): McpStore {
  return active
}

export function setStoreForTests(store: McpStore | null) {
  active = store ?? mongoStore
}
