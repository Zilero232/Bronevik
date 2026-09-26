# Броневик — design spec

Date: 2026-09-24. Status: draft, awaiting approval.

Full feature list: [../../features.md](../../features.md).
Lesta API reference and terms: [../../research/lesta-api.md](../../research/lesta-api.md).
Market research: [../../research/market.md](../../research/market.md).

## 1. Goal

Build the all-in-one companion platform for «Мир танков» (Lesta, RU realm). It combines what is spread over 15+ sites (stats, marks of excellence, tank analytics, builds, replays, clans, streamer tools), fills the RU gaps the research found, and ships a public developer API. Quality bar: best-in-class UX, with a distinctive design and motion.

Everything is delivered in phases (§9). Each phase is a shippable product, not a stub.

## 2. Principles

1. **History is the moat.** Start collecting snapshots on day one. Lesta's API gives only the current state; past data cannot be backfilled.
2. **Our data beats proxied data.** Features built on derived data are where we win: recent periods, server tank stats, MoE history, mod telemetry. Plain Lesta API proxying is table stakes.
3. **Fair play only.** The mod never exposes enemy information. See the banned list in market.md. One ban wave would kill the brand.
4. **Comply with the Lesta terms.**
   - Required attribution footer on every page.
   - Login only via Lesta ID OpenID, never ask for credentials.
   - No ads while any paid feature exists.
   - Data retention policy.
   - Get written confirmation from Lesta before charging for anything built on API data.
5. **Reuse the house stack** (GnomeVPN/Chatovo template). No new tech without a reason written here.

## 3. Architecture

Bun workspaces monorepo, copied from GnomeVPN conventions (catalog versions, `@siberiacancode/*` lint configs, husky + commitlint, vitest + playwright, FSD on the client).

```
bronevik/
├─ apps/
│  ├─ client/     Next.js 16, React 19, SCSS modules, motion, next-intl (ru/en), TanStack Query
│  ├─ server/     NestJS 11 on Bun, one image, two processes:
│  │  ├─ src/main.ts      public site API + developer API /v1 + auth + billing + telegram bot + bull-board
│  │  ├─ src/worker.ts    the collector: BullMQ consumers, snapshot pipeline, aggregations (modules/collector)
│  │  ├─ src/lib/         lesta (typed thin client: batching, fields, rate limiting, retries), replay parser, http
│  │  ├─ src/modules/gamedata  game-client data importer (`bun run gamedata:import`)
│  │  └─ prisma/          Prisma 7 schema (multi-file, synced with db push), Timescale SQL; client generated into generated/
│  └─ mod/        (P3) Python 2.7 .wotmod companion, own build script
├─ packages/      only code shared between apps
│  ├─ ratings/       pure functions: WN8, EFF, Броня-Индекс, recent-period math, MoE projection
│  ├─ schemas/       zod schemas shared by client and server (+ OpenAPI generation)
│  ├─ gamedata/      pure loadout calculator + game-data model (server imports, client build constructor)
│  ├─ icons/         custom SVG icon set (tank classes, nations, tiers I–XI, marks, mastery, modes) as React components
│  ├─ sdk/           (P2) @bronevik/sdk, the public API client
│  └─ logger/        pino wrapper
├─ infra/  caddy, docker-compose{,.dev}.yml
└─ docs/
```

**Why the collector runs as its own process.** Collection is long-running and rate-limited. It has to scale separately from the request-serving API, and it must never block user requests. It shares the server's code (config, Prisma, Redis, queue contracts) but starts from `src/worker.ts` as a separate container from the same image. Unlike GnomeVPN, this needs **Redis** for BullMQ queues, the shared rate-limit token bucket and a hot cache.

**Database.** PostgreSQL 17 + **TimescaleDB** extension:
- hypertables for snapshots;
- native compression;
- continuous aggregates for the server tank stats;
- retention policies (Lesta terms).

Nickname search uses `pg_trgm`.

## 4. Data collection pipeline (collector)

Budget: 20 rps per IP × up to 5 IPs ≈ 100 rps. One global token bucket lives in Redis.

