import { describe, expect, it } from 'vitest'
import {
  buildLearningState,
  countStatuses,
  isLearningDone,
  markKnown,
  markUnknown,
  REINSERT_OFFSET_MAX,
  REINSERT_OFFSET_MIN,
  type LearningState,
} from './learning'
import { buildTutorialDeck } from './tutorial'

type C = { id: string; order: number }
const make = (ids: string[]): C[] => ids.map((id, i) => ({ id, order: i }))
const ids = (cs: readonly C[]) => cs.map((c) => c.id)

const stateOf = (overrides: Partial<LearningState<C>>): LearningState<C> => ({
  newPool: [],
  reviewQueue: [],
  knownPool: [],
  current: null,
  statuses: {},
  drainMode: false,
  lastShownId: null,
  ...overrides,
})

describe('buildLearningState', () => {
  it('initializes all statuses to unseen and draws first card', () => {
    const s = buildLearningState(make(['a', 'b', 'c']), () => 0)
    expect(s.current).not.toBeNull()
    expect(Object.values(s.statuses)).toEqual(['unseen', 'unseen', 'unseen'])
    expect(s.reviewQueue).toEqual([])
    expect(s.knownPool).toEqual([])
    expect(s.newPool.length).toBe(2)
  })

  it('returns null current for empty input', () => {
    const s = buildLearningState(make([]))
    expect(s.current).toBeNull()
    expect(isLearningDone(s)).toBe(true)
  })
})

describe('markKnown', () => {
  it('moves current to knownPool and draws next from newPool', () => {
    const [a, b, c] = make(['a', 'b', 'c'])
    const s = stateOf({
      current: a,
      newPool: [b, c],
      statuses: { a: 'unseen', b: 'unseen', c: 'unseen' },
    })
    const next = markKnown(s)
    expect(next.statuses['a']).toBe('known')
    expect(ids(next.knownPool)).toEqual(['a'])
    expect(next.current?.id).toBe('b')
    expect(ids(next.newPool)).toEqual(['c'])
    expect(next.lastShownId).toBe('a')
  })

  it('returns same state when no current', () => {
    const s = stateOf({})
    expect(markKnown(s)).toBe(s)
  })

  it('reverts repeatFail (orange) back to known (green)', () => {
    const [a] = make(['a'])
    const s = stateOf({ current: a, statuses: { a: 'repeatFail' } })
    const next = markKnown(s)
    expect(next.statuses['a']).toBe('known')
    expect(ids(next.knownPool)).toEqual(['a'])
  })
})

