import crypto from 'node:crypto'

import katex from 'katex'

import { codeBlockSlug, mathBlockSlug, mathInlineSlug, tagBlockSlug } from './blocks'

/**
 * Card Markdown: the text format MCP clients (Claude) use to read and write
 * card faces. It maps one-to-one onto what the card editor can produce, so a
 * card read through `lexicalToMarkdown` and written back unchanged keeps its
 * structure.
 *
 *   Paragraphs        blank line between them; a single newline is a line break
 *   Headings          `### Heading` (h3), `#### Heading` (h4)
 *   Lists             `- item` / `1. item`, nest by indenting
 *   Inline            **bold**, *italic*, ~~strike~~, `code`, <u>underline</u>,
 *                     <sub>sub</sub>, <sup>sup</sup>, [text](https://url)
 *   Math              $inline LaTeX$, and a display formula on its own lines: $$ … $$
 *   Code block        ```lang … ``` fences at the start of a line, content verbatim
 *   Tag pill          <tag>Label</tag>
 *   Escapes           \* \_ \$ \` \[ \< \~ \\ \#
 */

export const CARD_MARKDOWN_GUIDE = `Card faces are written in Card Markdown:
- Paragraphs are separated by a blank line; a single newline inside a paragraph is a line break.
- Headings: "### Heading" (h3) and "#### Heading" (h4).
- Lists: "- item" or "1. item"; indent by 2 spaces to nest.
- Inline: **bold**, *italic*, ~~strike~~, \`code\`, <u>underline</u>, <sub>sub</sub>, <sup>sup</sup>, [text](https://url).
- Math is KaTeX LaTeX: inline $E = mc^2$; a display formula goes on its own line(s) as $$\\frac{a}{b}$$. Wrap words inside math in \\text{…} (Czech diacritics must be in \\text).
- Code block (monospace, whitespace kept, nothing inside is interpreted): a line \`\`\`lang, the code lines, then a closing \`\`\` line. The language tag is optional and turns on syntax highlighting for: netlogo, python (py), javascript (js, mongo), typescript (ts), java, c, cpp, csharp (cs), php, r, sql, pgsql, bash (sh), shell, powershell, json, yaml (yml), xml (html), css, markdown (md), dockerfile, ini (toml); any other tag renders as plain monospace. Fences start at the beginning of a line, not inside list items.
- Tag pill (small uppercase label): <tag>Label</tag>.
- Escape literal characters with a backslash: \\* \\_ \\$ \\\` \\[ \\< \\~ \\\\ \\#.`

// ─── Lexical node shapes ────────────────────────────────────────────────────

type LexNode = Record<string, any>
export type LexicalDoc = { root: LexNode }

const FMT = {
  BOLD: 1,
  ITALIC: 1 << 1,
  STRIKETHROUGH: 1 << 2,
  UNDERLINE: 1 << 3,
  CODE: 1 << 4,
  SUBSCRIPT: 1 << 5,
  SUPERSCRIPT: 1 << 6,
} as const

const blockId = () => crypto.randomBytes(12).toString('hex')

const textNode = (text: string, format = 0): LexNode => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (children: LexNode[]): LexNode => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  textFormat: 0,
  textStyle: '',
  children,
})

const heading = (tag: 'h3' | 'h4', children: LexNode[]): LexNode => ({
  type: 'heading',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  tag,
  children,
})

const list = (listType: 'bullet' | 'number', items: LexNode[], indent: number): LexNode => ({
  type: 'list',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  listType,
  start: 1,
  tag: listType === 'bullet' ? 'ul' : 'ol',
  children: items.map((item, i) => ({ ...item, value: i + 1, indent })),
})

const listItem = (children: LexNode[]): LexNode => ({
  type: 'listitem',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  value: 1,
  children,
})

const mathBlock = (latex: string): LexNode => ({
  type: 'block',
  format: '',
  version: 2,
  fields: { id: blockId(), blockName: '', blockType: mathBlockSlug, latex },
})

const codeBlock = (code: string, language: string): LexNode => ({
  type: 'block',
  format: '',
  version: 2,
  fields: { id: blockId(), blockName: '', blockType: codeBlockSlug, language, code },
})

