import type { CollectionConfig } from 'payload'
import { isAdmin, isSignedIn } from '@/access'

const slugify = (input: string) =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const Studies: CollectionConfig = {
  slug: 'studies',
  labels: {
    singular: { en: 'Study', cs: 'Studium' },
    plural: { en: 'Studies', cs: 'Studia' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Content', cs: 'Obsah' },
    defaultColumns: ['title', 'slug', 'order'],
  },
  access: {
    read: isSignedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: { en: 'Title', cs: 'Název' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: { en: 'Slug', cs: 'Slug' },
      admin: {
        description: {
          en: 'Auto-generated from title if left empty.',
          cs: 'Pokud je prázdné, vygeneruje se z názvu.',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) return slugify(String(data.title))
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: { en: 'Description', cs: 'Popis' },
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
