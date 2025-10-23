# OPS Online Support

A secure, Next.js powered static experience highlighting OPS Online Support services across Operations, Contact Center, IT Support, and Professionals guilds. The site embraces OPS CySec Core guardrails mapped to NIST CSF, CISA Cyber Essentials, and PCI DSS principles.

## Features

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

## Visual preview

Install dependencies and launch the Next.js development preview:

```bash
npm install
npm run dev
```

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

## Testing workspace (ephemeral)

A `testing/` directory provides language-specific scaffolding developers can optionally use. It is intentionally decoupled from the production build and can be removed when no longer needed.

- `testing/node` bundles an isolated `package.json` with lint/test placeholders and a `diagnose.mjs` helper. Run `npm run diagnose` (or the shortcut `npm run nmp`) when registry access fails or npm reports environment issues.
- `testing/python` offers a lightweight `requirements.txt` for security tooling such as Bandit plus a README describing virtual env setup.
