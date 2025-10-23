# Node testing workspace

This folder isolates Node.js tooling so developers can experiment without polluting the production Next.js project.

## Usage

1. Install dependencies (optional if you only need diagnostics):
   ```bash
   npm install
   ```
2. Run diagnostics when `npm` misbehaves or the registry is unreachable:
   ```bash
   npm run diagnose
   # alias provided for convenience
   npm run nmp
   ```
3. Wire in your own tooling:
   ```bash
   npm run lint
   npm run test
   ```

The diagnostics script checks your local Node runtime, npm availability, cache configuration, and registry reachability. It is
safe to delete this entire directory after the testing cycle.
