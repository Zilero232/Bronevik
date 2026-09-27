---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/modpack/**/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — style

## Style

The no-comments rule for application code applies here too — the `it(...)` name describes behaviour, not mechanics. Write it as a claim about the system: `'returns null when the vehicle has no expected values'`, not `'test 3'` or `'checks the if branch'`.

One `describe` per exported function, one assertion idea per `it`. Shared fixtures go in a constant above `describe`, not in `beforeEach`, when they never mutate.
