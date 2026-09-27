---
paths:
  - "apps/web/client/**/*.{ts,tsx}"
  - "apps/web/client/shared/i18n/**"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/shared/forbidden.md; keep them in sync. -->

# Code style — client: i18n messages

## i18n

Everything user-visible goes through next-intl, in **both** languages: `shared/i18n/locales/{ru,en}/<namespace>.json`
(one file per top-level namespace; a new namespace needs a file in both folders and a line in both `index.ts`), always in sync.
That includes brand terms and key caps: `WN8` is `common.ratings.wn8`, `Ctrl` / `Esc` are
`common.kbd.*`, a host name shown as link text is a key too. The one exception is the site
name and description in `shared/config/site`, which feed the web manifest and metadata
fallbacks outside a request's locale.

Contract schemas come from `@otmetki/schemas` or the generated `z*` schemas
(`shared/api/generated/zod.gen.ts`); a form schema builds on them rather than
restating their limits (`docs/guides/client/forms.md`).
