---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/game/modpack/**/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — style

## Style

The no-comments rule for application code applies here too — the `it(...)` name describes behaviour, not mechanics. Write it as a claim about the system: `'returns null when the vehicle has no expected values'`, not `'test 3'` or `'checks the if branch'`.

Imports use the `@/` alias, never a relative path out of the slice; the only deep path a test names is the module it mocks or spies on.

One `describe` per exported function, one assertion idea per `it`. Shared fixtures go in a constant above `describe`, not in `beforeEach`, when they never mutate.
