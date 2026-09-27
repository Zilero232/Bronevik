# Server routes — NestJS

Part of the [style guide](../../README.md).

## 18. Server routes — NestJS

The server app is NestJS 11 on Bun, not a route-definition framework. What matters from
the client's side:

```text
src/modules/search/
  search.module.ts
  search.controller.ts    ← thin: validate, delegate, return
  search.types.ts
  services/               ← the business logic, one service per domain of work
  dto/                    ← createZodDto(...) wrappers
  mappers/<name>/         ← DB row / Prisma payload / Lesta payload → DTO (every to*View)
  selects/<name>/         ← Prisma select / include constants and their payload types
  queries/<name>/         ← standalone raw-SQL builders (Prisma.sql)
  lib/<concern>/          ← pure domain logic only
  guards/ decorators/ interceptors/  ← Nest enhancers, one folder per item
  processors/             ← BullMQ processors and their *-schedules.service.ts
  providers/              ← custom providers and queue registrations (<name>.provider.ts)
  templates/ assets/      ← message templates, static files read at runtime
  config/                 ← <concern>.constants.ts: constants, timeouts, lookup tables, queue names
  index.ts                ← the module's public API
```

- DTOs wrap a schema: `export class SearchQueryDto extends createZodDto(searchQuerySchema) {}`
  (`nestjs-zod`). A contract the client reads or sends lives in `@otmetki/schemas`, so
  client and server validate against one definition; a request schema only the server
  validates may live in the module's `dto/<module>.schemas.ts`, and the client gets its
  type from the OpenAPI codegen.
- Every processor's `process` wraps a private `handle` in `MetricsService.track`
  (`MetricsService` from `modules/collector/metrics`).
- The collector (`modules/collector`) is a module of sub-modules — `tracking`, `clans`,
  `reference`, `aggregates`, `news`, `purge`, `metrics`, `producer`, `queues`,
  `schedules`, `board`, `monitoring` — each shaped like a module; its `contracts/` holds
  the shared queue contract (`QUEUE`, `JOB`, payload schemas).
- Domain errors are thrown as the app exceptions from `common/exceptions` with a
  code from `@otmetki/schemas` — `` throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`) ``.
  The client matches on the code, so the message is free text but the code is a
  contract.
- Import from a module's barrel across module boundaries, never into its files.
