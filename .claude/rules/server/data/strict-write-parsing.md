---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: strict parsing on writes

## Parse strictly on a write path

`readRecord` returns `{}` on a malformed value and `toJsonValue` returns
`Prisma.JsonNull` — both belong to reads and to storing raw payloads. Never feed
a tolerant parse into a write that replaces a stored value: unreadable input
becomes an empty object, which then overwrites the real one. On a write path,
parse with the Zod schema and refuse on failure.
