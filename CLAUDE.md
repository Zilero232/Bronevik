# Броневик

All-in-one companion platform for «Мир танков» (Lesta, RU realm). Bun-workspaces monorepo.

- Product scope: [docs/features.md](docs/features.md)
- Architecture: [docs/superpowers/specs/2026-09-24-bronevik-design.md](docs/superpowers/specs/2026-09-24-bronevik-design.md)
- Lesta API reference and terms: [docs/research/lesta-api.md](docs/research/lesta-api.md)
- External library docs (context7 ids): [docs/references.md](docs/references.md)

Respond to the user in Russian. Code, comments, docs and commits are in English. UI text is in Russian and English via next-intl.

## Layout

| Path                | What                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/client`       | Next.js 16 / React 19 site, FSD (see [docs/architecture/fsd.md](docs/architecture/fsd.md)), SCSS modules, `motion`, visx charts, next-intl — [CLAUDE.md](apps/client/CLAUDE.md)                                                                                                                                                                                                                   |
| `apps/server`       | NestJS 11 on Bun, two entrypoints from one image: `src/main.ts` (site API, developer API `/v1`, auth, mod ingest) and `src/worker.ts` (the collector: BullMQ jobs that pull the Lesta API into TimescaleDB). Owns the Prisma schema (synced with `db push`, no migrations before production), the Lesta client, the replay parser and the game-data importer — [CLAUDE.md](apps/server/CLAUDE.md) |
| `apps/mod`          | Python 2.7 `.wotmod` game-client companion — [CLAUDE.md](apps/mod/CLAUDE.md)                                                                                                                                                                                                                                                                                                                      |
| `packages/ratings`  | Pure rating math: WN8, EFF, Броня-Индекс, rating tiers, recent periods, MoE projection                                                                                                                                                                                                                                                                                                            |
| `packages/schemas`  | Zod contracts shared by the client and the server                                                                                                                                                                                                                                                                                                                                                 |
| `packages/gamedata` | Pure loadout calculator (`calculateLoadout`) and the game-data model it reads; the importer lives in the server                                                                                                                                                                                                                                                                                   |
| `packages/icons`    | Custom SVG icon set as React components                                                                                                                                                                                                                                                                                                                                                           |
| `packages/logger`   | pino wrapper                                                                                                                                                                                                                                                                                                                                                                                      |
| `e2e/`              | Playwright smoke tests over the public pages                                                                                                                                                                                                                                                                                                                                                      |
| `infra/caddy/`      | Caddyfile for the prod-like [docker-compose.yml](docker-compose.yml) (no production deploy yet)                                                                                                                                                                                                                                                                                                   |

`packages/` holds only code shared between apps; anything a single app uses lives inside that app.

## Commands

```bash
bun install
bun run dev:infra      # TimescaleDB :5434, Redis :6380
bun run db:push        # prisma db push + the Timescale layer (no migrations before production)
bun run dev            # server :4000, worker (no port), client :3000
bun run verify         # typecheck + lint + format:check + lint:css
bun run test           # vitest (never `bun test`)
bun run test:e2e       # playwright smoke (starts the client dev server itself)
bun run test:mod       # python unittest suite of the game mod
bun run lint:unused    # knip — unused files, exports and dependencies
bun run lint:dupes     # jscpd — copy-pasted code
```

CI ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs `verify` + `test`, the mod's Python suite and the e2e smoke on every push and pull request.

## Rules

The full style guide is [docs/guides/style.md](docs/guides/style.md). Digests in `.claude/rules/` load automatically by path (tests: [.claude/rules/testing.md](.claude/rules/testing.md)). The key rules:

- **Packages before custom code.** Before building any non-trivial piece (replay parser, rate limiter, charts, drag-n-drop, canvas board, OG images, 3D, OpenAPI, SDK generation, bot framework…), search npm/PyPI/GitHub for a maintained package and use it. Write it yourself only when nothing fits, and say why in the commit.
- **Reuse over reinvention.** Before writing a helper, check what is already installed: remeda, ts-pattern, date-fns, zod, @siberiacancode/reactuse, TanStack Query / Table / Virtual, @base-ui/react, class-variance-authority, cmdk, visx, lucide-react + `@bronevik/icons`, sonner, motion, p-retry — and the workspace packages: `@bronevik/ratings` for rating math, `@bronevik/lesta-client` for every Lesta call, `@bronevik/schemas` for every contract. Forms use react-hook-form + `@hookform/resolvers/zod`, inside a `model/hooks/use-<x>-form/` hook.
- **Types and parameters.** Use `type`, never `interface`. A function with two or more parameters takes one object, whose shape goes in a sibling `*.types.ts`.
- **Constants.** Constants that belong together live in one `as const` object.
- **No comments in app code.** An `eslint-disable-next-line` carries its reason after `--`.
- **ESLint owns the shape.** Arrow functions use an expression body when they only return (`arrow-body-style: as-needed`); every `if`/`else` body has braces (`curly: all`); import order and blank lines are autofixed. `bun run fix` applies all of it.
- **i18n.** Every user-facing string goes through next-intl, in both languages: `shared/i18n/locales/{ru,en}/<namespace>.json` (one file per namespace, same keys in both languages).
- **Dependency versions.** Versions shared between workspaces live only in the root `catalog`.
- **Tests.** Tests go in `_tests/` next to the source.
- **Lesta terms are hard constraints** ([docs/research/lesta-api.md](docs/research/lesta-api.md)):
  - every page carries the attribution footer;
  - never ask for Lesta credentials, only use Lesta ID OpenID;
  - no ads;
  - honour data retention and deletion.
- **Fair play.** The mod never reads or shows enemy information beyond what the client shows: no positions, no reload timers, no aim data, no ally-spot markers. Allowed: own battle results, own shots, MoE %, session stats.
- **Git.** Never run git operations unless the user asks.
