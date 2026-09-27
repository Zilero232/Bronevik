# External documentation

Where the docs for our dependencies come from, and when reading them is mandatory.

**Nothing is vendored into this repo.** Third-party docs are fetched live through the **context7 MCP server**, which serves version-current pages. A copy checked into `docs/` would drift from the installed version within weeks and would be worse than no copy at all. The one exception is the Lesta API itself, which context7 does not index: [../../research/data/lesta-api.md](../../research/data/lesta-api.md).

## How to fetch

Two calls, always in this order:

1. `resolve-library-id` — the library name plus what you are trying to do, returns a `/org/project` id.
2. `query-docs` — that id plus **one concept per call**. Split unrelated questions into separate calls.

The table below already carries the resolved ids, so step 1 can be skipped for anything listed here.

## Resolved library ids

| Area                          | Package (version)                    | context7 id                          |
| ----------------------------- | ------------------------------------ | ------------------------------------ |
| Web framework                 | `next` ^16.3.6                       | `/vercel/next.js`                    |
| UI runtime                    | `react` ^19.3.0                      | `/reactjs/react.dev`                 |
| i18n                          | `next-intl` ^4.14.7                  | `/amannn/next-intl`                  |
| Server state                  | `@tanstack/react-query` ^5.103.2     | `/tanstack/query`                    |
| Tables                        | `@tanstack/react-table` ^8.21.3      | `/tanstack/table`                    |
| Charts                        | `@visx/*` ^4.0.0                     | `/airbnb/visx`                       |
| Command palette               | `cmdk` ^1.1.1                        | `/dip/cmdk`                          |
| UI primitives                 | `@base-ui/react` ^1.8.0              | `/mui/base-ui`                       |
| Animation                     | `motion` ^13.4.3                     | `/motiondivision/motion`             |
| Generic hooks                 | `@siberiacancode/reactuse` ^1.0.17   | resolve on demand                    |
| API framework                 | `@nestjs/core` 11.2.6                | `/nestjs/docs.nestjs.com`            |
| Queues                        | `bullmq` ^5.60.0                     | `/taskforcesh/bullmq`                |
| Queues in Nest                | `@nestjs/bullmq` ^12.0.0             | `/nestjs/bull`                       |
| Auth                          | `better-auth` ^1.7.5                 | `/better-auth/better-auth`           |
| ORM                           | `prisma` ^7.10.0                     | `/prisma/docs`                       |
| Time-series                   | TimescaleDB (pg17 image)             | `/timescale/timescaledb`             |
| Redis client                  | `ioredis` ^5.8.0                     | `/redis/ioredis`                     |
| Shared Lesta rate limit       | `rate-limiter-flexible` 11.2.1       | `/animir/node-rate-limiter-flexible` |
| Collector monitoring server   | `hono` 4.13.9                        | `/websites/hono_dev`                 |
| Logging                       | `pino` ^10.3.1                       | `/pinojs/pino`                       |
| Validation                    | `zod` ^4.6.5                         | `/colinhacks/zod`                    |
| Data helpers                  | `remeda` ^2.50.0                     | `/remeda/remeda`                     |
| Pattern matching              | `ts-pattern` ^5.9.0                  | `/gvergnaud/ts-pattern`              |
| Dates                         | `date-fns` ^4.4.0                    | `/date-fns/date-fns`                 |
| Unit tests                    | `vitest` ^5.0.1                      | `/vitest-dev/vitest`                 |
| E2E tests                     | `@playwright/test` ^1.63.0           | `/microsoft/playwright`              |
| Unused code                   | `knip` ^6.38.0                       | `/websites/knip_dev`                 |

Ids for anything not listed: resolve it, then add the row here.

## When fetching is mandatory

Read the docs **before writing the code**, not after a failure, whenever the task involves:

- **A Next.js file convention or an async API** — `params`/`searchParams`, metadata, route handlers, `cacheComponents`, `proxy.ts`, the RSC boundary. Version 16 differs from every tutorial written for 13-15.
- **next-intl routing** — `localePrefix`, the middleware (proxy) matcher, `next/root-params`, navigation wrappers.
- **A react-query behaviour that is not `useQuery(key, fn)`** — retry semantics, `gcTime` versus `staleTime`, invalidation, optimistic updates.
- **BullMQ beyond add/process** — job schedulers and repeatable jobs, flows, rate limiting, stalled jobs, removal policies, concurrency. The collector's correctness depends on these.
- **A Prisma migration or a schema-level feature** — multi-file schema, driver adapters (`@prisma/adapter-pg`), `migrate` versus `db push`, raw SQL for Timescale objects Prisma does not model.
- **TimescaleDB** — hypertables, continuous aggregates, compression and retention policies (`apps/server/prisma/sql/timescale`).
- **better-auth configuration** — plugins, hooks, session transport, the Prisma adapter's schema expectations.
- **A Base UI primitive or a visx chart part** — parts, render props, portals, scales and tooltips.
- **A helper that might already exist** in remeda / ts-pattern / date-fns / reactuse — see "Reuse over reinvention" in the root [CLAUDE.md](../../../CLAUDE.md).

Skip fetching only for a mechanical edit inside code whose API is already visible in the file being edited.

## Precedence

Repo documents outrank library documents. When an external page suggests a pattern our own docs forbid — an `interface`, a positional multi-argument function, a manual `fetch` against Lesta — our rule wins. The library docs answer _how the API behaves_, never _how this project is written_.

Internal documents: [architecture/fsd.md](../../architecture/fsd.md) for layer rules, [guides/](../README.md) for code style, [research/](../../research/) for the Lesta API, the market and package research, [features.md](../../product/features.md) for product scope.
