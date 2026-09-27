# CLAUDE.md — apps/web/client

Guidance for the web client. Extends the root [../../../CLAUDE.md](../../../CLAUDE.md); those rules still apply.

**Next.js 16 / React 19**, App Router, `cacheComponents` and the React Compiler on, shipped as a Node server (`output: 'standalone'`, see [Dockerfile](Dockerfile)). Caddy sits in front of it in [docker-compose.yml](../../../docker-compose.yml).

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and the design system lives at the root as `ui-kit` rather than inside `shared`. Full rules: [docs/architecture/fsd.md](../../../docs/architecture/fsd.md); code style: [docs/guides/](../../../docs/guides/README.md).

## Layer map

```text
app/          # Next.js routes — [locale]/{(site),(overlay),(tma)}, api/og, opengraph-image.tsx per entity route,
              #   sitemap.ts, robots.ts, manifest.ts, sw.ts + serwist/[path] (service worker), twitch-panel/ (route
              #   handler for the Twitch extension), providers, global-error
views/        # one screen per route (86), e.g. home, player-profile, tank, tanks, marks, my-analytics, missions,
              #   mission-operation, best-battles, achievements, supertest, honest-rng, mod, legal, plus, streamer-studio
              #   — the full grouped list is in docs/architecture/fsd.md §2
widgets/      # account/account-shell, armor/armor-viewer, map/map-rotation, player/session-detail,
              #   showcase/showcase-3d, site/{resource-missing,site-footer,site-header}, social/social-shell, streamer/streamers-hub,
              #   tank/{tank-best-battles,tank-math}
features/     # app/{rating-palette,rating-patterns,switch-locale,switch-theme}, armor/armor-inspect, auth/lesta-link,
              #   community/{api-error,comments,contact-player,form-dialog,guide-meta,markdown,player-stats,replay-meta,
              #   report-content,stat-requirements,tactic-board-settings,tournament-status},
              #   notifications/{inbox-bell,notification-settings}, player/{toggle-favorite,watch-player}, plus/plus-gate,
              #   search/{command-palette,pick-entity}, stats/select-period, streamer/{apply-settings,claim-profile,follow-streamer},
              #   tank/{filter-vehicles,pick-tank}
entities/     # app/locale, armor/armor-model, auth/session, battle/best-battle, clan/clan, coaching/coach,
              #   competition/competition, developer/developer, event/calendar, guide/guide, map/map, mission/mission,
              #   mode/mode, notification/inbox, player/{analytics,cosmetics,leaderboard,marks,player,profile,recent-players,stats},
              #   plus/subscription, pulse/pulse, reference/game-status, replay/replay, search/search, social/challenge,
              #   streamer/{channel,overlay,preferences,settings,streamer}, tactic/board, tank/{build,tank,tree}, tournament/tournament
shared/       # project-agnostic: api/ (infrastructure only: http, generated, openapi, query-options, query-client, prefetch-state,
              #   source, auth client) config/ constants/ i18n/ lib/ seo/ (route-meta, require-route-entity, prefetch-boundary,
              #   site-metadata, sitemap, json-ld, og, request-time, route-guard) styles/
ui-kit/       # the design system: atoms/ molecules/ organisms/ (ChartKit + charts, DataTable, QueryState, PagedList,
              #   PageHeader, PageHero, toaster)
config/       # build-time helpers for next.config.ts (security headers / CSP, redirects, root env, panel script) — not imported by the app
```

Inside a slice: `index.ts`, `ui/`, `model/hooks/`, `model/context/<name>/` (context + `useX` consumer; the Provider is a `ui/` component fed by `model/hooks/use-<x>-state/`), `api/<resource>/` (+ `api/mappers/<name>/`), `lib/<concern>/`, `config/`. No runtime import cycles — `_tests/import-cycles.test.ts` (madge) guards it; rules in [client/structure/fsd-layers.md](../../../.claude/rules/client/structure/fsd-layers.md).

**Every thing is a folder.** A file with companions (`x.ts` + `x.types.ts` / `x.constants.ts` / `_tests/`) lives in its own `x/` with an `index.ts`; nothing lies flat next to another concern. `shared/lib` is flat, one folder per concern — helpers `shared/lib/<concern>/`, hooks `shared/lib/use-<x>/` — and `shared/constants` is `routes/`, `site-nav/`, `account-nav/`, `query-keys/`, `storage-keys/`. `ROUTES` is nested per page family (`ROUTES.tanks.detail(slug)`, `ROUTES.players.session({ nickname, sessionId })`, `ROUTES.account.overview`). Details: [fsd.md §4](../../../docs/architecture/fsd.md).

Imports go downward only: `app → views → widgets → features → entities → shared`. `ui-kit` sits beside `shared`: every layer may import it, and it may import `@/shared/*`. Alias `@/*` → `apps/web/client/*`.

