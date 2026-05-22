# SZZ Flashcards

Multi-deck flashcard study app with Payload CMS backend, MongoDB, and a bilingual (CS/EN) Next.js frontend.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Payload CMS 3** (admin at `/admin`, REST + GraphQL at `/api`)
- **MongoDB** (Atlas in production, local Docker for dev)
- **Auth.js v5** for Google sign-in, Payload's built-in for email/password
- **Tailwind CSS 4** + custom Lexical editor with WYSIWYG fractions, math blocks, and tags

## Local development

### 1. Prereqs

- Node.js 20.18+ (Vercel runs Node 24 LTS in prod)
- pnpm 11+
- Docker (for the local MongoDB container)

### 2. Install + start the database

```bash
pnpm install
docker compose up -d
cp .env.example .env.local
```

Edit `.env.local`:

- `PAYLOAD_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`
- `AUTH_SECRET` — same approach
- Leave `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` empty until you've set up users (see Bootstrap below).

### 3. Run the dev server

```bash
pnpm dev
```

- App: http://localhost:3000
- Payload admin: http://localhost:3000/admin

### 4. Seed the SZZ deck

After the first admin user is created via the admin first-run flow, run:

```bash
pnpm seed
```

This imports the legacy 302 SZZ cards as one Study (`SZZ — Globální podnikání a management`) with 9 Subjects and 20 Topics. Idempotent — safe to re-run.

## Bootstrap flow

See **Deploying to Vercel → First-run bootstrap** below. The same steps apply locally — open `http://localhost:3000/admin`, create the first admin, then seed.

## Card editor (WYSIWYG)

Cards have **rich-text** front/back fields with a curated toolbar:

- Text formatting: bold, italic, underline, sub/superscript, ordered/unordered lists, headings (h3, h4), links
- **Math block** — formula box (toolbar "+" → "Math block", or `/math`)
- **Fraction** (inline) — numerator over denominator (`/fraction`)
- **Tag** (inline) — small uppercase pill (`/tag`)

Frontend renders these as the legacy `.math-block`, `.frac`, `.tag` classes so the existing CSS-only formula styling carries over verbatim.

## Languages

UI is fully bilingual (Czech / English). Toggle in the top-right; the choice is persisted in the user's Payload record. Default language follows the browser's `Accept-Language` header.

Content (study/subject/topic/card text) is stored as-is — no per-card translation. Author whatever language fits the deck.

## Algorithms

- **Tutorial** — cards in stable `order`, each shown once.
- **Learning** — shuffled deck. Marking a card "I don't know" re-inserts it at a random offset (2–5 cards ahead). Marking "I know" removes it from the session. The session ends when the deck is empty.

Per-user progress (known / unknown counts, last seen) is persisted in the `progress` collection and surfaced on the Stats page.

## Project structure

```
src/
├── access/                 # Payload access-control helpers
├── admin/                  # Payload admin theming (Logo, Icon, styles)
├── app/                    # Next.js App Router routes
│   ├── (app)/              # Authenticated app routes
│   ├── (payload)/          # Payload admin route group
│   ├── api/                # Auth + progress endpoints
│   └── sign-in/
├── collections/            # Payload collections
├── components/             # React UI
├── lexical/                # Custom Lexical blocks + render + HTML import
├── lib/
│   ├── auth/               # session helpers
│   ├── i18n/               # cs/en dictionaries + provider
│   └── learning/           # tutorial + learning algorithms
├── payload.config.ts
├── auth.ts                 # NextAuth (Google) config
└── seed/seed-szz.ts        # one-shot legacy import
```

## Deploying to Vercel

The Payload admin and the Next.js frontend share a single Vercel deployment. Functions run on Fluid Compute (Node.js 24 LTS, 300s default timeout) — no `vercel.json` is needed; the framework is auto-detected.

### 1. Provision MongoDB Atlas

1. Create a free cluster at https://cloud.mongodb.com.
2. Add a database user with read/write access.
3. Add `0.0.0.0/0` to the IP allow-list (Vercel Functions don't have static egress IPs on Hobby/Pro). For stricter setups, enable [Vercel Secure Compute](https://vercel.com/docs/security/secure-compute) and Atlas IP allow-listing.
4. Grab the SRV connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/szz-flashcards?retryWrites=true&w=majority`.

### 2. Link the project and set env vars

```bash
pnpm i -g vercel@latest
vercel link
```

Set the following on **Production**, **Preview**, and **Development**:

| Variable | Value |
|---|---|
| `PAYLOAD_SECRET` | 32-byte random string (`node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`) |
| `AUTH_SECRET` | 32-byte random string (same as above) |
| `DATABASE_URI` | MongoDB Atlas SRV connection string |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.tld` (production) |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_GOOGLE_ID` | leave unset until step 4 |
| `AUTH_GOOGLE_SECRET` | leave unset until step 4 |

```bash
vercel env add PAYLOAD_SECRET production preview development
vercel env add AUTH_SECRET    production preview development
vercel env add DATABASE_URI   production preview development
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env add AUTH_TRUST_HOST production preview development   # value: true
```

### 3. Deploy

```bash
vercel deploy --prod
```

### 4. First-run bootstrap

1. Open `https://your-domain.tld/admin` — Payload's first-run flow creates the initial admin user.
2. Seed the deck (run locally against the Atlas DB):
   ```bash
   DATABASE_URI="<atlas-uri>" PAYLOAD_SECRET="<prod-secret>" pnpm seed
   ```
3. In `/admin`, add additional Users (email = the Google account they'll sign in with), set their role.
4. Create a Google OAuth client at https://console.cloud.google.com/apis/credentials. Authorized redirect URIs:
   - `https://your-domain.tld/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for dev)
5. Set `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` in Vercel env, redeploy.
6. Users sign in at `/sign-in`. Email not in the Users collection → blocked (no auto-provisioning).

### Build behavior

`pnpm build` runs `payload generate:importmap && next build`. The Payload admin import map is gitignored and regenerated on every build.

## Tests

```bash
pnpm vitest          # unit tests for the learning algorithms
```
