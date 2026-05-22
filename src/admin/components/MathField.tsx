'use client'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { useEffect, useId, useRef, useState } from 'react'

type Props = {
  path: string
  field?: {
    label?: unknown
    required?: boolean
    admin?: { description?: unknown; rows?: number }
  }
}

type MathFieldElement = HTMLElement & {
  value: string
  setValue: (v: string, opts?: { silenceNotifications?: boolean }) => void
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': DetailedHTMLProps<HTMLAttributes<MathFieldElement>, MathFieldElement>
    }
  }
}

export default function MathField({ path, field }: Props) {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const [mode, setMode] = useState<'wysiwyg' | 'source'>('wysiwyg')
  const [ready, setReady] = useState(false)
  const mathRef = useRef<MathFieldElement | null>(null)
  const reactId = useId()

  // Load MathLive web component + fonts/styles on the client only.
  useEffect(() => {
    let cancelled = false
    void import('mathlive').then((m) => {
      if (cancelled) return
      // MathLive auto-loads its custom fonts from a path relative to the page;
      // point at the unpkg CDN so we don't have to copy them into /public.
      const MFE = (m as { MathfieldElement?: { fontsDirectory?: string | null; soundsDirectory?: string | null } })
        .MathfieldElement
      if (MFE) {
        MFE.fontsDirectory = 'https://unpkg.com/mathlive/dist/fonts/'
        MFE.soundsDirectory = null
      }
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Push external value changes (form reset, sibling edits) into <math-field>.
  useEffect(() => {
    const el = mathRef.current
    if (!el) return
    const current = el.value ?? ''
    const next = value ?? ''
    if (current !== next) {
      el.setValue(next, { silenceNotifications: true })
    }
  }, [value, ready, mode])

  // Autofocus when the math editor first becomes visible. Both inline and
  // block math open inside a Payload drawer that mounts the field before the
  // drawer is shown, so a synchronous focus() runs while the element is still
  // hidden. IntersectionObserver fires the moment the drawer reveals it.
  useEffect(() => {
    if (mode !== 'wysiwyg' || !ready) return
    const el = mathRef.current
    if (!el) return
    let done = false
    const focus = () => {
      if (done) return
      done = true
      requestAnimationFrame(() => el.focus())
    }
    if (typeof IntersectionObserver === 'undefined') {
      focus()
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) focus()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [mode, ready])

  const description = field?.admin?.description
  const rows = field?.admin?.rows ?? 2

  return (
    <div className="field-type textarea-field">
      <div className="math-field-header">
        <FieldLabel label={field?.label as string | undefined} path={path} required={field?.required} />
        <button
          type="button"
          className="math-field-toggle"
          onClick={() => setMode((m) => (m === 'wysiwyg' ? 'source' : 'wysiwyg'))}
          aria-pressed={mode === 'source'}
        >
          {mode === 'source' ? 'Visual' : 'Source'}
        </button>
      </div>
      <div className="math-field-wrap">
        {mode === 'wysiwyg' ? (
          ready ? (
            <math-field
              ref={(el) => {
                mathRef.current = el
                if (el && (el.value ?? '') !== (value ?? '')) {
                  el.setValue(value ?? '', { silenceNotifications: true })
                }
              }}
              id={`math-${reactId}`}
              style={{
                width: '100%',
                minHeight: `${Math.max(rows, 2) * 1.6}rem`,
                fontSize: '1.1rem',
                padding: '8px 10px',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 'var(--style-radius-s)',
                background: 'var(--theme-input-bg)',
              }}
              onInput={(e) => {
                const el = e.currentTarget
                setValue(el.value ?? '')
              }}
            />
          ) : (
            <div className="math-field-loading">Loading editor…</div>
          )
        ) : (
          <textarea
            className="math-field-source"
            value={value ?? ''}
            rows={Math.max(rows, 3)}
            onChange={(e) => setValue(e.target.value)}
            placeholder={'\\frac{a}{b}'}
            spellCheck={false}
            style={{
              width: '100%',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.9rem',
              padding: '8px 10px',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 'var(--style-radius-s)',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              resize: 'vertical',
            }}
          />
        )}
      </div>
      {description ? <FieldDescription description={description as string} path={path} /> : null}
      <FieldError message={errorMessage} path={path} showError={showError} />
    </div>
  )
}
