---
paths:
  - "apps/web/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/shared/forbidden.md; keep them in sync. -->

# Code style — client: locale-aware navigation

## Locales live in the URL

Import `Link`, `useRouter` and `usePathname` from `@/shared/i18n/navigation`,
never from `next/*` — a raw `next/link` drops the user back to the default
locale. Server code reads the locale with `rootParams.locale()` from
`next/root-params`.
