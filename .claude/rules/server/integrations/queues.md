---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: queues

## Queues

Queue and job names and the payload schemas live in one place,
`modules/collector/contracts` (`QUEUE`, `JOB`) — the worker's processors and the
API's `CollectorProducerService` both import them. A module that owns its own
queue (discord, streamers, notifications, …) keeps that queue's name, job names and
payload schema in its own `config/`. Importing the collector barrel from every worker
module risks import cycles. Never a string literal at a call site.

Every processor wraps its work in `MetricsService.track({ job, run })`: `process`
delegates to a private `handle`. `MetricsService` comes from the metrics module's
own barrel, `modules/collector/metrics` (global, cycle-free), never from the
collector barrel.
