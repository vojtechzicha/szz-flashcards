import { describe, expect, it } from 'vitest'

import { HIGHLIGHT_LANGUAGES, highlightCode } from './highlight'

describe('highlightCode', () => {
  it('highlights NetLogo procedures, keywords, built-ins, numbers and comments', () => {
    const html = highlightCode('to setup\n  ask turtles [ fd 1 set color red ] ; move\n  if random 100 < 3 [ die ]\nend', 'netlogo')!
    expect(html).toContain('<span class="hljs-title function_">setup</span>')
    expect(html).toContain('<span class="hljs-keyword">ask</span>')
    expect(html).toContain('<span class="hljs-built_in">fd</span>')
    expect(html).toContain('<span class="hljs-literal">red</span>')
    expect(html).toContain('<span class="hljs-number">100</span>')
    expect(html).toContain('<span class="hljs-comment">; move</span>')
    // `<` is escaped, not interpreted
    expect(html).toContain('&lt;')
  })

  it('accepts aliases and is case-insensitive about the tag', () => {
    expect(highlightCode('x = 1', 'PY')).toContain('hljs-number')
    expect(highlightCode('db.users.find({})', 'mongo')).not.toBeNull()
    expect(highlightCode('SELECT * FROM t', 'sql')).toContain('hljs-keyword')
  })

  it('returns null for unknown or missing languages', () => {
    expect(highlightCode('anything', 'klingon')).toBeNull()
    expect(highlightCode('anything', '')).toBeNull()
  })

  it('registers every listed language', () => {
    for (const lang of HIGHLIGHT_LANGUAGES) expect(highlightCode('x', lang), lang).not.toBeNull()
  })
})
