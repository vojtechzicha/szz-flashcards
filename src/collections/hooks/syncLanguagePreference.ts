import type { CollectionAfterChangeHook, CollectionAfterLoginHook, PayloadRequest } from 'payload'

/**
 * Syncs `users.preferredLanguage` into:
 *   1. Payload's per-user admin preference (`payload-preferences` row, key=`language`)
 *   2. The `<cookiePrefix>-lng` cookie — Payload reads this via `getRequestLanguage`
 *      to pick the admin UI locale on each request. Without it, the admin keeps
 *      using the previously-cookied language even after the user pref is updated.
 *
 * The hook fires on:
 *   - frontend language toggle PATCHing `/api/users/:id`
 *   - admin editing their user record's `preferredLanguage`
 *   - user login (defensive — fixes drift if anything wrote to prefs directly)
 *
 * `req` must be threaded through to the nested operations: `payload-preferences.user`
 * has a built-in `beforeValidate` hook that nulls the relationship when `req.user`
 * is missing, which then trips the required-field validation.
 *
 * Idempotent: writes only when the stored prefs value differs.
 */
function setLanguageCookie(req: PayloadRequest, language: string): void {
  // `responseHeaders` may be undefined when no auth strategy refreshed cookies;
  // initialize so our Set-Cookie isn't silently dropped (handleEndpoints reads
  // `req.responseHeaders ?? new Headers()` — i.e. discards a fresh Headers
  // unless we attach it back to req).
  if (!req.responseHeaders) {
    ;(req as { responseHeaders: Headers }).responseHeaders = new Headers()
  }
  const cookiePrefix = (req.payload.config as { cookiePrefix?: string }).cookiePrefix || 'payload'
  const oneYear = 60 * 60 * 24 * 365
  req.responseHeaders!.append(
    'Set-Cookie',
    `${cookiePrefix}-lng=${language}; Path=/; Max-Age=${oneYear}; SameSite=Lax`,
  )
}

async function writePreference(
  req: PayloadRequest,
  userId: string | number,
  language: string,
): Promise<void> {
  if (!language) return
  const existing = await req.payload.find({
    collection: 'payload-preferences',
    where: {
      and: [
        { 'user.value': { equals: userId } },
        { key: { equals: 'language' } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })

  if (existing.docs.length > 0) {
    const cur = existing.docs[0]
    if (cur.value === language) return
    await req.payload.update({
      collection: 'payload-preferences',
      id: cur.id,
      data: { value: language },
      overrideAccess: true,
      req,
    })
  } else {
    await req.payload.create({
      collection: 'payload-preferences',
      data: {
        user: { relationTo: 'users', value: String(userId) },
        key: 'language',
        value: language,
      },
      overrideAccess: true,
      req,
    })
  }
}

export const syncLanguageOnChange: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  if (operation !== 'create' && operation !== 'update') return doc
  const next = (doc as { preferredLanguage?: string }).preferredLanguage
  if (!next) return doc
  // First-user creation runs with `req.user == null` (the new user isn't
  // authenticated yet). Writing to `payload-preferences` in that state trips
  // its built-in beforeValidate hook that nulls the `user` relationship and
  // fails required-field validation. Skip here; `syncLanguageOnLogin` runs
  // immediately after registerFirstUser via `payload.login` and writes the
  // preference once `req.user` is populated.
  if (!req.user) return doc
  // Always run writePreference: it has its own idempotent skip when the prefs
  // value already matches. Earlier we gated on `prev !== next`, but that meant
  // a previous failed save could leave prefs out of sync with the user record
  // and never recover.
  await writePreference(req, (doc as { id: string | number }).id, next)
  // Only flip the admin cookie when the change is being made by the same user —
  // an admin editing someone else's record shouldn't have their own admin UI
  // re-locale itself.
  const reqUser = req.user as { id?: string | number } | null | undefined
  const docId = (doc as { id: string | number }).id
  if (reqUser?.id != null && String(reqUser.id) === String(docId)) {
    setLanguageCookie(req, next)
  }
  return doc
}

export const syncLanguageOnLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  const lang = (user as { preferredLanguage?: string }).preferredLanguage
  if (lang) {
    await writePreference(req, (user as { id: string | number }).id, lang)
    setLanguageCookie(req, lang)
  }
  return user
}
