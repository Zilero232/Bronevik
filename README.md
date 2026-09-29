<p align="center">
  <img src="apps/web/client/app/icon.svg" width="88" height="88" alt="Три отметки" />
</p>

<h1 align="center">Три отметки</h1>

<p align="center">
  <strong>The all-in-one companion platform for «Мир танков».</strong><br/>
  Player stats · Marks of excellence · Tank analytics · Clans · Replays · Game mod · Developer API
</p>

<p align="center">
  <img src="https://img.shields.io/badge/runtime-Bun-fbf0df?style=for-the-badge&logo=bun&logoColor=000" alt="Bun" />
  <img src="https://img.shields.io/badge/web-Next.js%2016-000?style=for-the-badge&logo=nextdotjs&logoColor=fff" alt="Next.js" />
  <img src="https://img.shields.io/badge/api-NestJS-e0234e?style=for-the-badge&logo=nestjs&logoColor=fff" alt="NestJS" />
  <img src="https://img.shields.io/badge/db-TimescaleDB-fdb515?style=for-the-badge&logo=timescale&logoColor=000" alt="TimescaleDB" />
  <img src="https://img.shields.io/badge/status-in%20development-f59e0b?style=for-the-badge" alt="Status" />
</p>

<br/>

## What is Три отметки?

A single site for everything a «Мир танков» (Lesta, RU realm) player looks up between battles: their own and anyone's statistics with WN8, EFF and our own Броня-Индекс, mark-of-excellence progress and projections, tank analytics and tier lists, clans, replays, streamer tools, and a public developer API. A companion game mod feeds the player's own battle results and MoE percentages straight from the client.

