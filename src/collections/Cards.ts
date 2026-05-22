import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { isAdmin, isSignedIn } from '@/access'
import { cardEditor } from '@/lexical/editor'

const enforceTopicMatchesSubject: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data?.subject) return data
  const subjectId =
    typeof data.subject === 'object' ? (data.subject as { id?: string | number }).id : data.subject
  if (!subjectId) return data

  const subject = await req.payload.findByID({
    collection: 'subjects',
    id: subjectId as string,
    depth: 0,
    overrideAccess: true,
  })
  const mode = (subject as { mode?: string }).mode

  if (mode === 'flat') {
    if (data.topic) {
      throw new Error(
        'This subject is "flat" — cards must NOT have a topic. Either clear the topic or switch the subject to topical.',
      )
    }
  } else if (mode === 'topical') {
    if (!data.topic) {
      throw new Error('This subject is topical — cards must belong to a topic.')
    }
    const topicId =
      typeof data.topic === 'object' ? (data.topic as { id?: string | number }).id : data.topic
    const topic = await req.payload.findByID({
      collection: 'topics',
      id: topicId as string,
      depth: 0,
      overrideAccess: true,
    })
    const topicSubjectId =
      typeof (topic as { subject?: unknown }).subject === 'object'
        ? ((topic as { subject?: { id?: string | number } }).subject?.id ?? null)
        : (topic as { subject?: string | number }).subject
    if (String(topicSubjectId) !== String(subjectId)) {
      throw new Error('The selected topic does not belong to the selected subject.')
    }
  }

  return data
}

export const Cards: CollectionConfig = {
  slug: 'cards',
  labels: {
    singular: { en: 'Card', cs: 'Kartička' },
    plural: { en: 'Cards', cs: 'Kartičky' },
  },
  admin: {
    useAsTitle: 'preview',
    group: { en: 'Content', cs: 'Obsah' },
    defaultColumns: ['preview', 'subject', 'topic', 'order'],
  },
  access: {
    read: isSignedIn,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeValidate: [enforceTopicMatchesSubject],
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
      name: 'topic',
      type: 'relationship',
      relationTo: 'topics',
      index: true,
      label: { en: 'Topic', cs: 'Téma' },
      filterOptions: ({ siblingData }) => {
        const subject = (siblingData as { subject?: unknown } | null)?.subject
        const subjectId =
          subject && typeof subject === 'object'
            ? (subject as { id?: string | number }).id
            : (subject as string | number | undefined)
        if (!subjectId) return false
        return { subject: { equals: subjectId } }
      },
      admin: {
        components: {
          Field: '@/admin/components/TopicField#default',
        },
      },
    },
    {
      name: 'front',
      type: 'richText',
      required: true,
      label: { en: 'Front', cs: 'Přední strana' },
      editor: cardEditor,
    },
    {
      name: 'back',
      type: 'richText',
      required: true,
      label: { en: 'Back', cs: 'Zadní strana' },
      editor: cardEditor,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: { en: 'Order', cs: 'Pořadí' },
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/OrderField#default',
        },
      },
    },
    {
      name: 'sidebarPreview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/admin/components/CardSidebarPreview#default',
        },
      },
    },
    /* Auto-populated from `front` and consumed by `useAsTitle` plus the
       admin list. Hidden from the edit form (the live previews above
       replace it) via a no-op Field component, but still shown as the
       first column in the list view. */
    {
      name: 'preview',
      type: 'text',
      label: { en: 'Preview', cs: 'Náhled' },
      admin: {
        components: {
          Field: '@/admin/components/HiddenField#default',
        },
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            const front = data?.front
            if (!front || typeof front !== 'object') return undefined
            return extractPlainText(front).slice(0, 80)
          },
        ],
      },
    },
  ],
}

function extractPlainText(node: unknown): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  const n = node as { text?: string; children?: unknown[]; root?: unknown }
  if (typeof n.text === 'string') return n.text
  if (n.root) return extractPlainText(n.root)
  if (Array.isArray(n.children)) return n.children.map(extractPlainText).join(' ').trim()
  return ''
}
