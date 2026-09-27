---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/imports-and-barrels.md; keep them in sync. -->

# Code style — TypeScript: import order

## Import order

external types → external/builtin values → internal (`@/`) types → internal values →
relative types → relative values → styles → side-effects, a blank line between
groups. `perfectionist/sort-imports` enforces it; `bun lint:fix` sorts.
