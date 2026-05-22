import { cookies } from 'next/headers'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { getPayload } from 'payload'

import config from './payload.config'
import { mintPayloadCookieForEmail } from './lib/auth/payload-cookie-bridge'

/**
 * Auth.js (NextAuth v5) wired to use Payload as the user store.
 * - Google sign-in only succeeds if a User with the same email already exists in Payload.
 *   This implements the admin-curated allow-list (no auto-provisioning).
 * - On first successful Google sign-in for a user, we backfill their `googleId`.
 * - The Auth.js session cookie is independent of Payload's email/password JWT cookie;
 *   `payloadAuthFromAuthJs()` (server util) maps the Auth.js session back to a Payload user
 *   for server-side data fetches.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return false
      const email = user.email ?? profile?.email
      if (!email) return false

      const payload = await getPayload({ config })
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: email.toLowerCase() } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })

      if (existing.totalDocs === 0) {
        // Allow-list miss → block.
        return '/sign-in?error=NotAuthorized'
      }

      // Backfill googleId on first OAuth login.
      const found = existing.docs[0] as { id: string | number; googleId?: string | null }
      const googleSub = (profile as { sub?: string } | undefined)?.sub
      if (googleSub && !found.googleId) {
        await payload.update({
          collection: 'users',
          id: found.id,
          data: { googleId: googleSub },
          overrideAccess: true,
        })
      }

      // Stamp Payload's auth cookie now so `/admin` is reachable in the
      // same browser session. `cookies().set()` works here because the
      // signIn callback runs inside the OAuth callback Route Handler,
      // during request handling.
      const cookie = await mintPayloadCookieForEmail(email)
      if (cookie) {
        const cookieStore = await cookies()
        cookieStore.set(cookie)
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.email) token.email = user.email
      return token
    },
    async session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string
      return session
    },
  },
})
