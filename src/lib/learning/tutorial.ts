export type DeckCard = { id: string; order?: number | null }

/**
 * Tutorial mode: cards in stable `order` (then by id), each shown once.
 * No re-queuing on `unknown`.
 */
export function buildTutorialDeck<T extends DeckCard>(cards: readonly T[]): T[] {
  return [...cards].sort((a, b) => {
    const oa = a.order ?? Number.MAX_SAFE_INTEGER
    const ob = b.order ?? Number.MAX_SAFE_INTEGER
    if (oa !== ob) return oa - ob
    return a.id.localeCompare(b.id)
  })
}

export function tutorialAdvance<T>(deck: readonly T[]): T[] {
  return deck.slice(1)
}
