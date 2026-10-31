import { NextResponse, type NextRequest } from 'next/server'

import { auth } from '@/auth'
import { mintPayloadCookieForEmail } from '@/lib/auth/payload-cookie-bridge'

export const dynamic = 'force-dynamic'

/**
 * Signed in with Google (Auth.js) but Payload's own cookie has expired: re-issue
 * the Payload cookie from the Google session, then continue to `callbackUrl`.
 * Without this, /admin → /sign-in → /admin would loop, because the admin only
 * accepts the Payload cookie while the sign-in page sees the Google session.
 */
export async function GET(req: NextRequest) {
  const callbackUrl = safeInternalPath(req.nextUrl.searchParams.get('callbackUrl'))
  const session = await auth()
  const email = session?.user?.email
  if (!email) {
    return NextResponse.redirect(new URL(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url))
  }

  const cookie = await mintPayloadCookieForEmail(email)
  // No longer on the allow-list: land on the app rather than looping back.
  const res = NextResponse.redirect(new URL(cookie ? callbackUrl : '/app', req.url))
  if (cookie) res.cookies.set(cookie)
  return res
}

function safeInternalPath(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/app'
  return raw
}
