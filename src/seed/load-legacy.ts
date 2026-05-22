import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const here = path.dirname(fileURLToPath(import.meta.url))
const legacyPath = path.resolve(here, '../../legacy/flashcards.js')

export type LegacyData = {
  subjects: { id: string; name: string; questionIds: string[] }[]
  questions: { id: string; title: string; subtitle?: string }[]
  cards: { id: string; questionId: string; front: string; back: string }[]
}

/**
 * Loads `legacy/flashcards.js` which is a plain object literal assigned to a
 * top-level const. We read the file and extract the assignment via a small
 * Function wrapper. The content is local, trusted, and only used in seeding.
 */
export async function loadLegacyData(): Promise<LegacyData> {
  const source = await readFile(legacyPath, 'utf8')
  const fn = new Function(`${source}; return FLASHCARD_DATA;`)
  const data = fn() as LegacyData
  return data
}