describe('markUnknown', () => {
  it('marks unseen card as unknown (red)', () => {
    const [a, b, c, d, e, f] = make(['a', 'b', 'c', 'd', 'e', 'f'])
    const s = stateOf({
      current: a,
      reviewQueue: [b, c, d, e, f],
      statuses: { a: 'unseen' },
    })
    const next = markUnknown(s, () => 0)
    expect(next.statuses['a']).toBe('unknown')
  })

  it('marks known card as repeatFail (orange) when failed again', () => {
    const [a] = make(['a'])
    const s = stateOf({ current: a, statuses: { a: 'known' } })
    const next = markUnknown(s, () => 0)
    expect(next.statuses['a']).toBe('repeatFail')
  })

  it('keeps repeatFail card orange on further fails', () => {
    const [a] = make(['a'])
    const s = stateOf({ current: a, statuses: { a: 'repeatFail' } })
    const next = markUnknown(s, () => 0)
    expect(next.statuses['a']).toBe('repeatFail')
  })

  it('re-inserts at MIN offset (2) when rand=0', () => {
    const [a, b, c, d, e, f] = make(['a', 'b', 'c', 'd', 'e', 'f'])
    const s = stateOf({ current: a, reviewQueue: [b, c, d, e, f] })
    const next = markUnknown(s, () => 0)
    // insert a at index 2 of [b,c,d,e,f] -> [b,c,a,d,e,f]; len 6 triggers drain;
    // draw pulls front => current=b, reviewQueue=[c,a,d,e,f]
    expect(next.current?.id).toBe('b')
    expect(ids(next.reviewQueue)).toEqual(['c', 'a', 'd', 'e', 'f'])
  })

  it('re-inserts at MAX offset (5) when rand≈0.999', () => {
    const [a, b, c, d, e, f] = make(['a', 'b', 'c', 'd', 'e', 'f'])
    const s = stateOf({ current: a, reviewQueue: [b, c, d, e, f] })
    const next = markUnknown(s, () => 0.999)
    // insert at index 5 => [b,c,d,e,f,a]; drain -> current=b
    expect(next.current?.id).toBe('b')
    expect(ids(next.reviewQueue)).toEqual(['c', 'd', 'e', 'f', 'a'])
  })

  it('clamps offset when reviewQueue is shorter than offset', () => {
    const [a, b] = make(['a', 'b'])
    const s = stateOf({ current: a, reviewQueue: [b] })
    const next = markUnknown(s, () => 0.999)
    // desired 5, clamp to 1: [b,a]; draw: drain off (1<=LOW), newPool empty,
    // reviewQueue[0]=b != lastShown=a -> pull b.
    expect(next.current?.id).toBe('b')
    expect(ids(next.reviewQueue)).toEqual(['a'])
  })

  it('keeps a single card alive (sole-card edge case)', () => {
    const [a] = make(['a'])
    const s = stateOf({ current: a, statuses: { a: 'unseen' } })
    const next = markUnknown(s, () => 0.5)
    expect(next.current?.id).toBe('a')
  })

  it('returns same state when no current', () => {
    const s = stateOf({})
    expect(markUnknown(s, () => 0)).toBe(s)
  })

  it('always uses an offset within [MIN, MAX]', () => {
    const [a, b, c, d, e, f, g, h] = make(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
    for (let r = 0; r < 1; r += 0.01) {
      const s = stateOf({ current: a, reviewQueue: [b, c, d, e, f, g, h] })
      const next = markUnknown(s, () => r)
      const full = next.current ? [next.current, ...next.reviewQueue] : [...next.reviewQueue]
      const pos = full.findIndex((card) => card.id === 'a')
      expect(pos).toBeGreaterThanOrEqual(REINSERT_OFFSET_MIN)
      expect(pos).toBeLessThanOrEqual(REINSERT_OFFSET_MAX)
    }
  })
})

describe('drain mode', () => {
  it('switches to drain when reviewQueue reaches HIGH and pulls from review, not new', () => {
    const [a, b, c, d, e, h] = make(['a', 'b', 'c', 'd', 'e', 'h'])
    const s = stateOf({
      current: a,
      newPool: [h],
      reviewQueue: [b, c, d, e],
    })
    const next = markUnknown(s, () => 0)
    expect(next.drainMode).toBe(true)
    expect(next.current?.id).toBe('b')
    expect(ids(next.newPool)).toEqual(['h'])
  })

  it('exits drain mode when reviewQueue drains to LOW and resumes newPool', () => {
    const [b, c, x] = make(['b', 'c', 'x'])
    const s = stateOf({
      current: b,
      newPool: [x],
      reviewQueue: [c],
      drainMode: true,
      statuses: { b: 'unknown', c: 'unknown', x: 'unseen' },
    })
    const next = markKnown(s)
    expect(next.drainMode).toBe(false)
    expect(next.current?.id).toBe('x')
    expect(ids(next.reviewQueue)).toEqual(['c'])
  })
})

describe('green-card filler', () => {
  it('shows a learned card when the same red would repeat back-to-back', () => {
    const [a, g] = make(['a', 'g'])
    const s = stateOf({
      current: a,
      knownPool: [g],
      statuses: { a: 'unknown', g: 'known' },
    })
    const next = markUnknown(s, () => 0)
    expect(next.current?.id).toBe('g')
    expect(ids(next.reviewQueue)).toEqual(['a'])
    expect(ids(next.knownPool)).toEqual([])
  })

  it('does not use filler while newPool still has cards', () => {
    const [a, x, g] = make(['a', 'x', 'g'])
    const s = stateOf({
      current: a,
      newPool: [x],
      knownPool: [g],
    })
    const next = markUnknown(s, () => 0)
    expect(next.current?.id).toBe('x')
    expect(ids(next.knownPool)).toEqual(['g'])
    expect(ids(next.reviewQueue)).toEqual(['a'])
  })

  it('does not use filler when next-up review card differs from the one just shown', () => {
    const [a, b, g] = make(['a', 'b', 'g'])
    const s = stateOf({
      current: a,
      reviewQueue: [b],
      knownPool: [g],
    })
    const next = markUnknown(s, () => 0)
    expect(next.current?.id).toBe('b')
    expect(ids(next.knownPool)).toEqual(['g'])
  })

  it('green filler that fails becomes orange and goes to reviewQueue', () => {
    const [a, g] = make(['a', 'g'])
    const s = stateOf({
      current: g,
      reviewQueue: [a],
      statuses: { a: 'unknown', g: 'known' },
    })
    const next = markUnknown(s, () => 0.999)
    expect(next.statuses['g']).toBe('repeatFail')
    expect(next.current?.id).toBe('a')
    expect(ids(next.reviewQueue)).toEqual(['g'])
  })
})

describe('countStatuses', () => {
  it('tallies status buckets', () => {
    const s = stateOf({
      statuses: {
        a: 'unseen',
        b: 'unseen',
        c: 'known',
        d: 'unknown',
        e: 'repeatFail',
      },
    })
    expect(countStatuses(s)).toEqual({ total: 5, known: 1, unknown: 1, repeatFail: 1, unseen: 2 })
  })
})

describe('session completion', () => {
  it('finishes when all cards become green', () => {
    let s = buildLearningState(make(['a', 'b', 'c']), () => 0)
    while (!isLearningDone(s)) {
      s = markKnown(s)
    }
    expect(s.current).toBeNull()
    expect(countStatuses(s).known).toBe(3)
  })
})

describe('buildTutorialDeck', () => {
  it('sorts by order then id', () => {
    const out = buildTutorialDeck([
      { id: 'b', order: 1 },
      { id: 'a', order: 0 },
      { id: 'c', order: 0 },
    ])
    expect(out.map((c) => c.id)).toEqual(['a', 'c', 'b'])
  })
})
