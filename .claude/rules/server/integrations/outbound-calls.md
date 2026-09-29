---
paths:
  - "apps/web/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/web/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: outbound calls

## Outbound calls

Plain HTTP goes through `HttpClientService` (`core/http`) over the shared `ky`
instance in `lib/http` (one User-Agent, a default timeout), so tests mock the
service instead of stubbing `fetch`; `lib/lesta`'s requester builds its own `ky` instance with the lane's `timeoutMs`. A call
without a timeout holds the connection, and the job, indefinitely.
