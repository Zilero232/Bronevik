---
paths:
  - "apps/client/**/_tests/**/*.{ts,tsx}"
  - "apps/client/vitest.config.*"
  - "apps/client/vitest.setup.ts"
  - "e2e/**/*.spec.ts"
  - "playwright.config.ts"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — client environment

## Environment

- **client** — jsdom, `@testing-library/react`, setup in [apps/client/vitest.setup.ts](../../../../apps/client/vitest.setup.ts) (stubs `ResizeObserver`, `IntersectionObserver` and `matchMedia`, mocks `next/navigation` and `next/font/local`, cleans the DOM after each test). Client env is declared in the config — don't read `.env` from a test.
