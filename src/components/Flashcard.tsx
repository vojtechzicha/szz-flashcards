'use client'

import { useState, type ReactNode, type TouchEvent } from 'react'

import { LexicalRenderer, type LexicalContent } from '@/lexical/render'
import { cn } from '@/lib/utils'

export type FlashcardProps = {
  front: LexicalContent
  back: LexicalContent
  /** Controlled flipped state; omit for uncontrolled (clicks toggle internally). */
  flipped?: boolean
  /** Called when the surface receives a flip gesture (click/tap). */
  onFlip?: () => void
  /** Extra classes on the outer container — used to set sizing/aspect. */
  className?: string
  /** When true, clicks on the surface trigger onFlip / internal toggle. */
  interactive?: boolean
  onTouchStart?: (e: TouchEvent) => void
  onTouchEnd?: (e: TouchEvent) => void
  /** Optional placeholders shown when the corresponding side is empty. */
  emptyFrontFallback?: ReactNode
  emptyBackFallback?: ReactNode
}

function isEmpty(content: LexicalContent): boolean {
  const children = content?.root?.children
  if (!children || children.length === 0) return true
  if (children.length === 1) {
    const only = children[0] as { type?: string; children?: unknown[] }
    if (only.type === 'paragraph' && (!only.children || only.children.length === 0)) return true
  }
  return false
}

/** A single card surface (no flip). Used by Flashcard for both faces, and
    standalone by FlashcardFace for static previews. */
function CardSurface({
  content,
  back,
  surfaceClassName,
  emptyFallback,
}: {
  content: LexicalContent
  back?: boolean
  surfaceClassName: string
  emptyFallback?: ReactNode
}) {
  return (
    <div className={cn(surfaceClassName, back && 'card-back')}>
      <div className="card-body">
        {isEmpty(content) ? emptyFallback : <LexicalRenderer content={content} />}
      </div>
    </div>
  )
}

export function Flashcard({
  front,
  back,
  flipped,
  onFlip,
  className,
  interactive,
  onTouchStart,
  onTouchEnd,
  emptyFrontFallback,
  emptyBackFallback,
}: FlashcardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false)
  const isControlled = flipped !== undefined
  const isFlipped = isControlled ? Boolean(flipped) : internalFlipped

  const handleClick = interactive
    ? () => {
        if (onFlip) onFlip()
        else if (!isControlled) setInternalFlipped((f) => !f)
      }
    : undefined

  return (
    <div
      className={cn(
        'flashcard-scope card-flip',
        interactive && 'cursor-pointer select-none',
        className,
      )}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={cn('card-inner', isFlipped && 'flipped')}>
        <CardSurface content={front} surfaceClassName="card-face" emptyFallback={emptyFrontFallback} />
        <CardSurface content={back} back surfaceClassName="card-face" emptyFallback={emptyBackFallback} />
      </div>
    </div>
  )
}

/** Single static face — shares the same renderer + CSS as Flashcard but
    flows in normal layout (no flip, no absolute positioning). */
export function FlashcardFace({
  content,
  side,
  className,
  emptyFallback,
}: {
  content: LexicalContent
  side: 'front' | 'back'
  /** Extra classes on the surface element (sizing, mini variant). */
  className?: string
  emptyFallback?: ReactNode
}) {
  return (
    <div className="flashcard-scope">
      <CardSurface
        content={content}
        back={side === 'back'}
        surfaceClassName={cn('card-face-static', className)}
        emptyFallback={emptyFallback}
      />
    </div>
  )
}
