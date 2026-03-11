# SZZ Flashcards PWA

Flashcard app for SZZ exam preparation (Globální podnikání a management). Czech language UI.

## Architecture

Static PWA (no build step, no bundler). Serve `index.html` directly.

- **index.html** – SPA shell, all 5 screens (home, questions, subjects, study, stats)
- **styles.css** – Dark theme, mobile-first, CSS 3D card flip, formula rendering (`.frac`, `.math-block`)
- **app.js** – IIFE: hash router, card interaction, progress (localStorage), swipe/keyboard
- **flashcards.js** – 302 cards, 20 questions, 9 subjects (data extracted from `input/data.md`)
- **sw.js** – Cache-first service worker
- **manifest.json** – PWA manifest
- **icons/** – SVG icons

## Key conventions

- No frameworks, no dependencies, no build tools
- All UI text is in Czech
- Hash routing (`#/`, `#/questions`, `#/subjects`, `#/study/...`, `#/stats`)
- Progress stored in localStorage under key `szz-progress`
- Formulas use CSS-only rendering (`.frac` for fractions, `<sub>`/`<sup>`)
- Card states: `unseen` | `known` | `unknown`

## Deployment

Will be deployed to Fly.io as a static site (needs a lightweight HTTP server like nginx or `serve`).

## Development

```
npx serve .
# or
python -m http.server 8000
```

Open http://localhost:8000 (or :3000 for serve).
