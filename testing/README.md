# Testing workspace

This folder is intentionally detached from the production Next.js app. It offers disposable sandboxes for developers who need to
validate tooling, run security scans, or diagnose package manager hiccups without touching the main codebase.

## Structure

- `node/` — npm-focused workspace with diagnostics (`npm run diagnose` / `npm run nmp`) and lint/test placeholders.
- `python/` — virtual-environment friendly requirements for security scripts and data utilities.

Feel free to remove the entire `testing/` directory once the validation cycle ends.
