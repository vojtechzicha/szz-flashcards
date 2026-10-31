import { describe, expect, it } from 'vitest'

import { legacyHtmlToLexical } from './html-import'
import { lexicalToMarkdown, lexicalToPlainText, markdownToLexical } from './markdown'
import { loadLegacyData } from '../seed/load-legacy'

type N = Record<string, any>

/** Structure without ids, empty text nodes or split runs, for comparisons. */
function signature(doc: N): unknown {
  const clean = (node: N): N | null => {
    if (node.type === 'text') {
      if (!node.text) return null
      return { t: node.text, f: node.format ?? 0 }
    }
    const out: N = { type: node.type }
    if (node.tag) out.tag = node.tag
    if (node.listType) out.listType = node.listType
    if (node.fields) {
      const { id: _id, blockName: _bn, ...fields } = node.fields
      out.fields = fields
    }
    if (node.children) {
      const kids: N[] = []
      for (const child of node.children) {
        const c = clean(child)
        if (!c) continue
        const last = kids[kids.length - 1]
        if (c.t !== undefined && last?.t !== undefined && last.f === c.f) last.t += c.t
        else kids.push(c)
      }
      // Leading/trailing whitespace of a block is not significant.
      if (['paragraph', 'heading', 'listitem'].includes(node.type)) {
        if (kids[0]?.t !== undefined) kids[0].t = kids[0].t.replace(/^\s+/, '')
        const end = kids[kids.length - 1]
        if (end?.t !== undefined) end.t = end.t.replace(/\s+$/, '')
        out.children = kids.filter((k) => k.t !== '')
      } else {
        out.children = kids
      }
      if (node.type === 'paragraph' && out.children.length === 0) return null
    }
    return out
  }
  return clean(doc.root)
}

const md = (s: string) => markdownToLexical(s).doc
const linkTo = (url: string, text: string) => ({
  type: 'link',
  fields: { linkType: 'custom', url },
  children: [{ type: 'text', text, format: 0 }],
})

describe('markdownToLexical', () => {
  it('builds paragraphs, line breaks and inline formats', () => {
    const doc = md('**Tučně** a *kurzíva*, ~~škrt~~, `kód`, <u>pod</u>, H<sub>2</sub>O, x<sup>2</sup>\ndruhý řádek\n\nNový odstavec')
    expect(signature(doc)).toEqual({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { t: 'Tučně', f: 1 },
            { t: ' a ', f: 0 },
            { t: 'kurzíva', f: 2 },
            { t: ', ', f: 0 },
            { t: 'škrt', f: 4 },
            { t: ', ', f: 0 },
            { t: 'kód', f: 16 },
            { t: ', ', f: 0 },
            { t: 'pod', f: 8 },
            { t: ', H', f: 0 },
            { t: '2', f: 32 },
            { t: 'O, x', f: 0 },
            { t: '2', f: 64 },
            { type: 'linebreak' },
            { t: 'druhý řádek', f: 0 },
          ],
        },
        { type: 'paragraph', children: [{ t: 'Nový odstavec', f: 0 }] },
      ],
    })
  })

  it('parses math, tags, headings, lists and links', () => {
    const doc = md(
      [
        '### Vzorec',
        'Platí $E = mc^2$ vždy <tag>Def</tag>',
        '$$',
        '\\frac{a}{b}',
        '$$',
        '- první',
        '  - vnořená',
        '- druhá',
        '1. číslo',
        '[odkaz](https://example.com)',
      ].join('\n'),
    )
    const sig = signature(doc) as N
    expect(sig.children.map((c: N) => c.type)).toEqual(['heading', 'paragraph', 'block', 'list', 'list', 'paragraph'])
    expect(sig.children[1].children[1]).toEqual({
      type: 'inlineBlock',
      fields: { blockType: 'mathInline', latex: 'E = mc^2' },
    })
    expect(sig.children[1].children[3]).toEqual({ type: 'inlineBlock', fields: { blockType: 'tag', label: 'Def' } })
    expect(sig.children[2].fields).toEqual({ blockType: 'math', latex: '\\frac{a}{b}' })
    expect(sig.children[3].children).toHaveLength(3)
    expect(sig.children[3].children[1].children[0].type).toBe('list')
    expect(sig.children[4].listType).toBe('number')
    expect(sig.children[5].children[0].fields.url).toBe('https://example.com')
  })

  it('leaves prices, snake_case and escapes alone', () => {
    const sig = signature(md('Stojí 5 $ a 10 $, soubor my_var_name, \\*hvězda\\*')) as N
    expect(sig.children[0].children).toEqual([{ t: 'Stojí 5 $ a 10 $, soubor my_var_name, *hvězda*', f: 0 }])
  })

  it('keeps fenced code verbatim, with an optional language', () => {
    const source = [
      '- `random n`: náhodné **celé číslo od 0 do n − 1**',
      '',
      '```netlogo',
      'to setup',
      '  set heading one-of [0 90 180 270]',
      '  if random 100 < 3 [ set pcolor green ] ; *not* $math$ <tag>x</tag>',
      'end',
      '```',
    ].join('\n')
    const sig = signature(md(source)) as N
    expect(sig.children.map((c: N) => c.type)).toEqual(['list', 'block'])
    expect(sig.children[1].fields).toEqual({
      blockType: 'code',
      language: 'netlogo',
      code: 'to setup\n  set heading one-of [0 90 180 270]\n  if random 100 < 3 [ set pcolor green ] ; *not* $math$ <tag>x</tag>\nend',
    })
    const back = lexicalToMarkdown(md(source))
    expect(back.lossy).toEqual([])
    expect(back.markdown).toBe(source)
  })

  it('ends a paragraph at a fence and uses a longer fence when the code holds backticks', () => {
    const sig = signature(md('Příklad:\n```\nshow "a"\n```')) as N
    expect(sig.children.map((c: N) => c.type)).toEqual(['paragraph', 'block'])
    expect(sig.children[1].fields.language).toBe('')
    const tricky = md('````\nprint("```")\n````')
    expect(lexicalToMarkdown(tricky).markdown).toBe('````\nprint("```")\n````')
    expect(() => markdownToLexical('```netlogo\nfd 1')).toThrow(/Unclosed/)
  })

  it('keeps balanced parentheses in link destinations', () => {
    const url = 'https://en.wikipedia.org/wiki/Function_(mathematics)'
    const sig = signature(md(`[funkce](${url}) a dál`)) as N
    expect(sig.children[0].children[0].fields.url).toBe(url)
    expect(sig.children[0].children[1]).toEqual({ t: ' a dál', f: 0 })
    // Unbalanced parentheses are escaped on the way out and read back whole.
    const odd = { root: { type: 'root', children: [{ type: 'paragraph', children: [linkTo('https://x.cz/a)b', 'x')] }] } }
    const mdOdd = lexicalToMarkdown(odd).markdown
    expect((signature(md(mdOdd)) as N).children[0].children[0].fields.url).toBe('https://x.cz/a)b')
  })

  it('keeps fenced code byte for byte, including trailing whitespace and odd language labels', () => {
    const doc = {
      root: {
        type: 'root',
        children: [{ type: 'block', fields: { blockType: 'code', language: 'Visual Basic', code: 'value  \n\n' } }],
      },
    }
    const { markdown, lossy } = lexicalToMarkdown(doc)
    expect(lossy).toEqual([])
    expect((signature(md(markdown)) as N).children[0].fields).toEqual({
      blockType: 'code',
      language: 'Visual Basic',
      code: 'value  \n\n',
    })
  })

  it('reports math KaTeX cannot parse', () => {
    const { mathErrors } = markdownToLexical('Chyba $\\frac{a}$ a $$\\nonexistent{x}$$')
    expect(mathErrors).toHaveLength(2)
  })

  it('rejects empty faces and unclosed display math', () => {
    expect(() => markdownToLexical('   \n ')).toThrow(/empty/)
    expect(() => markdownToLexical('$$\nx')).toThrow(/Unclosed/)
  })
})

