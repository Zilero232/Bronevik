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
├── config/      # env.schema.ts (secrets, addresses, ports only) + *.constants.ts (every tunable), cors.ts (per-path CORS)
├── core/        # prisma (factory, timescale, error guards), redis, logger (nestjs-pino), queues (BullMQ connection), lesta (priority + bulk clients), storage (S3 / local-disk object storage), webhooks
├── common/      # exceptions, filters, decorators, cache, schedules (job schedulers), shared pure helpers in lib/
├── lib/         # lesta (Lesta API client), replay (.mtreplay parser, NOTICE), http (ky), auth (better-auth), scrape (robots-aware cheerio crawl, tanki.su listings)
└── modules/
prisma/          # base.prisma, schema/*.prisma, sql/timescale/ (no migrations before production — see Prisma)
scripts/         # timescale.ts (db:timescale, --extensions before db push), gamedata-import.ts, openapi-export.ts
generated/       # Prisma client (gitignored)
```

### Modules

A `*-worker.module.ts` next to a module is its half loaded by `WorkerModule` (processors and schedules); the rest is loaded by `AppModule`.

| Module                  | What it owns                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `auth`                  | better-auth wiring, Lesta ID OpenID and Telegram sign-in, linked Lesta and Telegram accounts                                            |
| `billing`               | Броневик Плюс: plans, YooKassa checkout and webhooks, promo codes, referrals, renewals (worker), entitlements                           |
| `builds`                | Loadout constructor under `/tanks/:id`: build options, loadout calculation, popular builds                                              |
| `clan-workspace`        | Clan officers' workspace: events and reminders, API attendance sync, recruit funnel, weekly officer report                              |
| `clans`                 | Clan pages, list and search, stronghold                                                                                                 |
| `collector`             | The worker: Lesta tracking, clans, reference, aggregates, news, purge; queue contracts, metrics, bull-board                             |
| `coaching`              | Coach profiles, coaching orders and their payments                                                                                      |
| `community-builds`      | Shared player builds                                                                                                                    |
| `community-core`        | Community accounts shared by the community modules                                                                                      |
| `community-maintenance` | Community worker: post expiry, pending coaching settlement                                                                              |
| `compare`               | Player-vs-player and tank-vs-tank comparison                                                                                            |
| `developer`             | Developer cabinet: API keys (`@better-auth/api-key`), public `/developer/plans`, webhooks (`standardwebhooks` signing, worker delivery) |
| `events`                | In-game events calendar and drops                                                                                                       |
| `gamedata`              | Game-client data importer, run by `bun run gamedata:import`                                                                             |
| `guides`                | Guides and comments                                                                                                                     |
| `health`                | `/health` (`@nestjs/terminus`): database, Redis, worker heartbeat, Lesta breaker                                                        |
| `leaderboards`          | Player and clan leaderboards                                                                                                            |
| `maps`                  | Maps from the arena data: detail, minimaps, team win rates                                                                              |
| `marks`                 | Marks of excellence tables, thresholds history, projections (and `/v1/moe`)                                                             |
| `me`                    | The signed-in user: favourites, goals, linked accounts, own marks, notification settings                                                |
| `mod`                   | Game mod ingest: device binding, signed event batches, event ledger                                                                     |
| `moderation`            | Content reports and their resolution                                                                                                    |
| `notifications`         | Notification routing and delivery (site, Telegram, e-mail, web push), inbox, digests, marks watch                                       |
| `players`               | Player pages: summary, tanks, marks, sessions, history, playtime, insights, achievements                                                |
| `platoons`              | Platoon board                                                                                                                           |
| `public-api`            | Public `/v1`: the v1 controllers, API-key guard, rate-limit headers, usage analytics; the only module in the `/v1` OpenAPI document     |
| `pulse`                 | Server activity pulse: hourly heatmap and sampled online series                                                                         |
| `recruiting`            | Clan recruiting board                                                                                                                   |
| `reference`             | Shared reference data: vehicle catalog, expected values, rating thresholds, Bronya references, current game version, server online      |
| `replays`               | Replay upload, parsing (worker), search, heatmaps, best of week                                                                         |
| `search`                | Global search and player discovery                                                                                                      |
| `shop`                  | Premium shop offers, bonus codes, tanki.su news (`/news`) scraping and enrichment                                                       |
| `social`                | Follows, feed, leagues, weekly challenges, signatures, wrapped                                                                          |
| `streamers`             | Streamer profiles, OBS overlays (data, SSE, preview), donation challenges, Twitch/DonationAlerts/VK integrations                        |
| `tactics`               | Tactic boards and their Hocuspocus collaboration                                                                                        |
| `tanks`                 | Tank pages and `/vehicles`: specs, armor, stats, trends, patches, tier list, top players                                                |
| `telegram`              | Telegram bot, mini app, account linking, inline search, notification sending                                                            |
| `tournaments`           | Tournaments, registration, brackets                                                                                                     |
| `tree`                  | Tech tree per nation                                                                                                                    |

Server-side copy is Fluent .ftl through @grammyjs/i18n: the bot, notifications (notifications/config/locales) and streamer chat (streamers/config/locales) each load their files with createFluentStore from telegram/lib. Outside grammy they call i18n.t(locale, key, vars). Only the event → message-id mapping stays in TS.

## Module convention

`x.module.ts` + `x.controller.ts` (or `processors/` in the collector) + `services/`, plus `dto/`, `lib/`, `config/` as needed. One service per domain of work; nothing but the class in a service, processor or controller file — constants in `config/`, pure functions in `lib/<concern>/`, types in `*.types.ts`. Import across modules only through a module's `index.ts`. The full digest is [.claude/rules/code-style-server.md](../../.claude/rules/code-style-server.md).

## Collector

- **Queue contracts live once**, in `modules/collector/contracts`. Processors parse every payload with its schema; the API enqueues through `CollectorProducerService`.
- **Every processor wraps its work in `MetricsService.track({ job, run })`**, which counts the job and attributes the Lesta calls made inside it to the job's queue.
- **Lesta goes through `core/lesta`**: `priority` for tier A and the API, `bulk` for sweeps, sharing one Redis bucket (`LESTA_RPS`) with the bulk lane capped at `1 - LESTA.tierAReserve`. The breaker (`metrics/circuit-breaker.service.ts`, cockatiel `SamplingBreaker`) only observes outcomes; while it is open the sweep worker pauses and sweep batches are delayed.
- **Schedules** are `modules/collector/schedules/config`, switched by `FEATURES` and off under `NODE_ENV=test`. Without `LESTA_APPLICATION_ID` the worker starts degraded: it logs a warning, loads no tracking or clan processors and registers no Lesta schedule.
- Data retention is a Lesta term: the purge jobs and the Timescale policies (`config/timescale.constants.ts`) are not optional.

## Prisma

The schema is split across `prisma/schema/`; the client is generated into `generated/` on `postinstall`. There are no Prisma migrations before production: `bun run db:push` runs `scripts/timescale.ts --extensions` (pg_trgm and timescaledb, which the trigram indexes need), `prisma db push`, `prisma generate` and then the whole Timescale layer (`bun run db:timescale`: `prisma/sql/timescale/*.sql` — hypertables, compression, continuous aggregates — plus the policies from `TIMESCALE`; every statement is idempotent). Hypertables carry no foreign keys — the purge deletes their rows explicitly.

## Verification

```bash
bun run dev:server     # :4000 — curl localhost:4000/health, open /docs
bun run dev:worker     # logs "registered N of M job schedulers"
bun run test           # vitest; services are tested with vitest-mock-extended
```
