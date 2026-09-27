---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/checklist.md; keep them in sync. -->

# Verification

## Verify before claiming anything works

`bun run verify` — typecheck, ESLint, Prettier, Stylelint. `bun run test` is
separate; bare `bun test` is Bun's own runner and fails the suite. There is no
per-push CI: the manual deploy workflow (`.github/workflows/deploy.yml`, `checks`
job) runs both before any image is built.

Neither catches SSR breakage. `bun --filter @otmetki/client build` is the only
check that does — it is where a page that typechecks but throws during prerender
fails, and where a missing translation key surfaces as `MISSING_MESSAGE`.
