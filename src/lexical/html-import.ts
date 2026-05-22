import { parse, HTMLElement, Node, NodeType, TextNode } from 'node-html-parser'

import { mathBlockSlug, mathInlineSlug, tagBlockSlug } from './blocks'

type LexicalRoot = { root: { type: 'root'; format: ''; indent: 0; version: 1; direction: null; children: any[] } }

const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 1 << 1,
  STRIKETHROUGH: 1 << 2,
  UNDERLINE: 1 << 3,
  CODE: 1 << 4,
  SUBSCRIPT: 1 << 5,
  SUPERSCRIPT: 1 << 6,
} as const

const PARA_TAGS = new Set(['p', 'div'])

function makeRoot(): LexicalRoot {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [],
    },
  }
}

function makeText(text: string, format = 0) {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function makeParagraph(children: any[]) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    textFormat: 0,
    textStyle: '',
    children,
  }
}

function makeList(listType: 'bullet' | 'number', items: any[]) {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    listType,
    start: 1,
    tag: listType === 'bullet' ? 'ul' : 'ol',
    children: items,
  }
}

function makeListItem(children: any[]) {
  return {
    type: 'listitem',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    value: 1,
    children,
  }
}

function makeBlock(blockType: string, fields: Record<string, unknown>) {
  return {
    type: 'block',
    format: '',
    version: 2,
    fields: { blockType, ...fields },
  }
}

function makeInlineBlock(blockType: string, fields: Record<string, unknown>) {
  return {
    type: 'inlineBlock',
    version: 1,
    fields: { blockType, ...fields },
  }
}

function isElement(node: Node): node is HTMLElement {
  return node.nodeType === NodeType.ELEMENT_NODE
}

function isTextNode(node: Node): node is TextNode {
  return node.nodeType === NodeType.TEXT_NODE
}

function classOf(el: HTMLElement): string {
  return (el.getAttribute('class') ?? '').toLowerCase()
}

function pushInlineRun(target: any[], children: any[]) {
  if (children.length === 0) return
  target.push(makeParagraph(children))
}

/**
 * Convert legacy card HTML to Lexical JSON.
 *
 * Math primitives in the legacy markup — `.math-block` divs, `.frac` inline
 * spans, `.var` italic spans, and bare `<sub>`/`<sup>` inside formulas — are
 * collapsed into a single `math` block (with a `display` flag) whose body is
 * standard LaTeX. KaTeX renders these at runtime.
 *
 * Outside formula context, plain `<sub>`/`<sup>` keep their Lexical text
 * formats so prose like "F<sub>e</sub>" still reads naturally without forcing
 * the whole word into math mode.
 */
export function legacyHtmlToLexical(html: string): LexicalRoot {
  const root = makeRoot()
  if (!html?.trim()) return root

  const fragment = parse(`<div id="root">${html}</div>`)
  const container = fragment.getElementById('root')!
  let currentInline: any[] = []

  const flushInline = () => {
    pushInlineRun(root.root.children, currentInline)
    currentInline = []
  }

  for (const child of container.childNodes) {
    if (isTextNode(child)) {
      const text = decodeBasicEntities(child.rawText)
      if (text.trim()) {
        currentInline.push(makeText(text))
      }
      continue
    }
    if (!isElement(child)) continue

    const tag = child.tagName?.toLowerCase()
    const cls = classOf(child)

    // Block: <div class="math-block">…</div> → block-mode math block
    if (tag === 'div' && cls.includes('math-block')) {
      flushInline()
      const latex = htmlChildrenToLatex(child)
      root.root.children.push(makeBlock(mathBlockSlug, { latex }))
      continue
    }

    if (tag === 'ul' || tag === 'ol') {
      flushInline()
      const items: any[] = []
      for (const li of child.childNodes) {
        if (isElement(li) && li.tagName?.toLowerCase() === 'li') {
          items.push(makeListItem(inlineChildrenToLexical(li)))
        }
      }
      root.root.children.push(makeList(tag === 'ol' ? 'number' : 'bullet', items))
      continue
    }

    if (PARA_TAGS.has(tag)) {
      flushInline()
      root.root.children.push(makeParagraph(inlineChildrenToLexical(child)))
      continue
    }

    if (tag === 'h3' || tag === 'h4') {
      flushInline()
      root.root.children.push({
        type: 'heading',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        tag,
        children: inlineChildrenToLexical(child),
      })
      continue
    }

    currentInline.push(...nodeToInlineLexical(child, 0))
  }

  flushInline()

  if (root.root.children.length === 0) {
    root.root.children.push(makeParagraph([makeText('')]))
  }

  return root
}

