---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: outbound calls

## Outbound calls

Plain HTTP goes through the shared `ky` instance in `lib/http` (one User-Agent,
a default timeout); `lib/lesta`'s requester uses `AbortSignal.timeout`. A call
without a timeout holds the connection, and the job, indefinitely.
