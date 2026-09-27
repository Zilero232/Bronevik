---
paths:
  - "apps/client/**/*.{ts,tsx}"
  - "apps/client/shared/i18n/**"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/shared/forbidden.md; keep them in sync. -->

# Code style — client: i18n messages

## i18n

Everything user-visible goes through next-intl, in **both** languages: `shared/i18n/locales/{ru,en}/<namespace>.json`
(one file per top-level namespace; a new namespace needs a file in both folders and a line in both `index.ts`), always in sync. Shared Zod schemas come from
`@otmetki/schemas`, not inline.
