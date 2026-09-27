---
paths:
  - "apps/web/server/**/*.ts"
  - "apps/web/server/prisma/**"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/web/server/CLAUDE.md; deploy in docs/ops/deploy.md. Keep them in sync. -->

# Code style — server: no Prisma migrations

## No Prisma migrations before production

The schema is synced with `bun run db:push` (`prisma db push`, `prisma generate`
and the Timescale layer via `db:timescale`). Never add `prisma migrate` or a
`migrations/` folder until the first production release.
