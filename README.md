# OPS Online Support — Static Dual Build

This repository provides two static experiences backed by a single design system and shared data layer:

- **`/ops-spa/`** — a framework-free React-style SPA assembled with vanilla ES modules.
- **`/ops-next/`** — a Next.js 14 static export that mirrors the SPA UX for multi-page navigation.

All shared styles, data, and logic live under `/shared/`, `/comm-us/`, and `/chatbot/` so both builds stay in sync while shipping identical accessibility, security, and language/theme state behaviors.

## Getting started

```bash
npm install
```

### Run the SPA locally

Serve the `ops-spa/` folder with any static web server (for example `npx serve ops-spa`). The entrypoint `index.html` loads `/shared/styles/base.css` and `/ops-spa/js/app.js` which lazily imports forms and the chatbot on demand.

### Develop or export the Next.js build

```bash
npm run dev        # next dev ops-next
npm run build      # next build ops-next (static export to ops-next/out)
```

The Next.js pages are purely client components; there are no API routes or runtime dependencies which keeps the export static host friendly.

## Key capabilities

- **Internationalization + theming** — English/Spanish and Dark/Light toggles persist via `shared/lib/state.js` and update the `<html lang>` attribute plus `<body class="dark">` in both builds. The same toggles surface inside the Chattia header.
- **Services data parity** — Service cards and modal copy are sourced from `shared/data/services.en.json` and `shared/data/services.es.json` so card content remains consistent across platforms.
- **Lazy-loaded workflows** — Join Us, Contact Us, and Chattia modules live in `/comm-us/` and `/chatbot/`. They only load when requested to honor static hosting and performance goals.
- **Security and HCI guardrails** — Every CTA injects a honeypot input, forms enforce allow-listed validation with 10-second rate limits, modals lock body scroll, close on ESC/backdrop, and are draggable on large screens.
- **On-device Chattia** — `/chatbot/` ships a BM25 retrieval engine over local corpora (EN/ES), Web Speech API STT/TTS helpers, and safety policies so the assistant operates without network calls.

## Project structure

```
shared/            # design tokens, base styles, data, utilities, icons
comm-us/           # join/contact form logic, validation, modal helpers
chatbot/           # Chattia widget, retrieval engine, corpora, speech + safety
ops-spa/           # static SPA entrypoint and UI components
ops-next/          # Next.js 14 app/ directory configured for static export
```

## Static hosting guidance

- Serve everything over HTTPS with a CSP such as `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:`.
- Cache hashed JS/CSS aggressively while keeping JSON corpora and service data on a short cache to support updates.
- There are no runtime API calls; all submissions display "Saved locally" confirmations and expose JSON payloads for manual export.
