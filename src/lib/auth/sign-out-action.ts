'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { signOut } from '@/auth'
import config from '@/payload.config'

/**
 * Sign out from both auth paths:
 * - Auth.js (Google) — clears its own session cookies via signOut().
 * - Payload local strategy — clear the payload auth cookie ourselves.
 *
 * Used as a Server Action so we don't need a CSRF token in the form
 * (NextAuth v5's bare /api/auth/signout endpoint rejects POSTs without one).
 */
export async function signOutAction() {
  await signOut({ redirect: false })

  const payload = await getPayload({ config })
  const prefix = payload.config.cookiePrefix ?? 'payload'
  const cookieStore = await cookies()
  cookieStore.delete(`${prefix}-token`)

  redirect('/sign-in')
}