**Tier A — tracked accounts.** Anyone viewed, favourited, subscribed or bound to the mod.
- Poll `account/info` every 5–15 minutes. Subscribers get the faster interval.
- When `last_battle_time` changes, run `account/tanks` and then `tanks/stats` for the changed tanks.

**Tier B — active population.** Seeded from clan member lists and ratings/top, then grown organically.
- Daily sweep with `account/info` in batches of 100.
- Then `account/tanks` in batches of 100, diffed against the last snapshot to find tanks with new battles.
- Then `tanks/stats` only for those accounts and tanks.
- Estimate:
  - 2M accounts ≈ 20k info requests (≈ 4 min);
  - ~500k daily-active accounts ≈ 500k tanks/stats requests (≈ 1.5 h at 100 rps).

**Tier C — reference data.**
- Encyclopedia sync on patch detection (`encyclopedia/info` version) and nightly.
- Clans and global map hourly.
- WN8 expected values daily (XVM/tankist). Replaced by our own computation once we have enough data.

**Storage model.**
- `account_snapshot` holds cumulative totals per account per change.
- `tank_snapshot` holds cumulative per-tank totals per account, written **only when the battle count changed**.
- Recent-period stats are the difference between two cumulative snapshots.
- Continuous aggregates build `tank_daily_stats` (server-wide per tank per day per skill cohort). WR diff, tier lists and patch impact all read from it.

**Retention.**
- Raw per-account snapshots: configurable, 24 months by default. Daily rollups are kept longer.
- Deletion on request by the user or by Lesta: an account purge job.

Final numbers get agreed with Lesta when the limit increase is requested.

**Failure handling.**
- Exponential backoff on `REQUEST_LIMIT_EXCEEDED` and 5xx.
- A circuit breaker pauses Tier B while Lesta is degraded. Tier A keeps a small reserved budget.
- Collector lag metrics go to the admin panel.

## 5. Backend API (apps/server)

Modules follow the GnomeVPN layout:
- `auth`: better-auth + a custom Lesta OpenID provider, plus Telegram login and email magic link;
- `players`, `tanks`, `marks`, `ratings`, `clans`, `search`;
- `sessions`;
- `telegram` (grammy bot + Mini App auth);
- `billing` (YooKassa, P3);
- `developer` (API keys, usage metering, `/v1` controllers, webhooks, P2);
- `mod-ingest` (P3: signed battle-result ingestion);
- `admin`, `health`.

Read paths:
- Hot pages (profile, tank) are served from Redis cache (TTL tied to the snapshot time) plus Next.js ISR.
- A cache miss on a never-seen player triggers a synchronous fetch from Lesta and enrols the player in Tier A.

## 6. Frontend (apps/client)

FSD layout and ui-kit wrapping `@base-ui/react`, as in GnomeVPN.

Routes:
- `/p/[nick]`: profile, with tabs for overview, tanks, sessions, marks, charts and versus;
- `/t/[slug]`: tank page with server stats, MoE, top players, specs and builds;
- `/tanks`: server table and tier list;
- `/marks`: MoE thresholds;
- `/top`;
- `/c/[tag]`;
- `/compare`, `/tools/*` (calculators);
- `/developers`;
- `/overlay/[id]`: chromeless OBS pages.

Charts use **visx**. It gives full control for custom-styled animated charts; Recharts looks generic. A command palette (Ctrl+K) provides global search.

## 7. Design system

- **Mood.** "Armored steel at dusk".
  - Near-black graphite base with subtle brushed-metal gradients and a faint noise texture.
  - Warm "hot metal" orange accent (tracer) and cold steel-blue secondary.
  - Rating colours use the community scale (red → orange → yellow → green → blue → purple), with a colourblind-safe pattern mode.
  - Light theme exists but is secondary.
- **Type.** Condensed display face for numbers and headings, with tabular numerals everywhere stats are shown. Clean sans for body text. Exact faces are picked in P1 design task (candidates: Oswald / Rubik / Inter Tight, all with Cyrillic).
- **Icons.** Custom `packages/icons` set, stroke-matched to lucide so the two can be mixed:
  - tank classes, nations, tiers I–XI, MoE 1/2/3 stars, mastery badges, game modes;
  - animated variants for state changes.