const inlineBlock = (blockType: string, fields: Record<string, unknown>): LexNode => ({
  type: 'inlineBlock',
  version: 1,
  fields: { id: blockId(), blockName: '', blockType, ...fields },
})

const linkNode = (url: string, children: LexNode[]): LexNode => ({
  type: 'link',
  format: '',
  indent: 0,
  version: 3,
  direction: null,
  fields: { linkType: 'custom', newTab: true, url },
  id: blockId(),
  children,
})

const linebreak = (): LexNode => ({ type: 'linebreak', version: 1 })

// ─── Markdown → Lexical ─────────────────────────────────────────────────────

export class CardMarkdownError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CardMarkdownError'
  }
}

export interface MarkdownParseResult {
  doc: LexicalDoc
  /** Math that KaTeX could not parse. The card is still stored as written. */
  mathErrors: string[]
}

const LIST_LINE = /^(\s*)([-*+]|\d{1,3}[.)])\s+(.*)$/
const HEADING_LINE = /^(#{1,6})\s+(.*)$/
const FENCE_OPEN = /^(`{3,})[ \t]*([\w+#.-]*)[ \t]*$/

export function markdownToLexical(markdown: string): MarkdownParseResult {
  const mathErrors: string[] = []
  const children: LexNode[] = []
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    // Code block: ```lang … ``` with the content kept verbatim.
    const fence = FENCE_OPEN.exec(line)
    if (fence) {
      const close = new RegExp(`^\`{${fence[1].length},}[ \t]*$`)
      const body: string[] = []
      i++
      let closed = false
      while (i < lines.length) {
        const l = lines[i]
        i++
        if (close.test(l)) {
          closed = true
          break
        }
        body.push(l)
      }
      if (!closed) throw new CardMarkdownError('Unclosed ``` code block.')
      const code = body.join('\n').replace(/\s+$/, '')
      if (!code.trim()) throw new CardMarkdownError('Empty ``` code block.')
      children.push(codeBlock(code, fence[2]))
      continue
    }

    // Display math: "$$ … $$" on one line, or opened and closed on their own lines.
    if (trimmed.startsWith('$$')) {
      const rest = trimmed.slice(2)
      let latex: string
      const sameLineEnd = rest.lastIndexOf('$$')
      if (sameLineEnd !== -1 && rest.slice(sameLineEnd + 2).trim() === '') {
        latex = rest.slice(0, sameLineEnd)
        i++
      } else {
        const body = [rest]
        i++
        let closed = false
        while (i < lines.length) {
          const l = lines[i]
          i++
          const end = l.lastIndexOf('$$')
          if (end !== -1 && l.slice(end + 2).trim() === '') {
            body.push(l.slice(0, end))
            closed = true
            break
          }
          body.push(l)
        }
        if (!closed) throw new CardMarkdownError('Unclosed $$ display formula.')
        latex = body.join('\n')
      }
      latex = latex.trim()
      if (!latex) throw new CardMarkdownError('Empty $$ $$ display formula.')
      checkLatex(latex, true, mathErrors)
      children.push(mathBlock(latex))
      continue
    }

    const headingMatch = HEADING_LINE.exec(trimmed)
    if (headingMatch && !line.startsWith(' ')) {
      const tag = headingMatch[1].length >= 4 ? 'h4' : 'h3'
      children.push(heading(tag, parseInline(headingMatch[2].trim(), mathErrors)))
      i++
      continue
    }

    if (LIST_LINE.test(line)) {
      const listLines: string[] = []
      while (i < lines.length && lines[i].trim() && (LIST_LINE.test(lines[i]) || /^\s+\S/.test(lines[i]))) {
        listLines.push(lines[i])
        i++
      }
      children.push(...parseList(listLines, mathErrors))
      continue
    }

    // Paragraph: consecutive lines until a blank line or another block starts.
    const paraLines: string[] = []
    while (i < lines.length) {
      const l = lines[i]
      const t = l.trim()
      if (!t) break
      if (
        paraLines.length > 0 &&
        (t.startsWith('$$') || FENCE_OPEN.test(l) || LIST_LINE.test(l) || (HEADING_LINE.test(t) && !l.startsWith(' ')))
      ) {
        break
      }
      paraLines.push(t)
      i++
    }
    const inline: LexNode[] = []
    paraLines.forEach((l, idx) => {
      if (idx > 0) inline.push(linebreak())
      inline.push(...parseInline(l, mathErrors))
    })
    children.push(paragraph(inline))
  }

  if (children.length === 0) {
    throw new CardMarkdownError('Card face is empty.')
  }

  return {
    doc: {
      root: { type: 'root', format: '', indent: 0, version: 1, direction: null, children },
    },
    mathErrors,
  }
}

