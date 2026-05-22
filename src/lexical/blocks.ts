import type { Block } from 'payload'

export const mathBlockSlug = 'math'
export const mathInlineSlug = 'mathInline'
export const tagBlockSlug = 'tag'

const latexField = {
  name: 'latex',
  type: 'textarea' as const,
  required: true,
  label: { en: 'LaTeX', cs: 'LaTeX' },
  admin: {
    description: {
      en: 'Standard LaTeX (KaTeX subset). Type to preview; toggle "Source" for raw input.',
      cs: 'Standardní LaTeX (KaTeX). Pište pro náhled, „Zdroj" pro přímý zápis.',
    },
    rows: 2,
    components: {
      Field: '@/admin/components/MathField#default',
    },
  },
}

/**
 * Block-level math — standard LaTeX rendered as a centered display equation.
 * Inserted via the toolbar "+" menu; always takes its own line.
 */
export const mathBlock: Block = {
  slug: mathBlockSlug,
  labels: {
    singular: { en: 'Math (block)', cs: 'Matematika (blok)' },
    plural: { en: 'Math', cs: 'Matematika' },
  },
  imageAltText: 'Math',
  fields: [latexField],
}

/**
 * Inline math — standard LaTeX rendered mid-sentence (e.g. "the result is x^2.").
 * Inserted via the inline-block menu; flows inside a paragraph.
 */
export const mathInlineBlock: Block = {
  slug: mathInlineSlug,
  labels: {
    singular: { en: 'Math (inline)', cs: 'Matematika (v řádku)' },
    plural: { en: 'Math (inline)', cs: 'Matematika (v řádku)' },
  },
  imageAltText: 'Inline math',
  fields: [latexField],
  admin: {
    components: {
      Label: '@/admin/components/MathInlineLabel#default',
    },
  },
}

/**
 * Inline block: small pill label.
 * Maps to <span class="tag">LABEL</span>.
 */
export const tagBlock: Block = {
  slug: tagBlockSlug,
  labels: {
    singular: { en: 'Tag', cs: 'Štítek' },
    plural: { en: 'Tags', cs: 'Štítky' },
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      label: { en: 'Label', cs: 'Text' },
    },
  ],
}

export const cardBlocks = [mathBlock]
export const cardInlineBlocks = [mathInlineBlock, tagBlock]