- **Motion** (`motion` library, presets in `shared/lib/motion`):
  - number roll-up on stats;
  - chart line draw-in;
  - staggered table rows;
  - page transitions;
  - "scanner" skeletons;
  - celebratory burst for a new mark or personal record.
  All motion respects `prefers-reduced-motion`.
- **Shareable cards.** Server-rendered OG images (`next/og`) for profile, session, tank and mark, in the same visual language.

## 8. Mod companion (P3)

- Python 2.7 `.wotmod`, distributed via МОСТ and the site.
- Hooks only into the player's own battle results and own shots. Allowed categories only.
- Sends signed batches (HMAC per bound device) to `mod-ingest`.
- In-battle MoE percentage and "damage needed" readout, plus a hangar session panel.
- Account binding: a one-time code shown on the site.
- Payoff: exact MoE percentages, from which we compute our **own RU MoE thresholds with history**, plus economy, maps and builds data.

## 9. Phases

Each phase ends deployed to production.

- **P1 — "tomato.gg для МТ"** (foundation + core, the largest phase):
  - monorepo scaffold, CI, infra;
  - the Lesta client, collector tiers A/B/C, Timescale schema;
  - design system + icons;
  - search/command palette, profile with recent periods and charts, per-tank player table;
  - server tank table + WR diff + tier list;
  - MoE and mastery tables (community data at first);
  - leaderboards, OG cards;
  - Lesta ID login, favourites;
  - admin collector dashboard;
  - legal footer.
- **P2 — Knowledge & reach:**
  - tank encyclopedia, comparison, tech tree, build constructor (client files datamined), calculators;
  - clans (pages, activity, history);
  - versus;
  - Telegram bot + Mini App, PWA;
  - developer API v1 free tier + SDK.
- **P3 — Live & money:**
  - mod companion (sessions, MoE live, own thresholds);
  - streamer overlays + overlay constructor;
  - verifiable challenges (DonationAlerts);
  - Броневик Плюс subscription (YooKassa);
  - developer API paid tiers (after Lesta confirmation);
  - webhooks.
- **P4 — Community & content:**
  - replay upload and server parser, 2D battle player, heatmaps;
  - map pages and collaborative tactics board;
  - clan SaaS (attendance, calendar, recruiting funnel, Discord bot);
  - platoon finder, recruiting board;
  - event trackers (battle pass, front line, onslaught/ranked);
  - premium shop archive, bonus codes, drops, news aggregator.
- **P5 — Frontier:**
  - 3D armor viewer;
  - coaching marketplace, community tournaments, user guides;
  - VK bot;
  - en localisation marketing push.

## 10. Testing

- `packages/ratings` and the server's `lib/lesta`: unit tests with recorded API fixtures. Rating formulas are validated against known XVM values.
- Collector: integration tests against Postgres/Timescale + Redis in docker. The Lesta API is mocked with recorded responses.
- API: e2e per module (vitest + supertest).
- Web: component tests (vitest + Testing Library); Playwright for the critical flows (search → profile → tank page).
- `bun run verify` + `bun run test` gate CI, as in GnomeVPN.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Lesta changes API terms or limits, or revokes the key | Comply strictly, request a limit increase early with a caching description, keep the collector budget configurable |
| "Commercial distribution of API data" clause | Monetise only derived data and services; ask Lesta in writing before P3 |
| Mod breaks every patch | Minimal hook surface; CI smoke test against the latest client scripts; fast-release pipeline |
| Mod flagged as unfair | Allowed categories only; publish through МОСТ review |
| Storage growth | Timescale compression, change-only snapshots, retention policy |
| Scope (150 features) | Strict phases; each phase has its own implementation plan |

## 12. Open decisions (defaults chosen, change if needed)

- **Name:** «Броневик» / bronevik. Domain to be checked.
- **Charts:** visx.
- **Time series:** TimescaleDB rather than plain Postgres partitioning.
- **Queue:** BullMQ + Redis.
