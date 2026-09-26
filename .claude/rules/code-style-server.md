---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/style.md §18. Keep them in sync. -->

# Code style — server

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

## Nothing but the class in a service or controller file

| What                               | Where                                                       |
| ---------------------------------- | ----------------------------------------------------------- |
| Constants, timeouts, lookup tables | `config/<concern>.config.ts` or `<name>.constants.ts`       |
| Pure domain logic                  | `lib/<name>/` — one folder per **concern**, tested there    |
| Row / payload → DTO converters     | `mappers/<name>/` — every `to*View` / `to*Dto`               |
| Prisma `select` / `include`        | `selects/<name>/` with its `GetPayload` type                 |
| Standalone raw-SQL builders        | `queries/<name>/` (`Prisma.sql` fragments)                    |
| Guards, decorators, interceptors   | `guards/`, `decorators/`, `interceptors/`, one folder each    |
| Types                              | `x.types.ts` next to the file that owns them                |

Every item is its own folder (`<name>.ts` + `.types.ts` + `index.ts` + `_tests/`) and every
segment has an `index.ts` barrel. A file that mixes a mapper with domain logic is split:
`tanks/lib/vehicle-sources` keeps `rewardMissions`, `tanks/mappers/vehicle-source-view`
takes `toVehicleSourceView`. The same folder rule holds in `common/`, `config/` and
`core/` (`config/cors/`, `config/env/`, `config/lesta-mock/`, `core/prisma/lib/advisory-lock/`).

Import from a module's barrel across boundaries, never reach into its files.
Inside a module, relative paths are fine.

Nest resolves providers from decorator metadata, so **no `import type` for
injected classes** — the `otmetki/server` ESLint block turns
`ts/consistent-type-imports` off for the server app.

## Errors

Throw the app exceptions from `common/exceptions` with a code from
`@otmetki/schemas`. The client matches on the code, so the message is free text
but the code is a contract.

```ts
throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`);
```

## Environment

`config/env/env.schema.ts` validates on boot and **throws** on a missing or malformed
variable. Only secrets, addresses, ports and connection strings are env; every
tunable is an `as const` object in `config/*.constants.ts` (`FEATURES`, `SOURCES`,
`LESTA`, `TIMESCALE`, `BULL_BOARD`). A new schedule gets a `FEATURES` flag.

## The Lesta API

Every Lesta call goes through `lib/lesta`, built once in `core/lesta`
(`LESTA_CLIENTS`: a `priority` and a `bulk` lane) with the shared Redis token
bucket (`LESTA_RPS`, shared by the API and the worker per registered IP). Never create a second limiter or
call `api.tanki.su` with a bare `fetch`. The client batches ids and retries with
`p-retry`; don't wrap it in another retry loop.

## Outbound calls

Plain HTTP goes through the shared `ky` instance in `lib/http` (one User-Agent,
a default timeout); `lib/lesta`'s requester uses `AbortSignal.timeout`. A call
without a timeout holds the connection, and the job, indefinitely.

## Queues

Queue and job names and the payload schemas live in one place,
`modules/collector/contracts` (`QUEUE`, `JOB`) — the worker's processors and the
API's `CollectorProducerService` both import them. Never a string literal at a
call site.

## Parse strictly on a write path

`readRecord` returns `{}` on a malformed value and `toJsonValue` returns
`Prisma.JsonNull` — both belong to reads and to storing raw payloads. Never feed
a tolerant parse into a write that replaces a stored value: unreadable input
becomes an empty object, which then overwrites the real one. On a write path,
parse with the Zod schema and refuse on failure.

## Data retention is a Lesta term

Purge jobs, deletion requests (`PurgeGuardService`) and the Timescale retention
policies (`TIMESCALE` in `config/timescale.constants.ts`) are not optional.

## No Prisma migrations before production

The schema is synced with `bun run db:push` (`prisma db push`, `prisma generate`
and the Timescale layer via `db:timescale`). Never add `prisma migrate` or a
`migrations/` folder until the first production release.
