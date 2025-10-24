# OPS Online Support — Static Dual Build

<<<<<<< HEAD
This repository provides two static experiences backed by a single design system and shared data layer:
=======
A secure, Next.js powered static experience highlighting OPS Online Support services across Operations, Contact Center, IT Support, and Professionals guilds. The site embraces OPS CySec Core guardrails mapped to NIST CSF, CISA Cyber Essentials, and PCI DSS principles.
>>>>>>> origin/main

- **`/ops-spa/`** — a framework-free React-style SPA assembled with vanilla ES modules.
- **`/ops-next/`** — a Next.js 14 static export that mirrors the SPA UX for multi-page navigation.

<<<<<<< HEAD
All shared styles, data, and logic live under `/shared/`, `/comm-us/`, and `/chatbot/` so both builds stay in sync while shipping identical accessibility, security, and language/theme state behaviors.
=======
- **Landing page** with hero, navigation, and service cards that open contextual modals with learn-more CTAs.
- **Dedicated service pages** providing detailed content for Operations, Contact Center, IT Support, and Professionals offerings.
- **Chattia, Contact Us, and Join Us** forms living on isolated pages; each request is sanitized before being transmitted to Cloudflare Worker endpoints.
- **Security by default** via strict Content Security Policy, hardened headers, zero-trust messaging, and sanitized payload utilities.
- **Accessibility and UX** informed by neuro-design heuristics: keyboard-focusable controls, descriptive copy, and responsive layouts.

## Cloudflare Worker integration

The forms expect Cloudflare Worker endpoints exposed through environment variables:

- `NEXT_PUBLIC_CHATTIA_ENDPOINT`
- `NEXT_PUBLIC_CONTACT_ENDPOINT`
- `NEXT_PUBLIC_JOIN_ENDPOINT`

If these are not configured, submissions are still sanitized locally and a developer-friendly message is displayed.

## Sanitization pipeline

Input is run through `lib/sanitize.ts`, which trims dangerous characters, strips control characters and URLs, and surfaces developer warnings for additional review. The sanitized payload is then forwarded via `lib/cfWorkerClient.ts` using `fetch`.
>>>>>>> origin/main

## Visual preview

Install dependencies and launch the Next.js development preview:

```bash
npm install
```

<<<<<<< HEAD
### Run the SPA locally
=======
Next.js prints the preview URL in the terminal output. Open that address directly in your browser to explore the navigation shell, hero, service cards, and interactive modals.

## Browser-first static export

```bash
npm run export
```

This command builds the application and emits an `out/` directory containing static HTML, CSS, and JavaScript that can be hosted on any standards-compliant CDN or opened directly in a browser. With `output: 'export'` configured in `next.config.js`, running `next build` (surfaced through `npm run export`) fully prepares the static bundle for platforms such as Cloudflare Pages, Netlify, or Vercel. Security headers for static hosts (CSP, HSTS, referrer policy, permissions policy, etc.) live in `public/_headers` so CDN platforms can enforce OPS CySec guardrails without a custom server.

## Getting started

Key npm scripts:

- `npm run dev` – launch the browser preview with live reload.
- `npm run lint` – execute ESLint with the Next.js ruleset.
- `npm run export` – run the static-focused `next build` pipeline and emit the `out/` directory for distribution.
>>>>>>> origin/main

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