Три отметки is an independent fan project and is not affiliated with Lesta Games. Game data comes from the [Lesta API](https://developers.lesta.ru), under its terms: every page carries the attribution, game accounts are linked only through Lesta ID (sign-in also works with Telegram and the VK Mini App; Discord and VK ID can be linked), there are no ads, and the mod never reads anything beyond the player's own data.

Product scope: [docs/product/features.md](docs/product/features.md).

## Stack

| Layer    | Tech                                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Web      | Next.js 16, React 19, React Compiler, next-intl (ru/en), dark + light themes, TanStack Query & Table, visx, cmdk, Base UI, motion |
| API      | NestJS 11 on Bun, better-auth (Lesta ID, Telegram, VK Mini App), Zod contracts, Swagger                                           |
| Worker   | Second entrypoint of the server app: BullMQ jobs pulling the Lesta API, shared Redis rate limiter, cockatiel circuit breaker      |
| Data     | PostgreSQL 17 + TimescaleDB, Prisma 7, Redis                                                                                      |
| Game mod | Python 2.7 `.wotmod`, pure logic tested on Python 3                                                                               |
| Tooling  | Bun workspaces + catalog, ESLint, Prettier, Stylelint, Vitest, Playwright, knip, jscpd, Husky                                     |
| Infra    | One image per app (server and worker share one), Caddy, docker-compose — no production deploy yet                                 |

## Repository

```text
apps/
  web/
    client/          Next.js site (Feature-Sliced Design)
    server/          NestJS server app, one image with two entrypoints:
      src/main.ts      site API, developer API /v1, auth, mod ingest, bull-board
      src/worker.ts    collector worker: BullMQ jobs pulling the Lesta API
      prisma/          Prisma schema, Timescale SQL
      src/lib/         Lesta API client, replay parser, HTTP client, auth
  game/
    modpack/         game-client modpack (Python 2.7)
packages/          only code shared between apps
  ratings/         WN8, EFF, Броня-Индекс, MoE math
  schemas/         Zod contracts shared by client and server
  gamedata/        loadout calculator and the game-data model
  icons/           SVG icon set as React components
  logger/          shared pino config
  sdk/             public API client (@otmetki/sdk)
e2e/               Playwright smoke tests
infra/caddy/       Caddyfile for docker-compose.yml
docs/              architecture/, guides/, ops/ (deploy checklist), research/, references.md
```

## Getting started

Requires [Bun](https://bun.sh) ≥ 1.3, Docker, and Python 3 for the mod's tests.

```bash
bun install
cp .env.example .env     # LESTA_APPLICATION_ID empty: no Lesta, the worker runs degraded, pages show empty states
bun run dev:infra        # TimescaleDB on :5434, Redis on :6380, Mailpit on :1025/:8025
bun run db:push
bun run gamedata:import  # optional: vehicles, modules, equipment, maps from the public client-data repos (no Lesta key needed)
bun run dev              # server :4000 + client :3000 (no worker)
bun run dev:all          # + worker (collector jobs)
```

The client has no mocks: it always talks to the API at `NEXT_PUBLIC_API_URL`. Without the server running, `bun run dev:client` still renders every page, with its empty or error states.

### Without a Lesta key

There is no mock and no generated data anywhere. With `LESTA_APPLICATION_ID` empty the server boots, the worker starts degraded (no tracking, clan or other Lesta jobs), Lesta ID sign-in answers `lesta_not_connected`, and every page shows its empty state. `NEXT_PUBLIC_LESTA_NOTICE=true` (required, `true` or `false`, build time) adds the site-wide «data not connected yet» notice and disables the Lesta ID button. `bun run gamedata:import` still fills the vehicle catalog, maps and missions from the public client-data repositories.

### Dev server troubleshooting

`bun run dev` / `dev:all` restart a crashed server or client by themselves (`concurrently --restart-tries`); Ctrl+C still stops everything.

- **`next dev` slowly eats memory or stops answering.** Stop it, delete `apps/web/client/.next/dev`, start again. The dev-only settings live in [apps/web/client/config/dev-server.ts](apps/web/client/config/dev-server.ts) and are not used by `next build`:
  - **Turbopack's disk cache stays on.** Turbopack can only drop in-memory data it can reload from that cache, so with the cache off memory never shrinks.
  - **Memory eviction is `'full'`.**
  - **The React Compiler runs through the Rust port**, not Babel in about 16 Node child processes.
  - **Webpack loaders run in worker threads.**
  - **`reactDebugChannel` is off.** Next 16.3 holds each HTML request's React debug stream until that page's HMR socket connects. curl, `fetch`, Playwright and closed tabs never connect, so that memory is never freed.

  Measured with the same loop (20 routes + a locale/scss/ts edit every 2.5 s):

  | Setup  | Memory                                                                                                                  |
  | ------ | ----------------------------------------------------------------------------------------------------------------------- |
  | Before | Grew about 5 MB/s: 6.3 GB in the main process plus 2–3 GB in loader children after 7 min, never shrinking               |
  | After  | 22 min, 526 edits, 731 rounds: main process 3.2–4.0 GB from minute 5 on, loader workers under 0.7 GB, no failed request |

  `MaxListenersExceededWarning … SyncWriteStream` at startup comes from the worker threads and is harmless.

  As a backstop, `dev:client` caps the V8 heap at 6 GB (`NODE_OPTIONS=--max-old-space-size=6144`). Next restarts its own dev server when the heap passes 80 % of that cap. Without the cap, the limit is half of RAM (16 GB here), so the restart never came.

- **The API disappears.** Bun 1.3's `--watch` on Windows watches the whole working directory, and the old script ran from the repo root. It crashed (`EBUSY: Watcher crashed` → `panic: integer overflow` / segfault) when `.next`, `target/` or other build output churned, typically when `next dev` restarted. The restarted process then sometimes hit `EADDRINUSE` and stayed down. `dev:server` / `dev:worker` now run under `nodemon` ([apps/web/server/nodemon.json](apps/web/server/nodemon.json)), which watches only the server's `src`, `generated` and the workspace packages it imports, and stops the old process before starting a new one. After a real crash, nodemon waits for the next file change, or type `rs` + Enter.
- **Second `next dev` next to yours** (an agent checking something on another port): `.next/dev/lock` allows one dev server per dist dir, so start it with `NEXT_DIST_DIR=.next/probe` and a different `-p`.
- **Disk:** a stale Turbopack cache can reach tens of GB (`.next/dev/cache/turbopack`). Deleting `.next/dev` while the dev server is stopped is always safe.

## Commands

| Command                                                                                | What                                                                                            |
| -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `bun run dev` / `dev:all` / `dev:client` / `dev:server` / `dev:worker` / `dev:manager` | Dev servers                                                                                     |
| `bun run dev:infra` / `dev:infra:down`                                                 | Local TimescaleDB + Redis + Mailpit                                                             |
| `bun run db:push` / `db:studio` / `db:timescale`                                       | Schema sync (`prisma db push`, no migrations before production), studio and the Timescale layer |
| `bun run gamedata:import`                                                              | Import the game client's data into the database                                                 |
| `bun run verify`                                                                       | typecheck + lint + format:check + lint:css — what CI runs                                       |
| `bun run fix`                                                                          | Auto-fix lint, formatting, styles and the Prisma schema                                         |
| `bun run test`                                                                         | Vitest across the monorepo (never `bun test`)                                                   |
| `bun run test:e2e`                                                                     | Playwright smoke against the client                                                             |
| `bun run test:modpack`                                                                 | The game modpack's Python suites                                                                |
| `bun run lint:unused`                                                                  | knip — unused files, exports and dependencies                                                   |
| `bun run lint:dupes`                                                                   | jscpd — duplicated code                                                                         |
| `docker compose up -d --build`                                                         | Production-like stack: caddy, client, server, worker, db, redis                                 |

## Contributing

Conventional commits (enforced by commitlint). The pre-commit hook runs lint-staged and typechecks only the workspaces a commit touches. Code style: [docs/guides/](docs/guides/README.md); docs index: [docs/README.md](docs/README.md); architecture of the client: [docs/architecture/fsd.md](docs/architecture/fsd.md); agent guidance: [CLAUDE.md](CLAUDE.md).

© Три отметки. «Мир танков» and all related game content are the property of Lesta Games.
