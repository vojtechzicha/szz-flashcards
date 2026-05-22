import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel, isAdminOrSelf } from '@/access'
import { promoteFirstUser } from './hooks/promoteFirstUser'
import { syncLanguageOnChange, syncLanguageOnLogin } from './hooks/syncLanguagePreference'
import { syncThemeOnChange, syncThemeOnLogin } from './hooks/syncThemePreference'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: { en: 'User', cs: 'Uživatel' },
    plural: { en: 'Users', cs: 'Uživatelé' },
  },
  admin: {
    useAsTitle: 'email',
    group: { en: 'System', cs: 'Systém' },
    defaultColumns: ['email', 'role', 'preferredLanguage', 'preferredTheme'],
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 14, // 14 days
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => (req.user as { role?: string } | null | undefined)?.role === 'admin',
  },
  hooks: {
    beforeChange: [promoteFirstUser],
    afterChange: [syncLanguageOnChange, syncThemeOnChange],
    afterLogin: [syncLanguageOnLogin, syncThemeOnLogin],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: { en: 'Name', cs: 'Jméno' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: async ({ req }) => {
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        })
        return totalDocs === 0 ? 'admin' : 'user'
      },
      label: { en: 'Role', cs: 'Role' },
      options: [
        { label: { en: 'Admin', cs: 'Správce' }, value: 'admin' },
        { label: { en: 'User', cs: 'Uživatel' }, value: 'user' },
      ],
      access: {
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'preferredLanguage',
      type: 'select',
      required: true,
      defaultValue: 'cs',
      label: { en: 'Preferred language', cs: 'Preferovaný jazyk' },
      options: [
        { label: { en: 'Čeština', cs: 'Čeština' }, value: 'cs' },
        { label: { en: 'English', cs: 'Angličtina' }, value: 'en' },
      ],
      admin: {
        components: {
          afterInput: ['@/admin/components/LanguageRefresher#default'],
        },
      },
    },
    {
      name: 'preferredTheme',
      type: 'select',
      required: true,
      defaultValue: 'dark',
      label: { en: 'Preferred theme', cs: 'Preferovaný vzhled' },
      options: [
        { label: { en: 'Dark', cs: 'Tmavý' }, value: 'dark' },
        { label: { en: 'Light', cs: 'Světlý' }, value: 'light' },
      ],
    },
    {
      name: 'googleId',
      type: 'text',
      label: { en: 'Google account ID', cs: 'ID Google účtu' },
      admin: {
        description: {
          en: 'Set automatically on first Google sign-in.',
          cs: 'Vyplní se automaticky při prvním přihlášení přes Google.',
        },
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
  ],
}
