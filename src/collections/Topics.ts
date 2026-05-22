import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { isAdmin, isSignedIn } from '@/access'

const requireTopicalSubject: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.subject) return data
  const subjectId = typeof data.subject === 'object' ? (data.subject as { id?: string | number }).id : data.subject
  if (!subjectId) return data
  const subject = await req.payload.findByID({
    collection: 'subjects',
    id: subjectId as string,
    depth: 0,
    overrideAccess: true,
  })
  if ((subject as { mode?: string }).mode !== 'topical') {
    throw new Error(
      'Topics may only be created under subjects whose structure is "topical". Switch the subject to topical first or attach the card directly to a flat subject.',
    )
  }
  return data
}

export const Topics: CollectionConfig = {
  slug: 'topics',
  labels: {
    singular: { en: 'Topic', cs: 'Téma' },
    plural: { en: 'Topics', cs: 'Témata' },
  },
  admin: {
    useAsTitle: 'title',
    group: { en: 'Content', cs: 'Obsah' },
    defaultColumns: ['title', 'subject', 'order'],
  },
  access: {
    read: isSignedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [requireTopicalSubject],
  },
  fields: [
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      index: true,
      label: { en: 'Subject', cs: 'Předmět' },
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
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Order', cs: 'Pořadí' },
      admin: { position: 'sidebar' },
    },
  ],
}