function inlineChildrenToLexical(el: HTMLElement): any[] {
  const out: any[] = []
  for (const child of el.childNodes) {
    if (isTextNode(child)) {
      out.push(makeText(decodeBasicEntities(child.rawText)))
      continue
    }
    if (isElement(child)) {
      out.push(...nodeToInlineLexical(child, 0))
    }
  }
  return out
}

function nodeToInlineLexical(node: HTMLElement, parentFormat: number): any[] {
  const tag = node.tagName?.toLowerCase()
  const cls = classOf(node)

  // Inline math: <span class="frac">…</span> → inline math block.
  if (tag === 'span' && cls.split(/\s+/).includes('frac')) {
    const num = node.querySelector('.frac-num')
    const den = node.querySelector('.frac-den')
    const latex = `\\frac{${num ? htmlChildrenToLatex(num) : ''}}{${den ? htmlChildrenToLatex(den) : ''}}`
    return [makeInlineBlock(mathInlineSlug, { latex })]
  }

  // Italic variable: <span class="var">…</span> → inline math.
  if (tag === 'span' && cls.split(/\s+/).includes('var')) {
    return [makeInlineBlock(mathInlineSlug, { latex: htmlChildrenToLatex(node) })]
  }

  // Tag pill stays as its own inline block.
  if (tag === 'span' && cls.split(/\s+/).includes('tag')) {
    return [makeInlineBlock(tagBlockSlug, { label: decodeBasicEntities(node.text).trim() })]
  }

  let format = parentFormat
  if (tag === 'strong' || tag === 'b') format |= TEXT_FORMAT.BOLD
  if (tag === 'em' || tag === 'i') format |= TEXT_FORMAT.ITALIC
  if (tag === 'u') format |= TEXT_FORMAT.UNDERLINE
  if (tag === 's' || tag === 'strike') format |= TEXT_FORMAT.STRIKETHROUGH
  if (tag === 'sub') format |= TEXT_FORMAT.SUBSCRIPT
  if (tag === 'sup') format |= TEXT_FORMAT.SUPERSCRIPT
  if (tag === 'code') format |= TEXT_FORMAT.CODE

  if (tag === 'br') {
    return [{ type: 'linebreak', version: 1 }]
  }

  const out: any[] = []
  for (const child of node.childNodes) {
    if (isTextNode(child)) {
      const text = decodeBasicEntities(child.rawText)
      if (text) out.push(makeText(text, format))
      continue
    }
    if (isElement(child)) {
      out.push(...nodeToInlineLexical(child, format))
    }
  }
  if (out.length === 0 && node.text) {
    out.push(makeText(decodeBasicEntities(node.text), format))
  }
  return out
}

// ──────────────────────────────────────────────────────────────
//   HTML → LaTeX (used inside math contexts: .math-block, .frac, .var)
// ──────────────────────────────────────────────────────────────

function htmlChildrenToLatex(el: HTMLElement): string {
  let out = ''
  for (const child of el.childNodes) {
    if (isTextNode(child)) {
      out += textToLatex(decodeBasicEntities(child.rawText))
      continue
    }
    if (isElement(child)) {
      out += htmlNodeToLatex(child)
    }
  }
  return collapseWhitespace(out)
}

function htmlNodeToLatex(node: HTMLElement): string {
  const tag = node.tagName?.toLowerCase()
  const cls = classOf(node)

  if (tag === 'sub') return `_{${htmlChildrenToLatex(node)}}`
  if (tag === 'sup') return `^{${htmlChildrenToLatex(node)}}`
  if (tag === 'br') return ' \\\\ '
  if (tag === 'strong' || tag === 'b') return `\\mathbf{${htmlChildrenToLatex(node)}}`
  if (tag === 'em' || tag === 'i') return htmlChildrenToLatex(node)

  // Nested .frac inside a .math-block
  if (tag === 'span' && cls.split(/\s+/).includes('frac')) {
    const num = node.querySelector('.frac-num')
    const den = node.querySelector('.frac-den')
    return `\\frac{${num ? htmlChildrenToLatex(num) : ''}}{${den ? htmlChildrenToLatex(den) : ''}}`
  }

  // .var or any other span: descend transparently.
  return htmlChildrenToLatex(node)
}

