import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cs as csTranslations } from '@payloadcms/translations/languages/cs'
import { en as enTranslations } from '@payloadcms/translations/languages/en'
import { buildConfig } from 'payload'

import { Cards } from '@/collections/Cards'
import { Progress } from '@/collections/Progress'
import { Studies } from '@/collections/Studies'
import { Subjects } from '@/collections/Subjects'
import { Topics } from '@/collections/Topics'
import { Users } from '@/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Reverse-direction sync for preferences the admin manages internally
 * (language, theme): when Payload writes to `payload-preferences`, mirror
 * the change back to the user record. The forward hooks (in
 * collections/hooks/sync{Language,Theme}Preference.ts) skip writes when
 * values already match, so the resulting cycle terminates after one
 * round-trip.
 */
const reversePreferenceSync = async (payload: {
  collections: Record<string, { config: { hooks?: Record<string, unknown[]> } }>
}) => {
  const prefsCollection = payload.collections?.['payload-preferences']
  if (!prefsCollection) return
  const config = prefsCollection.config
  if (!config.hooks) config.hooks = {}
  if (!Array.isArray(config.hooks.afterChange)) config.hooks.afterChange = []
  ;(config.hooks.afterChange as unknown[]).push(async ({ doc, req }: any) => {
    const key = doc?.key
    if (key !== 'language' && key !== 'theme') return doc
    // `doc.user.value` may be either the raw id (depth=0) or the populated
    // user document (depth>0); afterChange typically gives us the populated
    // form, so normalize to the id before passing it to findByID/update.
    const rawUserValue = doc?.user?.value
    const userValue =
      rawUserValue && typeof rawUserValue === 'object'
        ? (rawUserValue as { id?: string | number }).id
        : rawUserValue
    const value = doc?.value
    if (!userValue) return doc

    if (key === 'language') {
      if (value !== 'cs' && value !== 'en') return doc
      const fresh = await req.payload.findByID({
        collection: 'users',
        id: userValue,
        depth: 0,
        overrideAccess: true,
        req,
      })
      if (!fresh || fresh.preferredLanguage === value) return doc
      await req.payload.update({
        collection: 'users',
        id: userValue,
        data: { preferredLanguage: value },
        overrideAccess: true,
        req,
      })
      return doc
    }

    // key === 'theme'
    // Payload admin stores 'light' | 'dark' | 'auto'. We only mirror the
    // two concrete values; 'auto' (OS-driven) doesn't have an app equivalent.
    if (value !== 'light' && value !== 'dark') return doc
    const fresh = await req.payload.findByID({
      collection: 'users',
      id: userValue,
      depth: 0,
      overrideAccess: true,
      req,
    })
    if (!fresh || fresh.preferredTheme === value) return doc
    await req.payload.update({
      collection: 'users',
      id: userValue,
      data: { preferredTheme: value },
      overrideAccess: true,
      req,
    })
    return doc
  })
}

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— SZZ Flashcards',
    },
    components: {
      graphics: {
        Logo: '@/admin/components/Logo#default',
        Icon: '@/admin/components/Icon#default',
      },
      beforeNavLinks: ['@/admin/components/BackToApp#default'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Studies, Subjects, Topics, Cards, Progress],
  // Default editor for non-card rich text (currently unused but registered for future fields).
  editor: lexicalEditor(),
  // Bilingual admin UI.
  i18n: {
    supportedLanguages: { cs: csTranslations, en: enTranslations },
    fallbackLanguage: 'cs',
  },
  secret: process.env.PAYLOAD_SECRET ?? 'dev-only-insecure-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI ?? 'mongodb://localhost:27017/szz-flashcards',
  }),
  graphQL: {
    disable: false,
  },
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'],
  onInit: async (payload) => {
    await reversePreferenceSync(payload as unknown as Parameters<typeof reversePreferenceSync>[0])
  },
})
