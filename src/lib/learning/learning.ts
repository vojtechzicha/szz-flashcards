import { shuffle } from './shuffle'
import type { DeckCard } from './tutorial'

export type CardStatus = 'unseen' | 'known' | 'unknown' | 'repeatFail'

export type LearningState<T extends DeckCard> = Readonly<{
  newPool: readonly T[]
  reviewQueue: readonly T[]
  knownPool: readonly T[]
  current: T | null
  statuses: Readonly<Record<string, CardStatus>>
  drainMode: boolean
  lastShownId: string | null
}>

// Drain unknowns down to LOW once the queue reaches HIGH; bounded by
// short-term recall capacity (~5–7 items, Miller 1956).
export const REVIEW_DRAIN_HIGH = 5
export const REVIEW_DRAIN_LOW = 2

// Re-insert a failed card 2–5 positions back so it isn't immediately repeated
// but still recurs while fresh.
export const REINSERT_OFFSET_MIN = 2
export const REINSERT_OFFSET_MAX = 5

export function buildLearningState<T extends DeckCard>(
  cards: readonly T[],
  rand: () => number = Math.random,
): LearningState<T> {
  const shuffled = shuffle(cards, rand)
  const statuses: Record<string, CardStatus> = {}
  for (const c of cards) statuses[c.id] = 'unseen'
  const [first, ...rest] = shuffled
  return {
    newPool: rest,
    reviewQueue: [],
    knownPool: [],
    current: first ?? null,
    statuses,
    drainMode: false,
    lastShownId: null,
  }
}

type DrawResult<T> = {
  current: T | null
  newPool: readonly T[]
  reviewQueue: readonly T[]
  knownPool: readonly T[]
  drainMode: boolean
}

function draw<T extends DeckCard>(
  newPool: readonly T[],
  reviewQueue: readonly T[],
  knownPool: readonly T[],
  drainMode: boolean,
  lastShownId: string | null,
): DrawResult<T> {
  let drain = drainMode
  if (reviewQueue.length >= REVIEW_DRAIN_HIGH) drain = true
  if (reviewQueue.length <= REVIEW_DRAIN_LOW) drain = false

  if (drain && reviewQueue.length > 0) {
    return {
      current: reviewQueue[0],
      newPool,
      reviewQueue: reviewQueue.slice(1),
      knownPool,
      drainMode: drain,
    }
  }
  if (newPool.length > 0) {
    return {
      current: newPool[0],
      newPool: newPool.slice(1),
      reviewQueue,
      knownPool,
      drainMode: drain,
    }
  }
  if (reviewQueue.length > 0) {
    // Avoid showing the just-failed card back-to-back when nothing new is
    // available; pull a previously-known card as a palate cleanser.
    if (reviewQueue[0].id === lastShownId && knownPool.length > 0) {
      return {
        current: knownPool[0],
        newPool,
        reviewQueue,
        knownPool: knownPool.slice(1),
        drainMode: drain,
      }
    }
    return {
      current: reviewQueue[0],
      newPool,
      reviewQueue: reviewQueue.slice(1),
      knownPool,
      drainMode: drain,
    }
  }
  return { current: null, newPool, reviewQueue, knownPool, drainMode: drain }
}

export function markKnown<T extends DeckCard>(state: LearningState<T>): LearningState<T> {
  if (!state.current) return state
  const cur = state.current
  const statuses = { ...state.statuses, [cur.id]: 'known' as CardStatus }
  const knownPool = [...state.knownPool, cur]
  const lastShownId = cur.id
  const next = draw(state.newPool, state.reviewQueue, knownPool, state.drainMode, lastShownId)
  return {
    ...state,
    statuses,
    newPool: next.newPool,
    reviewQueue: next.reviewQueue,
    knownPool: next.knownPool,
    drainMode: next.drainMode,
    current: next.current,
    lastShownId,
  }
}

export function markUnknown<T extends DeckCard>(
  state: LearningState<T>,
  rand: () => number = Math.random,
): LearningState<T> {
  if (!state.current) return state
  const cur = state.current
  const prev = state.statuses[cur.id]
  // unseen|unknown -> unknown, known|repeatFail -> repeatFail
  const nextStatus: CardStatus = prev === 'known' || prev === 'repeatFail' ? 'repeatFail' : 'unknown'
  const statuses = { ...state.statuses, [cur.id]: nextStatus }

  const span = REINSERT_OFFSET_MAX - REINSERT_OFFSET_MIN + 1
  const desiredOffset = REINSERT_OFFSET_MIN + Math.floor(rand() * span)
  const insertAt = Math.min(desiredOffset, state.reviewQueue.length)
  const reviewQueue = [
    ...state.reviewQueue.slice(0, insertAt),
    cur,
    ...state.reviewQueue.slice(insertAt),
  ]

  const lastShownId = cur.id
  const drawn = draw(state.newPool, reviewQueue, state.knownPool, state.drainMode, lastShownId)
  return {
    ...state,
    statuses,
    newPool: drawn.newPool,
    reviewQueue: drawn.reviewQueue,
    knownPool: drawn.knownPool,
    drainMode: drawn.drainMode,
    current: drawn.current,
    lastShownId,
  }
}

export type LearningCounts = {
  total: number
  known: number
  unknown: number
  repeatFail: number
  unseen: number
}

export function countStatuses<T extends DeckCard>(state: LearningState<T>): LearningCounts {
  let known = 0
  let unknown = 0
  let repeatFail = 0
  let unseen = 0
  for (const id of Object.keys(state.statuses)) {
    switch (state.statuses[id]) {
      case 'known':
        known++
        break
      case 'unknown':
        unknown++
        break
      case 'repeatFail':
        repeatFail++
        break
      case 'unseen':
        unseen++
        break
    }
  }
  return {
    total: known + unknown + repeatFail + unseen,
    known,
    unknown,
    repeatFail,
    unseen,
  }
}

export function isLearningDone<T extends DeckCard>(state: LearningState<T>): boolean {
  return state.current === null
}