/**
 * Translate plain text appearing inside a math context to a LaTeX-safe
 * fragment. Handles the small set of unicode chars / entities used by the
 * legacy deck (·, ×, Σ, °, ±, ≤, ≥, …) and wraps multi-character runs that
 * KaTeX can't render directly (Czech diacritics, multi-letter labels) in
 * `\text{…}`.
 */
function textToLatex(input: string): string {
  // Decode any leftover named/numeric entities that survived the parser.
  let s = input

  // Drop NBSPs that would otherwise become literal spaces in math.
  s = s.replace(/ /g, ' ')

  // Symbol substitutions.
  const symbolMap: Array<[RegExp, string]> = [
    [/·/g, ' \\cdot '],
    [/×/g, ' \\times '],
    [/÷/g, ' \\div '],
    [/±/g, ' \\pm '],
    [/∓/g, ' \\mp '],
    [/≤/g, ' \\le '],
    [/≥/g, ' \\ge '],
    [/≠/g, ' \\ne '],
    [/≈/g, ' \\approx '],
    [/→/g, ' \\to '],
    [/←/g, ' \\leftarrow '],
    [/⇒/g, ' \\Rightarrow '],
    [/⇔/g, ' \\Leftrightarrow '],
    [/∞/g, ' \\infty '],
    [/√/g, ' \\sqrt '],
    [/Σ/g, ' \\Sigma '],
    [/Π/g, ' \\Pi '],
    [/Δ/g, ' \\Delta '],
    [/Ω/g, ' \\Omega '],
    [/Φ/g, ' \\Phi '],
    [/α/g, ' \\alpha '],
    [/β/g, ' \\beta '],
    [/γ/g, ' \\gamma '],
    [/δ/g, ' \\delta '],
    [/ε/g, ' \\varepsilon '],
    [/θ/g, ' \\theta '],
    [/λ/g, ' \\lambda '],
    [/μ/g, ' \\mu '],
    [/π/g, ' \\pi '],
    [/ρ/g, ' \\rho '],
    [/σ/g, ' \\sigma '],
    [/τ/g, ' \\tau '],
    [/φ/g, ' \\varphi '],
    [/ω/g, ' \\omega '],
    [/°/g, '^{\\circ}'],
    [/„/g, '\\text{„}'],
    [/"/g, '\\text{"}'],
    [/–/g, ' - '],
    [/—/g, ' - '],
  ]

  // Run the alphabetic-wrap FIRST so the LaTeX command letters we emit below
  // (\Sigma, \cdot, ...) aren't re-consumed by the regex.
  // - any run containing a non-ASCII Latin letter (Czech diacritics) is always
  //   wrapped, even single chars (KaTeX can't render č in math mode).
  // - multi-letter ASCII runs are wrapped unless they look like a short
  //   uppercase abbreviation (length <= 3, e.g. CP, PP) — those stay in
  //   math italic which is what readers expect.
  s = s.replace(/[A-Za-zÀ-ÖØ-öø-ž]+/g, (m) => {
    const hasDiacritic = /[^A-Za-z]/.test(m)
    if (hasDiacritic) return `\\text{${m}}`
    if (m.length === 1) return m
    if (/^[A-Z]+$/.test(m) && m.length <= 3) return m
    return `\\text{${m}}`
  })

  for (const [re, repl] of symbolMap) s = s.replace(re, repl)

  return s
}

function collapseWhitespace(s: string): string {
  return s.replace(/[ \t]+/g, ' ').trim()
}

/**
 * Decode the tiny set of named entities the legacy deck actually uses.
 * `node-html-parser` returns text nodes verbatim, so we handle them here.
 */
function decodeBasicEntities(s: string): string {
  return s
    .replace(/&middot;/g, '·')
    .replace(/&times;/g, '×')
    .replace(/&Sigma;/g, 'Σ')
    .replace(/&deg;/g, '°')
    .replace(/&pi;/g, 'π')
    .replace(/&alpha;/g, 'α')
    .replace(/&beta;/g, 'β')
    .replace(/&gamma;/g, 'γ')
    .replace(/&Delta;/g, 'Δ')
    .replace(/&plusmn;/g, '±')
    .replace(/&le;/g, '≤')
    .replace(/&ge;/g, '≥')
    .replace(/&ne;/g, '≠')
    .replace(/&rarr;/g, '→')
    .replace(/&hellip;/g, '…')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&bdquo;/g, '„')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
}