interface ListEntry {
  indent: number
  ordered: boolean
  text: string
}

function parseList(lines: string[], mathErrors: string[]): LexNode[] {
  // Continuation lines (indented, not list markers) join the previous item as a line break.
  const entries: ListEntry[] = []
  for (const line of lines) {
    const m = LIST_LINE.exec(line)
    if (m) {
      entries.push({ indent: m[1].replace(/\t/g, '  ').length, ordered: /\d/.test(m[2]), text: m[3] })
    } else if (entries.length > 0) {
      entries[entries.length - 1].text += '\n' + line.trim()
    }
  }

  let pos = 0
  const build = (depth: number): LexNode[] => {
    const lists: LexNode[] = []
    const baseIndent = entries[pos].indent
    let items: LexNode[] = []
    let ordered = entries[pos].ordered

    const flush = () => {
      if (items.length) lists.push(list(ordered ? 'number' : 'bullet', items, depth))
      items = []
    }

    while (pos < entries.length && entries[pos].indent >= baseIndent) {
      const entry = entries[pos]
      if (entry.indent > baseIndent) {
        // Nested list: Lexical keeps it in its own list item after the parent item.
        const nested = build(depth + 1)
        for (const n of nested) items.push(listItem([n]))
        continue
      }
      if (entry.ordered !== ordered) {
        flush()
        ordered = entry.ordered
      }
      const inline: LexNode[] = []
      entry.text.split('\n').forEach((part, idx) => {
        if (idx > 0) inline.push(linebreak())
        inline.push(...parseInline(part.trim(), mathErrors))
      })
      items.push(listItem(inline))
      pos++
    }
    flush()
    return lists
  }

  const out: LexNode[] = []
  while (pos < entries.length) out.push(...build(0))
  return out
}

function checkLatex(latex: string, display: boolean, errors: string[]) {
  try {
    katex.renderToString(latex, { displayMode: display, throwOnError: true, strict: 'ignore' })
  } catch (err) {
    const message = err instanceof Error ? err.message.replace(/^KaTeX parse error: /, '') : String(err)
    errors.push(`${display ? '$$' : '$'}${latex}${display ? '$$' : '$'}: ${message}`)
  }
}

const ESCAPABLE = new Set(['\\', '*', '_', '$', '`', '[', ']', '<', '>', '~', '#', '-', '+', '.', '(', ')', '!', '|', '{', '}'])

const HTML_TAGS: Record<string, number | 'tag'> = {
  u: FMT.UNDERLINE,
  sub: FMT.SUBSCRIPT,
  sup: FMT.SUPERSCRIPT,
  b: FMT.BOLD,
  strong: FMT.BOLD,
  i: FMT.ITALIC,
  em: FMT.ITALIC,
  s: FMT.STRIKETHROUGH,
  tag: 'tag',
}

const isWordChar = (c: string | undefined) => !!c && /[\p{L}\p{N}]/u.test(c)
const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c)

/** Index of the closing `$` of inline math opened at `start`, or -1. */
function findMathEnd(s: string, start: number): number {
  const double = s.startsWith('$$', start)
  const open = double ? 2 : 1
  if (isSpace(s[start + open])) return -1
  for (let j = start + open; j < s.length; j++) {
    if (s[j] === '\\') {
      j++
      continue
    }
    if (double) {
      if (s.startsWith('$$', j) && !isSpace(s[j - 1])) return j
    } else if (s[j] === '$' && !isSpace(s[j - 1]) && !/\d/.test(s[j + 1] ?? '')) {
      return j
    }
  }
  return -1
}

/**
 * Index of the next unescaped `delim` at or after `from`, skipping code spans
 * and inline math, or -1.
 */
