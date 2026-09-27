<p align="center">
  <img src="apps/client/app/icon.svg" width="88" height="88" alt="Три отметки" />
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

Product scope: [docs/features.md](docs/features.md).

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
  client/          Next.js site (Feature-Sliced Design)
  server/          NestJS server app, one image with two entrypoints:
    src/main.ts      site API, developer API /v1, auth, mod ingest, bull-board
    src/worker.ts    collector worker: BullMQ jobs pulling the Lesta API
    prisma/          Prisma schema, Timescale SQL
    src/lib/         Lesta API client, replay parser, HTTP client, auth
  mod/             game-client mod (Python 2.7)
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
cp .env.example .env     # LESTA_APPLICATION_ID empty: the server serves a generated Lesta API (dev only)
bun run dev:infra        # TimescaleDB on :5434, Redis on :6380, Mailpit on :1025/:8025
bun run db:push
bun run gamedata:import  # vehicles, modules, equipment — the mock world is built on them
bun run dev:seed         # optional: 600 tracked players with 90 days of history, clans, mod battles, aggregates
bun run dev              # server :4000, worker, client :3000
```

The client has no mocks: it always talks to the API at `NEXT_PUBLIC_API_URL`. Without the server running, `bun run dev:client` still renders every page, with its empty or error states.

### Lesta API mock (until the key exists)

With `LESTA_APPLICATION_ID` empty and `NODE_ENV=development`, the server and the worker answer every Lesta call from a deterministic generated world: ~12k players with «Мир танков»-style nicknames, ~260 clans, skill, win rate and WN8 distributions that match XVM, per-tank stats derived from the real imported vehicles, and stats that keep advancing in real time (evening sessions, marks, mastery, clan changes, server online). The real Lesta client, schemas, rate limiter and collector run unchanged — MSW intercepts their HTTP. Lesta ID login opens a dev page where you sign in as any generated player. `LESTA_MOCK=auto|on|off` overrides the switch; setting the real key turns the mock off, and it never runs in production. Details: [apps/server/CLAUDE.md](apps/server/CLAUDE.md#lesta-api-mock).

`bun run dev:seed` (`--reset`, `--accounts N`, `--days N`, `--mod-players N`, `--mod-days N`) enrols a realistic sample of the generated players, backfills their snapshots through the collector's own poll pipeline, syncs their clans, writes mod-style battles with loadouts and economy, and runs the nightly aggregate jobs once. It is idempotent; `--reset` starts over.

## Commands

| Command                                                    | What                                                                                            |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `bun run dev` / `dev:client` / `dev:server` / `dev:worker` | Dev servers                                                                                     |
| `bun run dev:infra` / `dev:infra:down`                     | Local TimescaleDB + Redis + Mailpit                                                             |
| `bun run db:push` / `db:studio` / `db:timescale`           | Schema sync (`prisma db push`, no migrations before production), studio and the Timescale layer |
| `bun run gamedata:import`                                  | Import the game client's data into the database                                                 |
| `bun run dev:seed`                                         | Seed the local database from the Lesta mock (history, clans, mod battles, aggregates)           |
| `bun run verify`                                           | typecheck + lint + format:check + lint:css — what CI runs                                       |
| `bun run fix`                                              | Auto-fix lint, formatting, styles and the Prisma schema                                         |
| `bun run test`                                             | Vitest across the monorepo (never `bun test`)                                                   |
| `bun run test:e2e`                                         | Playwright smoke against the client                                                             |
| `bun run test:modpack`                                     | The game modpack's Python suites                                                                |
| `bun run lint:unused`                                      | knip — unused files, exports and dependencies                                                   |
| `bun run lint:dupes`                                       | jscpd — duplicated code                                                                         |
| `docker compose up -d --build`                             | Production-like stack: caddy, client, server, worker, db, redis                                 |

## Contributing

Conventional commits (enforced by commitlint). The pre-commit hook runs lint-staged and typechecks only the workspaces a commit touches. Code style: [docs/guides/style.md](docs/guides/style.md); architecture of the client: [docs/architecture/fsd.md](docs/architecture/fsd.md); agent guidance: [CLAUDE.md](CLAUDE.md).

© Три отметки. «Мир танков» and all related game content are the property of Lesta Games.
