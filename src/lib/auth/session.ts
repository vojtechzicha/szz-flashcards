import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { auth } from '@/auth'

export type AppUser = {
  id: string | number
  email: string
  name?: string | null
  role: 'admin' | 'user'
  preferredLanguage: 'cs' | 'en'
  preferredTheme: 'dark' | 'light'
}

/**
 * Resolve the currently signed-in app user, regardless of which auth path
 * (Payload local-strategy email/password OR Auth.js Google) was used.
 *
 * Both paths converge on the Payload `users` collection, which is the source
 * of truth for role and preferred language.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  const payload = await getPayload({ config })

  // 1. Try Payload's own auth (email/password JWT cookie) via headers().
  const headers = await nextHeaders()
  const payloadAuth = await payload.auth({ headers })
  if (payloadAuth.user?.email) {
    return toAppUser(payloadAuth.user as RawUser)
  }

  // 2. Fall back to the Auth.js (Google) session.
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (!email) return null

  const found = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (found.totalDocs === 0) return null
  return toAppUser(found.docs[0] as RawUser)
}

type RawUser = {
  id: string | number
  email: string
  name?: string | null
  role?: string
  preferredLanguage?: string
  preferredTheme?: string
}

function toAppUser(u: RawUser): AppUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name ?? null,
    role: u.role === 'admin' ? 'admin' : 'user',
    preferredLanguage: u.preferredLanguage === 'en' ? 'en' : 'cs',
    preferredTheme: u.preferredTheme === 'light' ? 'light' : 'dark',
  }
}
