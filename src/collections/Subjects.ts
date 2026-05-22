import type { CollectionConfig } from 'payload'
import { isAdmin, isSignedIn } from '@/access'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  labels: {
    singular: { en: 'Subject', cs: 'Předmět' },
    plural: { en: 'Subjects', cs: 'Předměty' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Content', cs: 'Obsah' },
    defaultColumns: ['title', 'study', 'mode', 'order'],
  },
  access: {
    read: isSignedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'study',
      type: 'relationship',
      relationTo: 'studies',
      required: true,
      index: true,
      label: { en: 'Study', cs: 'Studium' },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { en: 'Title', cs: 'Název' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', cs: 'Popis' },
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      defaultValue: 'topical',
      label: { en: 'Structure', cs: 'Struktura' },
      options: [
        {
          label: { en: 'Flat (cards directly)', cs: 'Plochá (kartičky přímo)' },
          value: 'flat',
        },
        {
          label: { en: 'Topical (organized into topics)', cs: 'S tématy' },
          value: 'topical',
        },
      ],
      admin: {
        description: {
          en: 'Flat subjects hold cards directly. Topical subjects have child Topics; cards live under a topic.',
          cs: 'Plochý předmět má kartičky přímo. Předmět s tématy má podřazená Témata a kartičky patří pod téma.',
        },
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Order', cs: 'Pořadí' },
      admin: { position: 'sidebar' },
    },
  ],
}
