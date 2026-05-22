import { Fragment, type ReactNode } from 'react'
import katex from 'katex'

import { mathBlockSlug, mathInlineSlug, tagBlockSlug } from './blocks'

type LexicalNode = {
  type: string
  version?: number
  text?: string
  format?: number | string
  url?: string
  fields?: Record<string, unknown> & { blockType?: string }
  children?: LexicalNode[]
  tag?: string
  listType?: 'number' | 'bullet'
  direction?: 'ltr' | 'rtl' | null
}

export type LexicalContent = {
  root: LexicalNode
} | null | undefined

const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 1 << 1,
  STRIKETHROUGH: 1 << 2,
  UNDERLINE: 1 << 3,
  CODE: 1 << 4,
  SUBSCRIPT: 1 << 5,
  SUPERSCRIPT: 1 << 6,
} as const

function toNumber(format: number | string | undefined): number {
  if (typeof format === 'number') return format
  return 0
}

function renderText(node: LexicalNode, key: string): ReactNode {
  let el: ReactNode = node.text ?? ''
  const fmt = toNumber(node.format)
  if (fmt & TEXT_FORMAT.BOLD) el = <strong>{el}</strong>
  if (fmt & TEXT_FORMAT.ITALIC) el = <em>{el}</em>
  if (fmt & TEXT_FORMAT.UNDERLINE) el = <u>{el}</u>
  if (fmt & TEXT_FORMAT.STRIKETHROUGH) el = <s>{el}</s>
  if (fmt & TEXT_FORMAT.CODE) el = <code>{el}</code>
  if (fmt & TEXT_FORMAT.SUBSCRIPT) el = <sub>{el}</sub>
  if (fmt & TEXT_FORMAT.SUPERSCRIPT) el = <sup>{el}</sup>
  return <Fragment key={key}>{el}</Fragment>
}

function renderChildren(children: LexicalNode[] | undefined, prefix: string): ReactNode[] {
  if (!children) return []
  return children.map((child, i) => renderNode(child, `${prefix}.${i}`))
}

function renderMath(latex: string, display: boolean, key: string): ReactNode {
  let html: string
  try {
    html = katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: 'ignore',
      output: 'html',
    })
  } catch {
    html = `<span class="math-error">${escapeHtml(latex)}</span>`
  }
  if (display) {
    return <div key={key} className="math-block" dangerouslySetInnerHTML={{ __html: html }} />
  }
  return <span key={key} className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderBlock(node: LexicalNode, key: string): ReactNode {
  const fields = node.fields ?? {}
  const blockType = fields.blockType
  if (blockType === mathBlockSlug) {
    return renderMath(String(fields.latex ?? ''), true, key)
  }
  if (blockType === mathInlineSlug) {
    return renderMath(String(fields.latex ?? ''), false, key)
  }
  if (blockType === tagBlockSlug) {
    return (
      <span key={key} className="tag">
        {String(fields.label ?? '')}
      </span>
    )
  }
  return null
}

function renderNode(node: LexicalNode, key: string): ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'paragraph':
      return <p key={key}>{renderChildren(node.children, key)}</p>
    case 'heading': {
      const Tag = (node.tag ?? 'h3') as 'h3' | 'h4'
      return <Tag key={key}>{renderChildren(node.children, key)}</Tag>
    }
    case 'list': {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return <Tag key={key}>{renderChildren(node.children, key)}</Tag>
    }
    case 'listitem':
      return <li key={key}>{renderChildren(node.children, key)}</li>
    case 'link':
      return (
        <a key={key} href={node.url ?? '#'} target="_blank" rel="noreferrer">
          {renderChildren(node.children, key)}
        </a>
      )
    case 'linebreak':
      return <br key={key} />
    case 'block':
    case 'inlineBlock':
      return renderBlock(node, key)
    default:
      return <Fragment key={key}>{renderChildren(node.children, key)}</Fragment>
  }
}

export function LexicalRenderer({ content }: { content: LexicalContent }) {
  if (!content?.root?.children) return null
  return <>{content.root.children.map((child, i) => renderNode(child, String(i)))}</>
}
