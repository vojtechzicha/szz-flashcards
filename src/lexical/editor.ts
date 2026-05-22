import {
  BlocksFeature,
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  SubscriptFeature,
  SuperscriptFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { cardBlocks, cardInlineBlocks } from './blocks'

/**
 * Rich-text editor used for Card front/back fields.
 *
 * Built-in features cover everything the legacy 302 cards use except for
 * the two SZZ-specific primitives (LaTeX math block, inline tag pill),
 * which are exposed as Payload Blocks (toolbar "+" button).
 *
 * The math block accepts standard LaTeX and is rendered with KaTeX
 * (`src/lexical/render.tsx`). The admin editor for the LaTeX field is a
 * MathLive-powered WYSIWYG with a raw-source toggle.
 */
export const cardEditor = lexicalEditor({
  features: () => [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    LinkFeature({ enabledCollections: [] }),
    InlineToolbarFeature(),
    BlocksFeature({
      blocks: cardBlocks,
      inlineBlocks: cardInlineBlocks,
    }),
  ],
})
