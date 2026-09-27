# CLAUDE.md — apps/server

Guidance for the server app. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**NestJS 11 on Bun** + Prisma 7 + PostgreSQL/TimescaleDB + Redis + BullMQ. Bun runs the TypeScript directly — no build step. One image, two processes:

- `src/main.ts` → `AppModule`: the site API, the public API `/v1` (Scalar reference at `/v1/docs`, spec at `/v1/docs/openapi.json`), auth, mod ingest, Swagger at `/docs` (outside production), bull-board at `/admin/queues` (when `BULL_BOARD_PASSWORD` is set).
- `src/worker.ts` → `WorkerModule`: the collector, a standalone application context with no HTTP port. Its heartbeat and the Lesta circuit state show up in the API's `/health`.

## Layout

```text
src/
├── main.ts, app.module.ts        # the API
├── worker.ts, worker.module.ts   # the collector worker
├── config/      # env/ (env.schema.ts: secrets, addresses, ports only) + *.constants.ts (every tunable), cors/ (per-path CORS), lesta-mock/
├── core/        # prisma (factory, timescale, error guards), redis, logger (nestjs-pino), queues (BullMQ connection), lesta (priority + bulk clients), storage (S3 / local-disk object storage), webhooks
├── common/      # exceptions, filters, decorators, cache, schedules (job schedulers), shared pure helpers in lib/
├── lib/         # lesta (Lesta API client), replay (.mtreplay parser, NOTICE), http (ky), auth (better-auth), scrape (robots-aware cheerio crawl, tanki.su listings)
├── dev/         # lesta-mock: the generated Lesta API served in development while there is no key (see Lesta API mock)
└── modules/
prisma/          # base.prisma, schema/*.prisma, sql/timescale/ (no migrations before production — see Prisma)
scripts/         # timescale.ts (db:timescale, --extensions before db push), gamedata-import.ts, openapi-export.ts, dev-seed.ts (dev:seed)
generated/       # Prisma client (gitignored)
```

### Modules

A `*-worker.module.ts` next to a module is its half loaded by `WorkerModule` (processors and schedules); the rest is loaded by `AppModule`.