describe('lexicalToMarkdown', () => {
  it('round-trips hand-written Markdown', () => {
    const source = [
      '### Nadpis',
      '',
      '**Tučně** a ***obojí*** s $\\alpha$ a <tag>Pojem</tag>\nřádek',
      '',
      '$$\n\\sum_{i=1}^n i\n$$',
      '',
      '- a\n  - b\n- c',
      '',
      '1. jedna\n2. dvě',
      '',
      '\\- není seznam, \\$5, \\* a [odkaz](https://x.cz)',
      '',
      '```python\ndef f(x):\n    return x * 2\n```',
      '',
      '\\`\\`\\` toto není kód',
    ].join('\n')
    const first = lexicalToMarkdown(md(source))
    expect(first.lossy).toEqual([])
    expect(first.markdown).toBe(source)
  })

  it('round-trips every legacy card without loss', async () => {
    const data = await loadLegacyData()
    let checked = 0
    for (const card of data.cards) {
      for (const html of [card.front, card.back]) {
        const original = legacyHtmlToLexical(html)
        const { markdown, lossy } = lexicalToMarkdown(original)
        expect(lossy).toEqual([])
        if (!markdown.trim()) continue
        const back = markdownToLexical(markdown).doc
        expect(signature(back), markdown).toEqual(signature(original))
        checked++
      }
    }
    expect(checked).toBeGreaterThan(500)
  })

  it('keeps inline math that is directly followed by a digit', () => {
    const doc = {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'inlineBlock', fields: { blockType: 'mathInline', latex: 'x' } },
              { type: 'text', text: '2 je druhá mocnina', format: 0 },
            ],
          },
        ],
      },
    }
    const { markdown } = lexicalToMarkdown(doc)
    expect(signature(md(markdown))).toEqual(signature(doc))
    // Prices stay text.
    expect((signature(md('od $5-$10')) as N).children[0].children).toEqual([{ t: 'od $5-$10', f: 0 }])
  })

  it('flags content Card Markdown cannot express', () => {
    const { lossy } = lexicalToMarkdown({
      root: { type: 'root', children: [{ type: 'paragraph', format: 'center', children: [{ type: 'text', text: 'x' }] }] },
    })
    expect(lossy).toEqual(['text alignment (center)'])
  })
})

describe('lexicalToPlainText', () => {
  it('joins text, math and tags', () => {
    expect(lexicalToPlainText(md('A **b**\n\n$$x^2$$\n\n- <tag>T</tag>'))).toBe('A b x^2 T')
  })
})
