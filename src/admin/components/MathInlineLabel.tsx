import katex from 'katex'
import type { LexicalInlineBlockLabelServerProps } from '@payloadcms/richtext-lexical'

/**
 * Server-rendered label for the inline math block — shows the actual KaTeX
 * output (e.g. `x²`) inside the editor chip instead of the generic block name.
 * Re-rendered by Payload whenever the inline-block form state is saved.
 */
export default function MathInlineLabel({ data, siblingData }: LexicalInlineBlockLabelServerProps) {
  // `_components` is a UI field nested inside the inline block, so the block's
  // own latex lives in `siblingData`. Fall back to `data` for safety.
  const source = siblingData ?? data
  const latex = typeof source?.latex === 'string' ? source.latex : ''
  if (!latex.trim()) {
    return <span className="math-inline-label math-inline-label--empty">f(x)</span>
  }
  let html: string
  try {
    html = katex.renderToString(latex, {
      displayMode: false,
      throwOnError: false,
      strict: 'ignore',
      output: 'html',
    })
  } catch {
    return <span className="math-inline-label math-inline-label--error">{latex}</span>
  }
  return <span className="math-inline-label" dangerouslySetInnerHTML={{ __html: html }} />
}