## Conventions that bite

- **Public API**: import the slice (`@/features/search/command-palette`), never the domain group or past the barrel.
- **`ui-kit`** has one root barrel — `@/ui-kit`.
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **Components only render.** A component folder holds only `Name.tsx`, `Name.types.ts`, `Name.module.scss`, `index.ts` and nested `components/` (plus `.motion.ts` / `.variants.ts` if needed). State, effects, queries, handlers and derived data go to `model/hooks/use-<x>/use-<x>.ts` (+ `.types.ts`, `index.ts`), forms to `use-<x>-form/` (react-hook-form + zodResolver); pure helpers to `lib/<concern>/<concern>.ts` + `index.ts` + `_tests/`; constants to `config/<concern>.constants.ts`. Never `*.helpers.ts` / `*.utils.ts` / `*.constants.ts` inside a component folder. One component per folder; a `ui/` root is either one flat main component plus `components/`, or a folder per exported component — never a flat component beside sibling folders. Details: [guides/client/slice-ui.md §2](../../../docs/guides/client/slice-ui.md).
- **No clock in render.** `cacheComponents` prerenders Client Components, so the current time comes from `useClientNow()` / `useCountdown` in `@/shared/lib` (`null` until the browser renders), never `Date.now()`, `new Date()` or next-intl's `useNow` during render. Details: [client/rendering/ssr.md](../../../.claude/rules/client/rendering/ssr.md).
- **Contracts** come from `@otmetki/schemas` or the generated `z*` schemas in `shared/api/generated/zod.gen.ts` (re-exported by the slice `api/`); a form schema builds on them (`zCreateClanEvent.shape.title`) rather than retyping limits. Icons come from `@otmetki/icons` (next to `lucide-react`).
- **Styling** is SCSS modules; tokens (`_tokens.scss`), breakpoints (`xs` … `4xl`) and mixins live in `shared/styles/`. `stylelint` runs on every `*.scss`. No CSS-in-JS; `class-variance-authority` only maps variant props to module classes (`Button.variants.ts`).
- **Two themes.** Dark (default) and light, switched by `next-themes` through `data-theme` on `<html>`. A colour token goes into both palettes in `_tokens.scss`; components read tokens and carry no theme code.
- **Tank renders** come from the Lesta API (`images` on `VehicleSummary`) and are shown only through `TankImage` from `@/entities/tank/tank` (`contour` / `small` / `big`, native size, class-glyph fallback, nation-flag backdrop on `big`). Never upscale a render past 160 px wide; `api.tanki.su/static/**` is the only allowed remote image host.
- **Rating colours** go through `ratingTone` / `toneOfTier` from `@/shared/lib` (nine `@otmetki/ratings` tiers → six tones) plus `data-tone` and `@include tone`. The display settings can swap the tones for the XVM scale (`data-rating-palette='xvm'` on `<html>`, overrides in `_tokens.scss`).
- **Fonts**: Tektur (display, numbers), Onest (body), IBM Plex Mono (HUD labels), self-hosted in `shared/config/fonts`.
- **`ui-kit`** wraps `@base-ui/react` primitives; charts are visx (`ChartKit`), the command palette is `cmdk`, `DataTable` is TanStack Table + Virtual and opts out of the React Compiler with `'use no memo'` (as do the three.js / R3F viewers). Generic hooks come from `@siberiacancode/reactuse`.

## Locales live in the URL

`/` is Russian, `/en` is English. The default locale carries no prefix (`localePrefix: 'as-needed'`), and `proxy.ts` — Next 16's name for middleware — negotiates from `Accept-Language` and rewrites.

- **Never import `Link`, `useRouter` or `usePathname` from `next/*`.** Use `@/shared/i18n/navigation`, which keeps the locale in every href.
- **`next/root-params` is how server code reads the locale** (`rootParams.locale()` in layouts, pages and `generateMetadata`).
- Every user-visible string goes through next-intl, in both languages: `shared/i18n/locales/{ru,en}/<namespace>.json` (one file per namespace, same keys in both languages).

## Data

