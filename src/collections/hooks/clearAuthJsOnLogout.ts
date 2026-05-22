import type { CollectionAfterLogoutHook } from 'payload'

/**
 * When a user logs out of Payload admin we also need to tear down the
 * Auth.js (Google) session — otherwise the proxy at /admin would
 * silently re-mint a fresh `payload-token` on the next request and the
 * logout would be a no-op.
 *
 * `signOut` is imported lazily so this module stays safe to load from
 * the Payload config (which is evaluated in contexts where the Auth.js
 * runtime isn't necessarily ready).
 */
export const clearAuthJsOnLogout: CollectionAfterLogoutHook = async () => {
  const { signOut } = await import('@/auth')
  try {
    await signOut({ redirect: false })
  } catch {
    // Auth.js throws if there is no active session — safe to ignore;
    // the user simply wasn't on the Google path.
  }
}
