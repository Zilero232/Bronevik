# CLAUDE.md — apps/server

Guidance for the server app. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**NestJS 11 on Bun** + Prisma 7 + PostgreSQL/TimescaleDB + Redis + BullMQ. Bun runs the TypeScript directly — no build step. One image, two processes:

- `src/main.ts` → `AppModule`: the site API, developer API `/v1`, auth, mod ingest, Swagger at `/docs` (outside production), bull-board at `/admin/queues` (when `BULL_BOARD_PASSWORD` is set).
- `src/worker.ts` → `WorkerModule`: the collector, a standalone application context with no HTTP port. Its heartbeat and the Lesta circuit state show up in the API's `/health`.

## Layout

```text
src/
├── main.ts, app.module.ts        # the API
├── worker.ts, worker.module.ts   # the collector worker
├── config/      # env.schema.ts (secrets, addresses, ports only) + *.constants.ts (every tunable)
├── core/        # prisma (factory, timescale), redis, logger, queues (BullMQ connection), lesta (priority + bulk clients)
├── common/      # exceptions, filters, decorators, shared pure helpers
├── lib/         # lesta (Lesta API client), replay (.mtreplay parser, NOTICE), http (ky), auth (better-auth)
└── modules/
    ├── collector/   # contracts/ (QUEUE, JOB, payloads), producer/ (API side), queues/, board/ (bull-board),
    │                # metrics/ (job metrics, cockatiel breaker), schedules/, monitoring/,
    │                # tracking, clans, reference, aggregates, news, purge — each with processors/ services/ lib/ config/
    ├── gamedata/    # game-client data importer, run by `bun run gamedata:import`
    └── auth, players, tanks, clans, marks, … # API modules
prisma/          # base.prisma, schema/*.prisma, migrations/, sql/timescale/
scripts/         # timescale.ts (db:timescale), gamedata-import.ts
generated/       # Prisma client (gitignored)
```

## Module convention

`x.module.ts` + `x.controller.ts` (or `processors/` in the collector) + `services/`, plus `dto/`, `lib/`, `config/` as needed. One service per domain of work; nothing but the class in a service, processor or controller file — constants in `config/`, pure functions in `lib/<concern>/`, types in `*.types.ts`. Import across modules only through a module's `index.ts`. The full digest is [.claude/rules/code-style-server.md](../../.claude/rules/code-style-server.md).

## Collector

- **Queue contracts live once**, in `modules/collector/contracts`. Processors parse every payload with its schema; the API enqueues through `CollectorProducerService`.
- **Every processor wraps its work in `MetricsService.track({ job, run })`**, which counts the job and attributes the Lesta calls made inside it to the job's queue.
- **Lesta goes through `core/lesta`**: `priority` for tier A and the API, `bulk` for sweeps, sharing one Redis bucket (`LESTA_RPS`) with the bulk lane capped at `1 - LESTA.tierAReserve`. The breaker (`metrics/circuit-breaker.service.ts`, cockatiel `SamplingBreaker`) only observes outcomes; while it is open the sweep worker pauses and sweep batches are delayed.
- **Schedules** are `modules/collector/schedules/config`, switched by `FEATURES` and off under `NODE_ENV=test`. Without `LESTA_APPLICATION_ID` the worker starts degraded: it logs a warning, loads no tracking or clan processors and registers no Lesta schedule.
- Data retention is a Lesta term: the purge jobs and the Timescale policies (`config/timescale.constants.ts`) are not optional.

## Prisma

The schema is split across `prisma/schema/`; the client is generated into `generated/` on `postinstall`. `bun run db:migrate` runs `prisma migrate dev`, `prisma generate` and then the Timescale layer (`scripts/timescale.ts`, idempotent); `db:deploy` does the same with `migrate deploy`. Hypertables carry no foreign keys — the purge deletes their rows explicitly.

## Verification

```bash
bun run dev:server     # :4000 — curl localhost:4000/health, open /docs
bun run dev:worker     # logs "registered N of M job schedulers"
bun run test           # vitest; services are tested with vitest-mock-extended
```