- **Requests live in their slice.** `shared/api` keeps only infrastructure (axios instance, bearer token, generated OpenAPI client + `query-options`, `fromServer`/`fromSdk`/`fromAuth` and the error classes, the better-auth client, `queryClient`). A read several slices need goes to `entities/<domain>/<slice>/api/<resource>/`, an action several slices trigger to `features/<domain>/<slice>/api/<resource>/`, anything one screen alone uses to `views/<view>/api/<resource>/`; the slice barrel re-exports it. Query keys stay in the shared `QUERY_KEYS` registry because invalidation crosses slices. Hooks live in the slice that owns them (`views/home/model/hooks`, `features/search/command-palette/model/hooks`).
- **No mocks.** Every request goes to the server through `fromServer` (`shared/api/source`), which turns a 404 into `NotFoundError` and a 401 into `UnauthorizedError`. With no data a screen shows its empty state; with the API down, its error state with a retry. Queries run in the browser, so `next build` and the e2e smoke need no running server.
- Env is read only through `@/shared/config` (`env`), which validates it with Zod. `next.config.ts` loads `NEXT_PUBLIC_*` from the root `.env` via `config/root-env.ts`; `NEXT_PUBLIC_APP_VERSION` comes from the root `package.json`, and the build arg `GIT_COMMIT_SHA` joins it in the service worker's precache revision.

### Loading, empty and error states

- **`QueryState`** (`@/ui-kit`) renders a query's skeleton, empty, error-with-retry and data states: `<QueryState query={q} skeleton={…} empty={…} isEmpty={…}>{(data) => …}</QueryState>`. Lists and sections use it rather than hand-rolled `isLoading` branches.
- **`ResourceGate`** (`@/widgets/site/resource-missing`) wraps `QueryState` for a page about one resource: a 404 from the API calls `notFound()` (or shows the `notFound` message when one is given), any other error shows `ResourceMissing` with a retry.
- **Tables** are `DataTable` from `@/ui-kit`; column definitions are typed `TableColumn<Row>` (= TanStack `ColumnDef<Row, any>`) and built in a `use-<x>-columns` hook. A column picker or CSV export belongs to the view that owns the table (e.g. `views/tanks`: `TableTools`, `lib/tanks-csv`).

### Server rendering: route meta and prefetch

Queries run in the browser; the server only renders metadata, 404s and a warm cache for the entity pages.

- **`server.ts` entries.** Server-only code of a slice is exported from its `server.ts` (`import 'server-only'`), never from `index.ts`: `entities/{tank/tank,clan/clan,player/profile,map/map,replay/replay,streamer/streamer}/server.ts` export the route lookups (`api/route-meta/`: `tankRouteEntity`, `topTankSlugs`, …) and OG sources; `views/{tank,tanks,player-profile,clan,map,marks,top,build,streamer}/server.ts` export the page's prefetch (`api/page-state/`: `tankPageState`, …).
- **Route meta.** `generateMetadata` and the page call `requireRouteEntity(xRouteEntity(slug))` (`@/shared/seo/require-route-entity`): a 404 from the API becomes `notFound()`, any other failure renders the page anyway (`routeEntity` in `shared/seo/route-meta`), so an API outage never turns into 404s. `generateStaticParams` and `app/sitemap.ts` use the `top*Slugs` / `*Slugs` helpers with a fallback. Metadata goes through `createPageMetadata` (canonical, hreflang alternates, OG image).
- **Prefetch pattern.** A page-state function is `'use cache'` + `cacheLife(PREFETCH_CACHE_LIFE)` and returns `prefetchState((client) => [client.fetchQuery(…)])` (dehydrated state from a fresh server `QueryClient`). The page renders `<Suspense><PrefetchBoundary state={xPageState(slug)}><XPage /></PrefetchBoundary></Suspense>`; `PrefetchBoundary` swallows a failed prefetch, so the browser simply fetches again.

### Service worker and security headers

- **Service worker** (Serwist, `app/sw.ts`, served from `app/serwist/[path]`): precache plus Serwist's `defaultCache` runtime rules wrapped in `sameOriginCaching` (`shared/lib/same-origin-caching`), so only same-origin requests are cached — API responses (another origin) always go to the network. It also shows web push notifications and focuses/opens the target URL on click.
- **CSP** is set in `next.config.ts` from `config/security-headers.ts`, without nonces (they would make every page dynamic under `cacheComponents`): `script-src 'self' 'unsafe-inline'`, `connect-src 'self'` + the API origin and its `ws(s)` origin, `frame-ancestors 'none'`. Per-route overrides: `/login` allows the Telegram widget, `/overlay/*` is frameable by the site, `/tg/*` by web.telegram.org, `/vk/*` by vk.com / vk.ru, `/twitch-panel` by Twitch. A new third-party script, frame or connection needs an entry there.

## Lesta terms in the UI

Every page renders `SiteFooter`, which carries the Lesta copyright, the data-source link to tanki.su and the fan-project disclaimer ([docs/research/data/lesta-api.md](../../../docs/research/data/lesta-api.md)). Don't add a layout that skips it; the e2e smoke checks it.

## Commands

```bash
bun run dev:client                      # next dev on :3000
bun --filter @otmetki/client build     # production build (standalone)
bun run test                            # vitest — client project runs in jsdom
bun run test:e2e                        # playwright smoke, root e2e/
```
