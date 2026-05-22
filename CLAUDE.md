# SZZ Flashcards

Multi-deck flashcard study app: Next.js 16 + Payload CMS 3 (single repo, single deployment) on top of MongoDB.

## Architecture

- **Next.js App Router** (`src/app`); Payload admin lives at `/admin` via the `(payload)` route group; everything else is the user-facing app under `(app)`.
- **Payload 3** is embedded — `src/payload.config.ts` is loaded by `withPayload(nextConfig)` in `next.config.ts`.
- **MongoDB** via `@payloadcms/db-mongodb`. Local dev uses `docker-compose.yml` (single mongo:8 container). Production is MongoDB Atlas.
- **Auth**: dual path. Payload's built-in email/password (admins, bootstrap) + Auth.js v5 Google provider (`src/auth.ts`). Both converge on the Payload `users` collection. Google sign-in **only succeeds if the email already exists** in `users` — admin-curated allow-list, no auto-provisioning.
- **i18n**: bilingual (cs/en). Frontend uses a tiny in-house dictionary (`src/lib/i18n/{cs,en}.json` + provider). Payload admin uses `@payloadcms/translations/languages` (`cs`, `en`). Content (cards, etc.) is stored verbatim, no per-record translation.

## Data model (Payload collections)

- `users` — auth, role (`admin` | `user`), `preferredLanguage`, `googleId`. Allow-list: only admins can create users.
- `studies` — top-level decks.
- `subjects` — child of study; `mode = flat | topical` (validated): flat means cards attach directly; topical means cards must belong to a topic under the subject.
- `topics` — child of subject (only for topical subjects).
- `cards` — `front` and `back` are Payload Lexical rich text. Custom blocks: `mathBlock` (rendered as `<div class="math-block">`), `fraction` (inline, → `<span class="frac">`), `tag` (inline, → `<span class="tag">`). Frontend renderer is `src/lexical/render.tsx`. Legacy HTML importer is `src/lexical/html-import.ts`.
- `progress` — per-user per-card state. Composite unique index on `(user, card)`.

## Learning modes

`src/lib/learning/`:
- `buildTutorialDeck` — sort by `order`, each card once.
- `buildLearningDeck` — Fisher-Yates shuffle.
- `markKnown` — drop the front card.
- `markUnknown` — re-insert at a random offset in [2, 5] from the front.

Session state is React-only (no `sessions` collection). Marks write through to `progress` via `POST /api/progress/mark`.

## Key paths

- `src/payload.config.ts` — Payload config (collections, admin theme, i18n).
- `src/lexical/{blocks,editor,render,html-import}.ts` — card rich text plumbing.
- `src/lib/auth/session.ts` — `getCurrentUser()` resolves either auth path.
- `src/components/LearnSession.tsx` — flip / swipe / keyboard / mark.
- `src/seed/seed-szz.ts` — one-shot import from `legacy/flashcards.js` (302 cards / 9 subjects / 20 topics).

## Conventions

- Server components default; `'use client'` only where needed.
- Path alias `@/*` → `src/*`. `@payload-config` → `src/payload.config.ts`.
- Tailwind 4 (CSS-first config in `src/app/globals.css`); the legacy `.frac`, `.frac-num`, `.frac-den`, `.math-block`, `.tag` classes are preserved verbatim there.

## Local dev

```bash
pnpm install
cp .env.example .env.local   # then fill PAYLOAD_SECRET, AUTH_SECRET
pnpm dev                      # auto-starts mongo, runs next dev, stops mongo on exit if it wasn't already up
# create first admin via Payload first-run at /admin, then:
pnpm seed                     # imports the legacy SZZ deck
pnpm vitest                   # unit tests for learning algorithms
```

Scripts:
- `pnpm db` — start mongo only (leaves it running)
- `pnpm db:stop` — stop mongo
- `pnpm dev` — start mongo if not running, run next dev, auto-stop mongo on exit unless it was already up
- `pnpm devsafe` — wipe `.next` then run next dev (does not touch docker)

## Legacy

Original static PWA (302 cards bundled in JS, localStorage, Czech-only) lives in `legacy/`. Kept only as a source for the seed script; not deployed.
