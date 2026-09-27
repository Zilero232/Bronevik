---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: module shape

NestJS 11 on Bun + Prisma 7 (client generated into `apps/server/generated`) +
PostgreSQL with TimescaleDB + Redis + BullMQ. Bun runs the TypeScript directly,
no build step. One app, two entrypoints: `src/main.ts` (the API, `AppModule`) and
`src/worker.ts` (the collector, `WorkerModule`, a standalone application context).

## Module shape

`x.module.ts` + `x.controller.ts` + `services/`, plus `dto/`, `lib/`, `config/`
and an `index.ts` as needed; a collector module has `processors/` in place of a
controller. Controllers and processors validate, delegate, return — logic lives
in `services/<domain>.service.ts`, **one service per domain of work**
(`players/services/player-summary.service.ts`, `player-marks.service.ts`, …),
never a fat `x.service.ts` at the module root.

There is no facade: a consumer injects the specific domain service it uses, and
the module `exports` only what other modules legitimately call.
