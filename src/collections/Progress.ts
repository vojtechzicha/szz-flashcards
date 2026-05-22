import type { CollectionConfig } from 'payload'
import { adminOrOwnerWhere, isAdmin, isSignedIn } from '@/access'

export const Progress: CollectionConfig = {
  slug: 'progress',
  labels: {
    singular: { en: 'Progress', cs: 'Pokrok' },
    plural: { en: 'Progress', cs: 'Pokrok' },
  },
  admin: {
    useAsTitle: 'id',
    group: { en: 'System', cs: 'Systém' },
    defaultColumns: ['user', 'card', 'state', 'lastSeenAt'],
  },
  access: {
    read: adminOrOwnerWhere,
    create: isSignedIn,
    update: adminOrOwnerWhere,
    delete: isAdmin,
  },
  indexes: [
    {
      fields: ['user', 'card'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      label: { en: 'User', cs: 'Uživatel' },
    },
    {
      name: 'card',
      type: 'relationship',
      relationTo: 'cards',
      required: true,
      index: true,
      label: { en: 'Card', cs: 'Kartička' },
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'unseen',
      label: { en: 'State', cs: 'Stav' },
      options: [
        { label: { en: 'Unseen', cs: 'Neviděné' }, value: 'unseen' },
        { label: { en: 'Known', cs: 'Známé' }, value: 'known' },
        { label: { en: 'Unknown', cs: 'Neznámé' }, value: 'unknown' },
      ],
    },
    {
      name: 'knownCount',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Known count', cs: 'Počet "vím"' },
    },
    {
      name: 'unknownCount',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Unknown count', cs: 'Počet "nevím"' },
    },
    {
      name: 'lastSeenAt',
      type: 'date',
      label: { en: 'Last seen', cs: 'Naposledy viděno' },
    },
  ],
}
