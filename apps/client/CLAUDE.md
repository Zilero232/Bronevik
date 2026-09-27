# CLAUDE.md — apps/client

Guidance for the web client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**Next.js 16 / React 19**, App Router, `cacheComponents` and the React Compiler on, shipped as a Node server (`output: 'standalone'`, see [Dockerfile](Dockerfile)). Caddy sits in front of it in [docker-compose.yml](../../docker-compose.yml).

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and the design system lives at the root as `ui-kit` rather than inside `shared`. Full rules: [docs/architecture/fsd.md](../../docs/architecture/fsd.md); code style: [docs/guides/style.md](../../docs/guides/style.md).

## Layer map

```text
app/          # Next.js routes — [locale]/{(site),(overlay),(tma)}, api/og, serwist, providers, global-error
views/        # one screen per route (36): home, design, error, not-found, login, me, billing, plus,
              #   notifications, players, player-profile, player-session, player-og, compare-players, top,
              #   clan, clans, tank, tanks, compare-tanks, build, marks, tree, map, maps, play, tools,
              #   streamer, for-streamers, streamer-studio, overlay, developers, developer-cabinet,
              #   mini-app, telegram-link, telegram-login
widgets/      # account/account-shell, player/session-detail, site/{site-header,site-footer}
features/     # app/{rating-palette,rating-patterns,switch-locale,switch-theme}, auth/lesta-link,
              #   notifications/inbox-bell, player/toggle-favorite, search/{command-palette,pick-entity},
              #   stats/select-period, tank/{filter-vehicles,pick-tank}
entities/     # app/locale, armor/armor-model, auth/session, map/map, notification/inbox,
              #   player/{player,profile,recent-players,stats}, streamer/{broadcast,overlay}, tank/{build,tank}
shared/       # project-agnostic: api/ (infrastructure only: http, generated, query-options, source, auth client) config/ constants/ i18n/ lib/ seo/ styles/
ui-kit/       # the design system: atoms/ molecules/ organisms/ (ChartKit + charts, DataTable, PageHeader, toaster)
config/       # build-time helpers for next.config.ts — not imported by the app
```

Inside a slice: `index.ts`, `ui/`, `model/hooks/`, `model/context/`, `api/<resource>/` (+ `api/mappers/<name>/`), `lib/<concern>/`, `config/`.

**Every thing is a folder.** A file with companions (`x.ts` + `x.types.ts` / `x.constants.ts` / `_tests/`) lives in its own `x/` with an `index.ts`; nothing lies flat next to another concern. `shared/lib` is flat, one folder per concern — helpers `shared/lib/<concern>/`, hooks `shared/lib/use-<x>/` — and `shared/constants` is `routes/`, `site-nav/`, `account-nav/`, `query-keys/`, `storage-keys/`. `ROUTES` is nested per page family (`ROUTES.tanks.detail(slug)`, `ROUTES.players.session({ nickname, sessionId })`, `ROUTES.account.overview`). Details: [fsd.md §4](../../docs/architecture/fsd.md).

Imports go downward only: `app → views → widgets → features → entities → shared`. `ui-kit` sits beside `shared` and every layer may import it. Alias `@/*` → `apps/client/*`.

## Conventions that bite

