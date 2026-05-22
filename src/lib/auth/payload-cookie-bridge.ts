import { randomUUID } from 'node:crypto'
import {
  generatePayloadCookie,
  getFieldsToSign,
  getPayload,
  jwtSign,
  type SanitizedCollectionConfig,
} from 'payload'

import config from '@/payload.config'

export type PayloadCookieSpec = {
  name: string
  value: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
  path?: string
  maxAge?: number
  domain?: string
}

/**
 * Mint a Payload-compatible auth cookie for the user with this email.
 * Returns null if the email is not on the Payload `users` allow-list.
 *
 * Replicates Payload's internal login mechanics enough to produce a token
 * that `/admin` accepts:
 *   1. Append a session id to `users.sessions` (Payload defaults to
 *      `auth.useSessions: true`; tokens missing a known sid are rejected).
 *   2. Sign the standard payload claim set with `jwtSign`.
 *   3. Wrap in the cookie shape Payload itself emits via
 *      `generatePayloadCookie`.
 */
export async function mintPayloadCookieForEmail(rawEmail: string): Promise<PayloadCookieSpec | null> {
  const email = rawEmail.toLowerCase()
  const payload = await getPayload({ config })
  const collectionConfig = payload.collections.users.config as SanitizedCollectionConfig

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (found.totalDocs === 0) return null
  const user = found.docs[0] as UserWithSessions

  let sid: string | undefined
  if (collectionConfig.auth.useSessions !== false) {
    sid = randomUUID()
    const now = new Date()
    const tokenExpiration = collectionConfig.auth.tokenExpiration ?? 7200
    const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)
    const sessions = removeExpiredSessions(user.sessions ?? [])
    sessions.push({ id: sid, createdAt: now, expiresAt })
    await payload.db.updateOne({
      collection: 'users',
      id: user.id,
      data: { sessions, updatedAt: null },
      returning: false,
    })
  }

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: user.email,
    sid,
    user: { ...user, collection: 'users' } as never,
  })

  const secret = payload.secret ?? process.env.PAYLOAD_SECRET
  if (!secret) return null

  const { token } = await jwtSign({
    fieldsToSign,
    secret,
    tokenExpiration: collectionConfig.auth.tokenExpiration ?? 7200,
  })

  const cookie = generatePayloadCookie({
    collectionAuthConfig: collectionConfig.auth,
    cookiePrefix: payload.config.cookiePrefix ?? 'payload',
    token,
    returnCookieAsObject: true,
  })

  return {
    name: cookie.name,
    value: cookie.value ?? '',
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none' | undefined,
    path: cookie.path,
    maxAge: cookie.maxAge,
    domain: cookie.domain,
  }
}

type SessionEntry = { id: string; createdAt: Date | string; expiresAt: Date | string }
type UserWithSessions = {
  id: string | number
  email: string
  sessions?: SessionEntry[]
}

function removeExpiredSessions(sessions: SessionEntry[]): SessionEntry[] {
  const now = new Date()
  return sessions.filter(({ expiresAt }) => {
    const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt)
    return expiry > now
  })
}