| Module                  | What it owns                                                                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`                  | better-auth wiring, Lesta ID OpenID and Telegram sign-in, linked Lesta and Telegram accounts                                                                                                              |
| `billing`               | Три отметки Плюс: one plan (monthly/quarterly/yearly), trial, YooKassa checkout behind `PLUS.checkoutEnabled`, webhooks, promo codes, referrals, renewals/expiry (worker), entitlements + `@RequiresPlus` |
| `bot-commands`          | Platform-agnostic bot core shared by Telegram, Discord and VK: stats/session/marks/clan/tank/top replies, linked-account lookup, Fluent store                                                             |
| `builds`                | Loadout constructor under `/tanks/:id`: build options, loadout calculation, popular builds                                                                                                                |
| `clan-workspace`        | Clan officers' workspace: events and reminders, attendance sync from mod battle reports, recruit funnel, weekly officer report                                                                            |
| `clans`                 | Clan pages, list and search, stronghold                                                                                                                                                                   |
| `collector`             | The worker: Lesta tracking, clans, reference, aggregates, news, purge; queue contracts, metrics, bull-board                                                                                               |
| `coaching`              | Coach profiles with contact/booking links and booking requests; no payments                                                                                                                               |
| `community-builds`      | Shared player builds                                                                                                                                                                                      |
| `community-core`        | Community accounts shared by the community modules                                                                                                                                                        |
| `community-maintenance` | Community worker: post expiry                                                                                                                                                                             |
| `compare`               | Player-vs-player and tank-vs-tank comparison                                                                                                                                                              |
| `developer`             | Developer cabinet: API keys (`@better-auth/api-key`), public `/developer/tiers` (free/plus/community), webhooks (`standardwebhooks` signing, worker delivery)                                             |
| `discord`               | Discord bot (gateway in the API, REST jobs in the worker): slash commands, clan binding (/setup), clan and WN8-tier roles, event reminders, weekly officer report (Plus)                                  |
| `events`                | In-game events calendar and drops                                                                                                                                                                         |
| `gamedata`              | Game-client data importer, run by `bun run gamedata:import`                                                                                                                                               |
| `guides`                | Guides and comments                                                                                                                                                                                       |
| `health`                | `/health` (`@nestjs/terminus`): database, Redis, worker heartbeat, Lesta breaker                                                                                                                          |
| `leaderboards`          | Player and clan leaderboards                                                                                                                                                                              |
| `maps`                  | Maps from the arena data: detail, minimaps, team win rates                                                                                                                                                |
| `marks`                 | Marks of excellence tables, thresholds history, projections (and `/v1/moe`)                                                                                                                               |
| `me`                    | The signed-in user: favourites, goals, linked accounts, own marks, notification settings                                                                                                                  |
| `mod`                   | Game mod ingest: device binding, signed event batches, event ledger                                                                                                                                       |
| `moderation`            | Content reports and their resolution                                                                                                                                                                      |
| `notifications`         | Notification routing and delivery (site, Telegram, e-mail, web push), inbox, digests, marks watch                                                                                                         |
| `players`               | Player pages: summary, tanks, marks, sessions, history, playtime, insights, achievements                                                                                                                  |
| `platoons`              | Platoon board                                                                                                                                                                                             |
| `public-api`            | Public `/v1`: the v1 controllers, API-key guard, rate-limit headers, usage analytics; the only module in the `/v1` OpenAPI document                                                                       |
| `pulse`                 | Server activity pulse: hourly heatmap and sampled online series                                                                                                                                           |
| `recruiting`            | Clan recruiting board                                                                                                                                                                                     |
| `reference`             | Shared reference data: vehicle catalog, expected values, rating thresholds, Bronya references, current game version, server online                                                                        |
| `replays`               | Replay upload, parsing (worker), search, heatmaps, best of week                                                                                                                                           |
| `search`                | Global search and player discovery                                                                                                                                                                        |
| `shop`                  | Premium shop offers, bonus codes, tanki.su news (`/news`) scraping and enrichment                                                                                                                         |
| `social`                | Follows, feed, leagues, weekly challenges, signatures, wrapped                                                                                                                                            |
| `streamers`             | Streamer profiles, OBS overlays (data, SSE, preview), donation challenges, Twitch/DonationAlerts/VK integrations, Twitch auto-predictions (mod `battle_start` → Helix) and the Twitch panel feed          |
| `tactics`               | Tactic boards and their Hocuspocus collaboration                                                                                                                                                          |
| `tanks`                 | Tank pages and `/vehicles`: specs, armor, stats, trends, patches, tier list, top players                                                                                                                  |
| `telegram`              | Telegram bot, mini app, account linking, inline search, notification sending                                                                                                                              |
| `tournaments`           | Tournaments, registration, brackets                                                                                                                                                                       |
| `vk`                    | VK community bot (Bots Long Poll or Callback API via vk-io) with the shared commands; the Mini App signs in through the `vk-mini-app` auth plugin                                                         |
| `tree`                  | Tech tree per nation                                                                                                                                                                                      |

Server-side copy is Fluent .ftl through @grammyjs/i18n: the bot, notifications (notifications/config/locales) and streamer chat (streamers/config/locales) each load their files with createFluentStore from telegram/lib. Outside grammy they call i18n.t(locale, key, vars). Only the event → message-id mapping stays in TS.

## Module convention

`x.module.ts` + `x.controller.ts` (or `processors/` in the collector) + `services/`, plus the segments below as needed. One service per domain of work; nothing but the class in a service, processor or controller file — constants in `config/`, types in `*.types.ts`.

| Segment                                   | Holds                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `dto/`                                    | `createZodDto(...)` request/response classes                                                                          |
| `services/`                               | one service per domain of work                                                                                        |
| `processors/`, `schedules/`               | BullMQ workers and their job schedules (collector)                                                                    |
| `mappers/<name>/`                         | DB row / Prisma payload / Lesta payload → API DTO or view (every `to*View`, `to*Dto`, `toBattleData`-style converter) |
| `selects/<name>/`                         | Prisma `select` / `include` constants with their `GetPayload` types                                                   |
| `queries/<name>/`                         | standalone raw-SQL builders (`Prisma.sql` fragments)                                                                  |
| `lib/<concern>/`                          | pure domain logic only — rules, calculations, parsing                                                                 |
| `guards/`, `decorators/`, `interceptors/` | Nest enhancers, one folder each                                                                                       |
| `config/`                                 | `<concern>.constants.ts` / `*.config.ts`                                                                              |

Every item is its own folder with `index.ts` (+ `.types.ts`, `_tests/`), every segment has a barrel, and a file that mixes kinds is split (`tanks/lib/vehicle-sources` keeps `rewardMissions`; `tanks/mappers/vehicle-source-view` takes `toVehicleSourceView`). The names follow what large Nest codebases converge on — a feature module owning `dto/`, `services/`, guards/interceptors/decorators and a dedicated `mappers/` layer between persistence and DTOs ([Encore: NestJS project structure](https://encore.dev/articles/nestjs-project-structure-best-practices), [CatsMiaow/nestjs-project-structure](https://github.com/CatsMiaow/nestjs-project-structure)); `selects/` and `queries/` are this repo's names for Prisma's query shapes, since there is no repository layer. On the client the same converters live in a slice's `api/mappers/`, per FSD's `api` segment ([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)). Import across modules only through a module's `index.ts`. The full digest is [.claude/rules/code-style-server.md](../../.claude/rules/code-style-server.md).

## Collector

- **Queue contracts live once**, in `modules/collector/contracts`. Processors parse every payload with its schema; the API enqueues through `CollectorProducerService`.
- **Every processor wraps its work in `MetricsService.track({ job, run })`**, which counts the job and attributes the Lesta calls made inside it to the job's queue.
- **Lesta goes through `core/lesta`**: `priority` for tier A and the API, `bulk` for sweeps, sharing one Redis bucket (`LESTA_RPS`) with the bulk lane capped at `1 - LESTA.tierAReserve`. The breaker (`metrics/circuit-breaker.service.ts`, cockatiel `SamplingBreaker`) only observes outcomes; while it is open the sweep worker pauses and sweep batches are delayed.
- **Schedules** are `modules/collector/schedules/config`, on unless a schedule sets `enabled: false` (only `FEATURES.moePoliroid` does today) and off under `NODE_ENV=test`. Without `LESTA_APPLICATION_ID` (and with the mock off) the worker starts degraded: it logs a warning, loads no tracking or clan processors and registers no Lesta schedule. `realLestaOnly` schedules (the nightly encyclopedia sync, which would overwrite the imported game data) stay off while the mock is on. Every module registers its schedules through `createJobSchedules` (`common/schedules`) in Moscow time (`TIME.zone`); a scheduler whose id is no longer configured on its queue is removed on boot.
- **Lanes and retries**: each lane queues on its own in-process limiter queue (`LESTA.request` / `LESTA.bulk`) against the same Redis buckets, so a sweep backlog never overflows the priority lane; a full local queue throws `LestaQueueFullError`, which is retryable. The bulk lane retries once inside the client and leaves the rest to BullMQ's job backoff. Failed jobs are kept a week for post-mortems but capped by count, so an outage that fails every poll cannot grow Redis (noeviction) without bound.
- **Polling one account**: Lesta is read outside the database; the write phase (latest snapshots, new snapshots, deltas, `player_tank`, marks, the API day session, `mark.gained`) runs in `lockedTransaction` scoped `poll` per account, so enrol, poll and sweep never write the same battles twice. `tank_snapshot_latest` holds the last snapshot per tank and mode outside the hypertable, so retention never loses a tank's totals; it is the delta base and part of the overall rating.
- **API day sessions**: every write with deltas rebuilds `play_session {source: 'api', kind: 'day'}` for that Moscow day from the day's random-mode `tank_battle_delta` rows (idempotent upsert on `(account, source, kind, day)`); leagues, weekly challenges, the watchlist digest and the competition fallback read them.
- **Pool size**: the worker's pool is `WORKER_DATABASE.poolMax` (tracking jobs × accounts per job + the other queues + headroom); `DATABASE_POOL_MAX` overrides it per process.
- Data retention is a Lesta term: the purge jobs, the generic retention job (`RETENTION` in `purge/config`, batched deletes per table) and the Timescale policies (`config/timescale.constants.ts`) are not optional.

## Lesta API mock

Until the Lesta key exists, development runs against a generated Lesta API (`src/dev/lesta-mock`). No client-side mocks.

- **Switch**: `validateEnv` resolves `LESTA_MOCK` (`auto` default, `on`, `off`). The mock is on when `LESTA_APPLICATION_ID` is empty and `NODE_ENV` is `development` (or `LESTA_MOCK=on` outside production); it then sets `LESTA_APPLICATION_ID` to `LESTA_MOCK.applicationId`, so every `hasLesta` check passes. With a real key, or in production, it is off and nothing below runs.
- **Transport**: `main.ts` and `worker.ts` call `startLestaMock` before Nest boots. It loads the catalog from the database (vehicles with their HP, shells and crew, XVM expected values, modules, provisions, arenas, crew skills), builds the world and installs an MSW `setupServer` on `${API_URL}/dev/lesta/*`; `core/lesta` points both clients' `baseUrl` there. The real client, zod schemas, batching, retries, Redis rate limiter and collector run unchanged. Real `api.tanki.su/wot|wgn` calls are answered with a 503 and logged as errors; static images pass through.
- **Lesta ID**: the login redirect lands on `GET /dev/lesta/wot/auth/login/` (mounted by `main.ts`), a dev page to sign in as any generated player; the token it issues is accepted by `account/info` (`private`), `auth/prolongate` and `auth/logout`.
- **World** (`lib/world`, `lib/garage`, `lib/simulation`): seeded and deterministic — ~12k players (RU id range, creation 2010–2025, chronotypes, activity), ~260 clans with officers, academies, joins and leaves over time. Stats are derived from `(seed, account, time)`: a career aggregate at the anchor (2025-09-01) plus a per-battle simulation of every evening session since then, so snapshots, deltas, sessions, marks (EMA of combined damage), mastery (xp percentiles) and clan ELO keep moving. A per-player checkpoint LRU keeps requests cheap.
- **Endpoints**: every method in `lib/responses/dispatch.ts` (`MOCK_ROUTES`); anything else returns `METHOD_NOT_FOUND`. `fields`, `extra`, id-list limits and Lesta error codes behave like the real API.
- **Seed**: `bun run dev:seed` (`scripts/dev-seed.ts`) enrols a sample (top players, a random mix, some lapsed), replays 90 days through `runPollPipeline` with a simulated clock, syncs clans and their daily ELO snapshots, writes mod-style `Battle` rows (loadouts from the real provisions and shells, economy, MoE) through `toBattleData`, and runs the aggregate jobs. Rerunning skips accounts that already have history; `--reset` deletes the generated players and clans first.

## Prisma

The schema is split across `prisma/schema/`; the client is generated into `generated/` on `postinstall`. There are no Prisma migrations before production: `bun run db:push` runs `scripts/timescale.ts --extensions` (pg_trgm and timescaledb, which the trigram indexes need), `prisma db push`, `prisma generate` and then the whole Timescale layer (`bun run db:timescale`: `prisma/sql/timescale/*.sql` — hypertables, compression, continuous aggregates — plus the policies from `TIMESCALE`; every statement is idempotent). Hypertables carry no foreign keys — the purge deletes their rows explicitly. The continuous aggregate `tank_daily_stats` depends on `tank_battle_delta` columns, so a push that changes or drops them needs `DROP MATERIALIZED VIEW tank_daily_stats` first and `bun run db:timescale --refresh` after; its column list lives in `prisma/sql/timescale/003_continuous_aggregates.sql` and the `view TankDailyStats` block, which must match.

## Verification

```bash
bun run dev:server     # :4000 — curl localhost:4000/health, open /docs
bun run dev:worker     # logs "registered N of M job schedulers"
bun run test           # vitest; services are tested with vitest-mock-extended
```