- **Public API**: import the slice (`@/features/search/command-palette`), never the domain group or past the barrel.
- **`ui-kit`** has one root barrel — `@/ui-kit`.
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **Components only render.** A component folder holds only `Name.tsx`, `Name.types.ts`, `Name.module.scss`, `index.ts` and nested `components/` (plus `.motion.ts` / `.variants.ts` if needed). State, effects, queries, handlers and derived data go to `model/hooks/use-<x>/use-<x>.ts` (+ `.types.ts`, `index.ts`), forms to `use-<x>-form/` (react-hook-form + zodResolver); pure helpers to `lib/<concern>/<concern>.ts` + `index.ts` + `_tests/`; constants to `config/<concern>.constants.ts`. Never `*.helpers.ts` / `*.utils.ts` / `*.constants.ts` inside a component folder. One component per folder; a `ui/` root has at most one flat component. Details: [style.md §2](../../docs/guides/style.md).
- **No clock in render.** `cacheComponents` prerenders Client Components, so the current time comes from `useClientNow()` / `useCountdown` in `@/shared/lib` (`null` until the browser renders), never `Date.now()`, `new Date()` or next-intl's `useNow` during render. Details: [code-style-client.md](../../.claude/rules/code-style-client.md).
- **Shared Zod schemas** come from `@otmetki/schemas`, icons from `@otmetki/icons` (next to `lucide-react`).
- **Styling** is SCSS modules; tokens (`_tokens.scss`), breakpoints (`xs` … `4xl`) and mixins live in `shared/styles/`. `stylelint` runs on every `*.scss`. No CSS-in-JS; `class-variance-authority` only maps variant props to module classes (`Button.variants.ts`).
- **Two themes.** Dark (default) and light, switched by `next-themes` through `data-theme` on `<html>`. A colour token goes into both palettes in `_tokens.scss`; components read tokens and carry no theme code.
- **Tank renders** come from the Lesta API (`images` on `VehicleSummary`) and are shown only through `TankImage` from `@/entities/tank/tank` (`contour` / `small` / `big`, native size, class-glyph fallback, nation-flag backdrop on `big`). Never upscale a render past 160 px wide; `api.tanki.su/static/**` is the only allowed remote image host.
- **Rating colours** go through `ratingTone` / `toneOfTier` from `@/shared/lib` (nine `@otmetki/ratings` tiers → six tones) plus `data-tone` and `@include tone`. The display settings can swap the tones for the XVM scale (`data-rating-palette='xvm'` on `<html>`, overrides in `_tokens.scss`).
- **Fonts**: Tektur (display, numbers), Onest (body), IBM Plex Mono (HUD labels), self-hosted in `shared/config/fonts`.
- **`ui-kit`** wraps `@base-ui/react` primitives; charts are visx (`ChartKit`), the command palette is `cmdk`, `DataTable` is TanStack Table + Virtual and opts out of the React Compiler with `'use no memo'`. Generic hooks come from `@siberiacancode/reactuse`.

## Locales live in the URL

`/` is Russian, `/en` is English. The default locale carries no prefix (`localePrefix: 'as-needed'`), and `proxy.ts` — Next 16's name for middleware — negotiates from `Accept-Language` and rewrites.

- **Never import `Link`, `useRouter` or `usePathname` from `next/*`.** Use `@/shared/i18n/navigation`, which keeps the locale in every href.
- **`next/root-params` is how server code reads the locale** (`rootParams.locale()` in layouts, pages and `generateMetadata`).
- Every user-visible string goes through next-intl, in both languages: `shared/i18n/locales/{ru,en}/<namespace>.json` (one file per namespace, same keys in both languages).

## Data

- **Requests live in their slice.** `shared/api` keeps only infrastructure (axios instance, bearer token, generated OpenAPI client + `query-options`, `fromServer`/`fromSdk`/`fromAuth` and the error classes, the better-auth client, `queryClient`). A read several slices need goes to `entities/<domain>/<slice>/api/<resource>/`, an action several slices trigger to `features/<domain>/<slice>/api/<resource>/`, anything one screen alone uses to `views/<view>/api/<resource>/`; the slice barrel re-exports it. Query keys stay in the shared `QUERY_KEYS` registry because invalidation crosses slices. Hooks live in the slice that owns them (`views/home/model/hooks`, `features/search/command-palette/model/hooks`).
- **No mocks.** Every request goes to the server through `fromServer` (`shared/api/source`), which turns a 404 into `NotFoundError` and a 401 into `UnauthorizedError`. With no data a screen shows its empty state; with the API down, its error state with a retry. Queries run in the browser, so `next build` and the e2e smoke need no running server.
- Env is read only through `@/shared/config` (`env`), which validates it with Zod. `next.config.ts` loads `NEXT_PUBLIC_*` from the root `.env` via `config/root-env.ts`.

## Lesta terms in the UI

Every page renders `SiteFooter`, which carries the Lesta copyright, the data-source link to tanki.su and the fan-project disclaimer ([docs/research/lesta-api.md](../../docs/research/lesta-api.md)). Don't add a layout that skips it; the e2e smoke checks it.

## Commands

```bash
bun run dev:client                      # next dev on :3000
bun --filter @otmetki/client build     # production build (standalone)
bun run test                            # vitest — client project runs in jsdom
bun run test:e2e                        # playwright smoke, root e2e/
```
