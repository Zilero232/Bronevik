---
paths:
  - "apps/web/client/**/_tests/**/*.{ts,tsx}"
  - "apps/web/client/vitest.config.*"
  - "apps/web/client/vitest.setup.ts"
  - "e2e/**/*.spec.ts"
  - "playwright.config.ts"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — client environment

## Environment

- **client** — jsdom, pool `vmThreads`, `@testing-library/react`, setup in [apps/web/client/vitest.setup.ts](../../../../apps/web/client/vitest.setup.ts) (stubs `ResizeObserver`, `IntersectionObserver` and `matchMedia`, mocks `next/navigation`, `next/font/local` and `next/font/google`, cleans the DOM after each test). Client env is declared in the config — don't read `.env` from a test.
