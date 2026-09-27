---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/modpack/**/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — where they live

## Tests sit next to what they test

A Vitest suite lives in a `_tests/` folder beside the source, named after it:
`shared/i18n/locale-path/_tests/locale-path.test.ts`. Playwright specs live in
`e2e/`. Only pure logic and components with behaviour are covered — anything
needing a database, Redis or the live Lesta API is verified by running it.

## Where they live

A unit test goes in a `_tests/` folder next to the file under test, named after it:

```text
packages/ratings/src/eff/
├── eff.ts
├── index.ts
└── _tests/eff.test.ts
```

Not `__tests__`, not a bare test file beside the source, not a separate `tests/` tree at the workspace root. E2E specs live only in the root [e2e/](../../../../e2e/) with a `.spec.ts` extension.

The one exception is the game modpack — see `modpack/tests.md`.
