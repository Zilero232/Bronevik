---
paths:
  - "apps/web/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/web/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: module shape

NestJS 11 on Bun + Prisma 7 (client generated into `apps/web/server/generated`) +
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

## Segments beyond the basics

- `processors/` — BullMQ processors and the module's `*-schedules.service.ts`
  (the `createJobSchedules` registration lives beside the processor it feeds).
- `providers/` — Nest custom providers and queue registrations, one flat
  `<name>.provider.ts` each (`yooKassaProvider`, `armorStorageProvider`,
  `notificationQueues`); a module file declares nothing at the top level.
- `templates/` — rendered message templates (`notifications/templates`);
  `assets/` — static files a service reads at runtime (`social/assets` fonts).
- `contracts/` — the collector's shared queue contract only (`QUEUE`, `JOB`,
  payload schemas); any other module keeps its queue in `config/`.
- The collector is a module of sub-modules (`tracking`, `clans`, `reference`,
  `aggregates`, `news`, `purge`, `metrics`, `producer`, `queues`,
  `schedules`, `board`, `monitoring`); each follows this shape, and a
  sub-module with a single service keeps it at its root
  (`producer/collector-producer.service.ts`).

## DTO schemas

A contract the client reads or sends lives in `@otmetki/schemas` and the DTO
wraps it (`createZodDto(searchQuerySchema)`). A request schema only the server
validates — an admin body, a query shape no client code builds — may live in the
module's `dto/<module>.schemas.ts`; the client still gets its type through the
OpenAPI codegen. Stored-JSON shapes the server parses on read and write sit there too.
