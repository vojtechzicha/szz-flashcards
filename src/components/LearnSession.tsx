'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Flashcard } from '@/components/Flashcard'
import { useI18n } from '@/lib/i18n/context'
import type { LexicalContent } from '@/lexical/render'
import {
  buildLearningState,
  countStatuses,
  isLearningDone,
  markKnown as learningMarkKnown,
  markUnknown as learningMarkUnknown,
  type LearningState,
} from '@/lib/learning/learning'
import { buildTutorialDeck, tutorialAdvance } from '@/lib/learning/tutorial'

type Card = {
  id: string
  order: number
  front: unknown
  back: unknown
}

type Mode = 'tutorial' | 'learning'

export function LearnSession({
  mode,
  cards,
  userId,
  backHref,
}: {
  mode: Mode
  cards: readonly Card[]
  userId: string
  backHref: string
}) {
  const { t } = useI18n()
  const isTutorial = mode === 'tutorial'

  const [tutorialDeck, setTutorialDeck] = useState<Card[]>(() =>
    isTutorial ? buildTutorialDeck(cards) : [],
  )
  const [learnState, setLearnState] = useState<LearningState<Card>>(() =>
    isTutorial ? buildLearningState([]) : buildLearningState(cards),
  )
  const [flipped, setFlipped] = useState(false)
  const [knownClicks, setKnownClicks] = useState(0)
  const [unknownClicks, setUnknownClicks] = useState(0)

  const total = cards.length
  const front: Card | undefined = isTutorial ? tutorialDeck[0] : learnState.current ?? undefined
  const isDone = isTutorial ? tutorialDeck.length === 0 : isLearningDone(learnState)

  const counts = useMemo(() => countStatuses(learnState), [learnState])

  const writeProgress = useCallback(
    async (cardId: string, state: 'known' | 'unknown') => {
      try {
        await fetch('/api/progress/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ cardId, state, userId }),
        })
      } catch {
        // best-effort; don't block the UX on a failed write
      }
    },
    [userId],
  )

  const onKnown = useCallback(() => {
    if (!front) return
    void writeProgress(front.id, 'known')
    setKnownClicks((n) => n + 1)
    setFlipped(false)
    if (isTutorial) {
      setTutorialDeck((d) => tutorialAdvance(d))
    } else {
      setLearnState((s) => learningMarkKnown(s))
    }
  }, [front, isTutorial, writeProgress])

  const onUnknown = useCallback(() => {
    if (!front) return
    void writeProgress(front.id, 'unknown')
    setUnknownClicks((n) => n + 1)
    setFlipped(false)
    if (isTutorial) {
      setTutorialDeck((d) => tutorialAdvance(d))
    } else {
      setLearnState((s) => learningMarkUnknown(s))
    }
  }, [front, isTutorial, writeProgress])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onKnown()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onUnknown()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onKnown, onUnknown])

  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) onUnknown()
      else onKnown()
    }
    touchStart.current = null
  }

  const restart = useCallback(() => {
    setKnownClicks(0)
    setUnknownClicks(0)
    setFlipped(false)
    if (isTutorial) {
      setTutorialDeck(buildTutorialDeck(cards))
    } else {
      setLearnState(buildLearningState(cards))
    }
  }, [cards, isTutorial])

  if (total === 0) {
    return (
      <section className="pt-12 text-center">
        <p className="text-[color:var(--color-text-dim)]">{t('home.empty')}</p>
        <Link
          href={backHref}
          className="inline-block mt-6 px-4 py-2 rounded-md border border-[color:var(--color-border)] hover:bg-[color:var(--color-bg-hover)]"
        >
          {t('common.back')}
        </Link>
      </section>
    )
  }

  if (isDone) {
    return (
      <section className="pt-12 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">{t('session.complete')}</h1>
        <p className="text-[color:var(--color-text-dim)] mt-2">{t('session.completeMsg')}</p>
        <div className="mt-6 inline-flex gap-6 text-sm">
          <span>
            <span className="text-[color:var(--color-good)] font-semibold">{knownClicks}</span>{' '}
            <span className="text-[color:var(--color-text-dim)]">{t('session.knownSoFar')}</span>
          </span>
          <span>
            <span className="text-[color:var(--color-bad)] font-semibold">{unknownClicks}</span>{' '}
            <span className="text-[color:var(--color-text-dim)]">{t('session.unknownSoFar')}</span>
          </span>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button
            type="button"
            onClick={restart}
            className="px-4 py-2 rounded-md bg-[color:var(--color-accent)] text-black font-medium"
          >
            {t('session.startAgain')}
          </button>
          <Link
            href={backHref}
            className="px-4 py-2 rounded-md border border-[color:var(--color-border)] hover:bg-[color:var(--color-bg-hover)]"
          >
            {t('session.backHome')}
          </Link>
        </div>
      </section>
    )
  }

  const tutorialSeen = knownClicks + unknownClicks

  return (
    <section className="pt-6">
      <div className="flex items-center justify-between mb-3 text-xs text-[color:var(--color-text-dim)]">
        <Link href={backHref} className="hover:text-[color:var(--color-text)]">
          ← {t('common.back')}
        </Link>
        {isTutorial ? <span>{`${tutorialSeen + 1} / ${total}`}</span> : null}
      </div>
      {!isTutorial ? (
        <ProgressBar
          total={counts.total}
          known={counts.known}
          repeatFail={counts.repeatFail}
          unknown={counts.unknown}
        />
      ) : null}
      <Flashcard
        front={(front?.front ?? null) as LexicalContent}
        back={(front?.back ?? null) as LexicalContent}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
        interactive
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="aspect-[3/4] sm:aspect-[4/3] max-h-[70dvh] mt-3"
      />
      <p className="text-center text-xs text-[color:var(--color-text-faint)] mt-3">{t('card.flipHint')}</p>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          type="button"
          onClick={onUnknown}
          className="py-4 rounded-xl border border-[color:var(--color-bad)]/40 bg-[color:var(--color-bad)]/10 text-[color:var(--color-bad)] font-semibold flex flex-col items-center gap-1"
        >
          <span>{t('card.unknown')}</span>
          <span className="text-[10px] font-normal opacity-70">
            <kbd className="px-1.5 py-0.5 rounded border border-current/30">←</kbd>
          </span>
        </button>
        <button
          type="button"
          onClick={onKnown}
          className="py-4 rounded-xl border border-[color:var(--color-good)]/40 bg-[color:var(--color-good)]/10 text-[color:var(--color-good)] font-semibold flex flex-col items-center gap-1"
        >
          <span>{t('card.known')}</span>
          <span className="text-[10px] font-normal opacity-70">
            <kbd className="px-1.5 py-0.5 rounded border border-current/30">→</kbd>
          </span>
        </button>
      </div>
    </section>
  )
}

function ProgressBar({
  total,
  known,
  repeatFail,
  unknown,
}: {
  total: number
  known: number
  repeatFail: number
  unknown: number
}) {
  if (total === 0) return null
  const pct = (n: number) => `${(n / total) * 100}%`
  return (
    <div
      className="flex h-2 rounded-full overflow-hidden bg-[color:var(--color-bg-hover)]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={known}
    >
      <div className="bg-[color:var(--color-good)] transition-all" style={{ width: pct(known) }} />
      <div className="bg-[color:var(--color-warn)] transition-all" style={{ width: pct(repeatFail) }} />
      <div className="bg-[color:var(--color-bad)] transition-all" style={{ width: pct(unknown) }} />
    </div>
  )
}