function findCloser(s: string, from: number, delim: string, check?: (idx: number) => boolean): number {
  for (let j = from; j < s.length; j++) {
    const c = s[j]
    if (c === '\\') {
      j++
      continue
    }
    if (s.startsWith(delim, j) && (!check || check(j))) return j
    if (c === '`') {
      const end = s.indexOf('`', j + 1)
      if (end !== -1) j = end
      continue
    }
    if (c === '$') {
      const end = findMathEnd(s, j)
      if (end !== -1) j = end + (s.startsWith('$$', j) ? 1 : 0)
    }
  }
  return -1
}

function parseInline(s: string, mathErrors: string[], format = 0): LexNode[] {
  const out: LexNode[] = []
  let buf = ''

  const flush = () => {
    if (!buf) return
    const last = out[out.length - 1]
    if (last?.type === 'text' && last.format === format) last.text += buf
    else out.push(textNode(buf, format))
    buf = ''
  }
  const pushAll = (nodes: LexNode[]) => {
    flush()
    for (const n of nodes) {
      const last = out[out.length - 1]
      if (n.type === 'text' && last?.type === 'text' && last.format === n.format) last.text += n.text
      else out.push(n)
    }
  }

  let i = 0
  while (i < s.length) {
    const c = s[i]

    if (c === '\\' && i + 1 < s.length && ESCAPABLE.has(s[i + 1])) {
      buf += s[i + 1]
      i += 2
      continue
    }

    if (c === '$') {
      const end = findMathEnd(s, i)
      if (end !== -1) {
        const double = s.startsWith('$$', i)
        const latex = s.slice(i + (double ? 2 : 1), end).trim()
        checkLatex(latex, false, mathErrors)
        flush()
        out.push(inlineBlock(mathInlineSlug, { latex }))
        i = end + (double ? 2 : 1)
        continue
      }
    }

    if (c === '`') {
      const end = s.indexOf('`', i + 1)
      if (end > i + 1) {
        pushAll([textNode(s.slice(i + 1, end), format | FMT.CODE)])
        i = end + 1
        continue
      }
    }

    if (s.startsWith('***', i) && !isSpace(s[i + 3])) {
      const end = findCloser(s, i + 3, '***', (j) => !isSpace(s[j - 1]))
      if (end > i + 3) {
        pushAll(parseInline(s.slice(i + 3, end), mathErrors, format | FMT.BOLD | FMT.ITALIC))
        i = end + 3
        continue
      }
    }

    if (s.startsWith('**', i) || s.startsWith('__', i)) {
      const delim = s.slice(i, i + 2)
      if (!isSpace(s[i + 2])) {
        const end = findCloser(s, i + 2, delim, (j) => !isSpace(s[j - 1]))
        if (end > i + 2) {
          pushAll(parseInline(s.slice(i + 2, end), mathErrors, format | FMT.BOLD))
          i = end + 2
          continue
        }
      }
    }

    if (s.startsWith('~~', i) && !isSpace(s[i + 2])) {
      const end = findCloser(s, i + 2, '~~', (j) => !isSpace(s[j - 1]))
      if (end > i + 2) {
        pushAll(parseInline(s.slice(i + 2, end), mathErrors, format | FMT.STRIKETHROUGH))
        i = end + 2
        continue
      }
    }

    if ((c === '*' || c === '_') && !isSpace(s[i + 1]) && s[i + 1] !== c) {
      // `_` only opens/closes at word boundaries, so snake_case stays literal.
      const opens = c === '*' || !isWordChar(s[i - 1])
      if (opens) {
        const end = findCloser(
          s,
          i + 1,
          c,
          (j) => !isSpace(s[j - 1]) && s[j + 1] !== c && s[j - 1] !== c && (c === '*' || !isWordChar(s[j + 1])),
        )
        if (end > i + 1) {
          pushAll(parseInline(s.slice(i + 1, end), mathErrors, format | FMT.ITALIC))
          i = end + 1
          continue
        }
      }
    }

    if (c === '<') {
      const m = /^<(br)\s*\/?>/i.exec(s.slice(i))
      if (m) {
        flush()
        out.push(linebreak())
        i += m[0].length
        continue
      }
      const open = /^<([a-z]+)>/i.exec(s.slice(i))
      const kind = open ? HTML_TAGS[open[1].toLowerCase()] : undefined
      if (open && kind !== undefined) {
        const closeTag = `</${open[1]}>`
        const end = s.toLowerCase().indexOf(closeTag.toLowerCase(), i + open[0].length)
        if (end !== -1) {
          const inner = s.slice(i + open[0].length, end)
          if (kind === 'tag') {
            const label = unescapeText(inner).trim()
            if (label) {
              flush()
              out.push(inlineBlock(tagBlockSlug, { label }))
            }
          } else {
            pushAll(parseInline(inner, mathErrors, format | kind))
          }
          i = end + closeTag.length
          continue
        }
      }
    }

    if (c === '[') {
      const close = findCloser(s, i + 1, ']')
      if (close !== -1 && s[close + 1] === '(') {
        const urlEnd = s.indexOf(')', close + 2)
        const url = urlEnd !== -1 ? s.slice(close + 2, urlEnd).trim() : ''
        if (url && /^(https?:|mailto:)/i.test(url)) {
          const label = parseInline(s.slice(i + 1, close), mathErrors, format)
          flush()
          out.push(linkNode(url, label.length ? label : [textNode(url, format)]))
          i = urlEnd + 1
          continue
        }
      }
    }

    buf += c
    i++
  }
  flush()
  return out
}

