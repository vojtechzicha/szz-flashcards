'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generatePayloadCookie, getPayload } from 'payload'

import config from '@/payload.config'

export type SignInState = { error?: 'invalid' }

/**
 * Sign in with email + password via Payload's local strategy.
 *
 * Invoked as a React Server Action from <form action={signInWithPassword}>.
 * Works without JS and without the pre-hydration GET fallback that leaks
 * credentials into the URL. Sets Payload's standard auth cookie using
 * `generatePayloadCookie` so name/sameSite/secure/maxAge track collection
 * config rather than being hardcoded.
 */
export async function signInWithPassword(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const callbackUrl = safeInternalPath(String(formData.get('callbackUrl') ?? '/app'))

  if (!email || !password) return { error: 'invalid' }

  const payload = await getPayload({ config })

  let token: string | undefined
  try {
    const result = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    token = result.token
  } catch {
    return { error: 'invalid' }
  }
  if (!token) return { error: 'invalid' }

  const cookie = generatePayloadCookie({
    collectionAuthConfig: payload.collections.users.config.auth,
    cookiePrefix: payload.config.cookiePrefix ?? 'payload',
    token,
    returnCookieAsObject: true,
  })

  const cookieStore = await cookies()
  cookieStore.set({
    name: cookie.name,
    value: cookie.value ?? '',
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite?.toLowerCase() as 'lax' | 'strict' | 'none' | undefined,
    path: cookie.path,
    maxAge: cookie.maxAge,
    domain: cookie.domain,
  })

  redirect(callbackUrl)
}

function safeInternalPath(raw: string): string {
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/app'
  return raw
}
