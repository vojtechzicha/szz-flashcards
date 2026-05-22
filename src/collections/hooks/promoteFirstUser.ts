import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Promote the very first user created in this Payload instance to `admin`.
 *
 * Payload's first-run form lets you pick a role, but it defaults to `user`,
 * which would lock the bootstrap admin out of `/admin` (Users.access.admin
 * requires role === 'admin'). This hook removes that footgun: when the
 * collection is empty, the next created user becomes the admin regardless
 * of what the form posted.
 */
export const promoteFirstUser: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })
  if (totalDocs === 0) return { ...data, role: 'admin' }

  return data
}