function unescapeText(s: string): string {
  return s.replace(/\\(.)/g, (m, ch) => (ESCAPABLE.has(ch) ? ch : m))
}

// ─── Lexical → Markdown ─────────────────────────────────────────────────────

export interface MarkdownSerializeResult {
  markdown: string
  /**
   * Parts of the card that Card Markdown can't express (unknown nodes, text
   * alignment, colours). Writing the Markdown back would drop them.
   */
  lossy: string[]
}

export function lexicalToMarkdown(doc: unknown): MarkdownSerializeResult {
  const lossy = new Set<string>()
  const root = (doc as LexicalDoc | null | undefined)?.root
  const blocks: string[] = []
  for (const node of root?.children ?? []) {
    const md = serializeBlock(node, lossy)
    if (md !== null) blocks.push(md)
  }
  return { markdown: blocks.join('\n\n'), lossy: [...lossy] }
}

function serializeBlock(node: LexNode, lossy: Set<string>): string | null {
  if (node.format && typeof node.format === 'string') lossy.add(`text alignment (${node.format})`)
  switch (node.type) {
    case 'paragraph': {
      const text = serializeInline(node.children ?? [], lossy)
      if (!text.trim()) return null
      return escapeLineStart(text)
    }
    case 'heading': {
      const hashes = node.tag === 'h4' || node.tag === 'h5' || node.tag === 'h6' ? '####' : '###'
      if (!['h3', 'h4'].includes(node.tag)) lossy.add(`heading level ${node.tag}`)
      return `${hashes} ${serializeInline(node.children ?? [], lossy)}`
    }
    case 'list':
      return serializeList(node, 0, lossy)
    case 'block': {
      const fields = node.fields ?? {}
      if (fields.blockType === mathBlockSlug) return `$$\n${String(fields.latex ?? '').trim()}\n$$`
      if (fields.blockType === codeBlockSlug) {
        const code = String(fields.code ?? '').replace(/\s+$/, '')
        // A fence longer than any backtick run inside the code can't be closed early.
        const longest = Math.max(0, ...(code.match(/`+/g) ?? []).map((run) => run.length))
        const fence = '`'.repeat(Math.max(3, longest + 1))
        return `${fence}${String(fields.language ?? '').trim()}\n${code}\n${fence}`
      }
      lossy.add(`block ${fields.blockType}`)
      return null
    }
    case 'quote':
      lossy.add('quote')
      return serializeInline(node.children ?? [], lossy)
    default:
      lossy.add(`node ${node.type}`)
      return node.children ? serializeInline(node.children, lossy) : null
  }
}

function serializeList(node: LexNode, depth: number, lossy: Set<string>): string {
  const pad = '  '.repeat(depth)
  const ordered = node.listType === 'number'
  if (node.listType === 'check') lossy.add('checklist')
  const lines: string[] = []
  let n = 0
  for (const item of node.children ?? []) {
    const kids: LexNode[] = item.children ?? []
    const nestedLists = kids.filter((k) => k.type === 'list')
    const inlineKids = kids.filter((k) => k.type !== 'list')
    if (inlineKids.length > 0 || nestedLists.length === 0) {
      n++
      const marker = ordered ? `${n}.` : '-'
      const text = serializeInline(inlineKids, lossy).replace(/\n/g, `\n${pad}  `)
      lines.push(`${pad}${marker} ${text}`)
    }
    for (const nested of nestedLists) lines.push(serializeList(nested, depth + 1, lossy))
  }
  return lines.join('\n')
}

const FORMAT_WRAPPERS: Array<[number, string, string]> = [
  [FMT.CODE, '`', '`'],
  [FMT.SUPERSCRIPT, '<sup>', '</sup>'],
  [FMT.SUBSCRIPT, '<sub>', '</sub>'],
  [FMT.UNDERLINE, '<u>', '</u>'],
  [FMT.STRIKETHROUGH, '~~', '~~'],
  [FMT.ITALIC, '*', '*'],
  [FMT.BOLD, '**', '**'],
]

function serializeInline(nodes: LexNode[], lossy: Set<string>): string {
  let out = ''
  for (const node of nodes) {
    switch (node.type) {
      case 'text': {
        const format = typeof node.format === 'number' ? node.format : 0
        if (node.style) lossy.add('text style')
        if (format & ~0x7f) lossy.add('text highlight')
        let text: string = node.text ?? ''
        if (format & FMT.CODE) {
          text = text.replace(/`/g, "'")
        } else {
          text = escapeText(text)
        }
        // Keep surrounding whitespace outside the markers so `** x**` can't appear.
        const lead = /^\s*/.exec(text)![0]
        const trail = /\s*$/.exec(text.slice(lead.length))![0]
        let core = text.slice(lead.length, text.length - trail.length)
        if (core) {
          for (const [bit, open, close] of FORMAT_WRAPPERS) {
            if (format & bit) core = `${open}${core}${close}`
          }
          if (format & FMT.BOLD && format & FMT.ITALIC) core = `***${core.slice(3, -3)}***`
        }
        out += lead + core + trail
        break
      }
      case 'linebreak':
        out += '\n'
        break
      case 'tab':
        out += '\t'
        break
      case 'inlineBlock': {
        const fields = node.fields ?? {}
        if (fields.blockType === mathInlineSlug) out += `$${String(fields.latex ?? '').trim()}$`
        else if (fields.blockType === tagBlockSlug) out += `<tag>${escapeText(String(fields.label ?? ''))}</tag>`
        else lossy.add(`inline block ${fields.blockType}`)
        break
      }
      case 'link':
      case 'autolink': {
        const url = node.fields?.url ?? node.url ?? ''
        out += `[${serializeInline(node.children ?? [], lossy)}](${url})`
        break
      }
      default:
        lossy.add(`inline node ${node.type}`)
        if (node.children) out += serializeInline(node.children, lossy)
        else if (typeof node.text === 'string') out += escapeText(node.text)
    }
  }
  return out
}

function escapeText(text: string): string {
  return text.replace(/[\\*_$`[<~]/g, (c) => `\\${c}`)
}

// A paragraph that starts like a heading, list item or display formula gets its
// first character escaped so it reads back as a paragraph.
function escapeLineStart(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      if (/^#{1,6}\s/.test(line)) return `\\${line}`
      if (/^[-+]\s/.test(line)) return `\\${line}`
      const ordered = /^(\d{1,3})([.)])(\s)/.exec(line)
      if (ordered) return `${ordered[1]}\\${ordered[2]}${line.slice(ordered[1].length + 1)}`
      return line
    })
    .join('\n')
}

/** Plain text of a Lexical doc, used for card previews and search. */
export function lexicalToPlainText(doc: unknown): string {
  const parts: string[] = []
  const walk = (node: LexNode) => {
    if (typeof node.text === 'string') parts.push(node.text)
    if (node.type === 'linebreak') parts.push(' ')
    if (node.fields?.latex) parts.push(String(node.fields.latex))
    if (node.fields?.code) parts.push(String(node.fields.code))
    if (node.fields?.label) parts.push(String(node.fields.label))
    for (const child of node.children ?? []) walk(child)
    if (['paragraph', 'heading', 'listitem', 'block'].includes(node.type)) parts.push(' ')
  }
  const root = (doc as LexicalDoc | null | undefined)?.root
  if (root) walk(root)
  return parts.join('').replace(/\s+/g, ' ').trim()
}
