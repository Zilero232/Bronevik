---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; API terms in docs/research/data/lesta-api.md. Keep them in sync. -->

# Code style — server: the Lesta API

## The Lesta API

Every Lesta call goes through `lib/lesta`, built once in `core/lesta`
(`LESTA_CLIENTS`: a `priority` and a `bulk` lane) with the shared Redis token
bucket (`LESTA_RPS`, shared by the API and the worker per registered IP). Never create a second limiter or
call `api.tanki.su` with a bare `fetch`. The client batches ids and retries with
`p-retry`; don't wrap it in another retry loop.
