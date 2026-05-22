import type { CollectionAfterChangeHook, CollectionAfterLoginHook, PayloadRequest } from 'payload'

/**
 * Syncs `users.preferredTheme` into the Payload admin's per-user theme
 * preference (`payload-preferences` row, key=`theme`) so the admin UI
 * matches the app theme the user picked in the frontend.
 *
 * Unlike language, Payload reads admin theme on the client at mount time,
 * so there is no `<cookiePrefix>-theme` cookie to set.
 *
 * Mirrors `syncLanguagePreference` exactly otherwise; see that file for the
 * full rationale behind `req` threading and the first-user skip.
 */
async function writeThemePreference(
  req: PayloadRequest,
  userId: string | number,
  theme: string,
): Promise<void> {
  if (!theme) return
  const existing = await req.payload.find({
    collection: 'payload-preferences',
    where: {
      and: [
        { 'user.value': { equals: userId } },
        { key: { equals: 'theme' } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })

  if (existing.docs.length > 0) {
    const cur = existing.docs[0]
    if (cur.value === theme) return
    await req.payload.update({
      collection: 'payload-preferences',
      id: cur.id,
      data: { value: theme },
      overrideAccess: true,
      req,
    })
  } else {
    await req.payload.create({
      collection: 'payload-preferences',
      data: {
        user: { relationTo: 'users', value: String(userId) },
        key: 'theme',
        value: theme,
      },
      overrideAccess: true,
      req,
    })
  }
}

export const syncThemeOnChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') return doc
  const next = (doc as { preferredTheme?: string }).preferredTheme
  if (!next) return doc
  if (!req.user) return doc
  await writeThemePreference(req, (doc as { id: string | number }).id, next)
  return doc
}

export const syncThemeOnLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  const theme = (user as { preferredTheme?: string }).preferredTheme
  if (theme) {
    await writeThemePreference(req, (user as { id: string | number }).id, theme)
  }
  return user
}
