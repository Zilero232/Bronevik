# Feature-Sliced Design — Three Marks

The FSD methodology for `apps/client/`. This document is the working reference for the frontend architecture: the layer hierarchy, import rules, public APIs, segments.

Full specification: [feature-sliced.design](https://feature-sliced.design). Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger).

> **Where this project departs from canonical FSD** (deliberately — reasons below):
>
> | Canonical FSD | Three Marks | Why |
> |---|---|---|
> | `src/` root | `apps/client/` root (no `src/`) | Monorepo: `apps/client` already isolates the frontend. `@/` → `apps/client/`. |
> | `pages/` layer | `views/` layer | `pages/` at the Next.js root turns on the Pages Router. `views/` sidesteps it. |
> | `shared/ui` segment | `ui-kit/` at the root | The design system is large enough to read as its own thing, and every layer imports it. Keeping it under `shared` buried it three levels down. |

## 1. Layers

```text
apps/client/
├── app/                # Next.js routes, providers, global styles entry
├── views/              # whole screens, one per route
├── widgets/            # blocks composed for more than one view
├── features/           # user interactions, grouped by domain
├── entities/           # domain concepts, grouped by domain
├── shared/             # project-agnostic: api, config, constants, i18n, lib, seo, styles
├── ui-kit/             # the design system: atoms, molecules, organisms
└── config/             # build-time helpers for next.config.ts — not imported by the app
```

**Imports go downward only:**

```text
app → views → widgets → features → entities → shared
```

`ui-kit` sits beside `shared`: every layer may import `@/ui-kit`, and `ui-kit` imports nothing above `shared`.

A layer never imports from itself across slices. Two features that need the same thing push it down to `entities` or `shared`.

## 2. Slices and domain groups

`features/`, `entities/` and `widgets/` group their slices by business domain:

```text
features/
├── app/            # rating-palette, rating-patterns, switch-locale, switch-theme
├── auth/           # lesta-link
├── notifications/  # inbox-bell
├── player/         # toggle-favorite
├── search/         # command-palette (cmdk, Ctrl+K and /), pick-entity
├── stats/          # select-period
└── tank/           # filter-vehicles, pick-tank
entities/
├── app/            # locale
├── armor/          # armor-model
├── auth/           # session
├── map/            # map
├── notification/   # inbox
├── player/         # player, profile, recent-players, stats
├── streamer/       # broadcast, overlay
└── tank/           # build, tank
widgets/
├── account/        # account-shell
├── player/         # session-detail
└── site/           # site-header, site-footer
```

`views/` does not group by domain — the 36 route screens sit directly in it:

| Area | Views |
|---|---|
| site shell | `home`, `design` (living design-system page), `error`, `not-found` |
| account | `login`, `me`, `billing`, `plus`, `notifications`, `telegram-link`, `telegram-login` |
| players | `players`, `player-profile`, `player-session`, `player-og`, `compare-players`, `top` |
| clans | `clan`, `clans` |
| tanks | `tank`, `tanks`, `compare-tanks`, `build`, `marks`, `tree`, `tools`, `play` |
| maps | `map`, `maps` |
| streamers | `streamer`, `streamers`, `streamer-studio`, `overlay` |
| developers | `developers`, `developer-cabinet` |
| Telegram Mini App | `mini-app` |

## 3. Public API

**Import the slice, never past its barrel and never the domain group:**

```ts
// yes
import { CommandPalette, CommandPaletteTrigger } from '@/features/search/command-palette';
import { PlayerIdentity } from '@/entities/player/player';
import { Button, RatingBadge } from '@/ui-kit';

// no — reaching past the barrel
import { PaletteInput } from '@/features/search/command-palette/ui/components/PaletteInput';

// no — the domain group is not a slice
import { CommandPalette } from '@/features/search';
```

Every slice has an `index.ts` that re-exports what the outside may use. Everything else is private to it.

`model/` barrels live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts` — a single barrel over the whole model layer says nothing about what is public.

`shared/i18n/navigation` is imported by its own path (`@/shared/i18n/navigation`), not through `@/shared/i18n`: it is client React, and the `@/shared/i18n` barrel is also read by the root layout on the server.

## 4. Segments

Inside a slice:

| Segment | Holds |
|---|---|
| `ui/` | components — render only |
| `model/` | `hooks/use-<x>/` (state, effects, queries, handlers, derived data; forms in `use-<x>-form/`), `context/`, model types |
| `api/` | the slice's requests: `api/<resource>/<resource>.ts` + `.types.ts` / `.constants.ts` + `index.ts`, one `api/index.ts` barrel; API → UI model converters in `api/mappers/<name>/` |
| `lib/` | pure domain logic, `lib/<concern>/<concern>.ts` + `index.ts` + `_tests/` |
| `config/` | constants, `config/<concern>.constants.ts` + `index.ts` |

These are the segments the FSD reference defines ([Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)): `api` is "backend interactions: request functions, data types, mappers", so a converter from a server DTO to what the UI draws lives in `api/mappers/`, not in `lib/`. Custom segment names describe purpose, never kind (`types/`, `helpers/`, `utils/` are not segments).

### Where requests live

`shared/api` is infrastructure only: the axios instance and bearer token (`http/`), the generated OpenAPI client and its query-option re-exports (`generated/`, `query-options/`), `fromServer` / `fromSdk` / `fromAuth` and the error classes (`source/`), the better-auth client base (`auth/`) and `queryClient`. Every domain request lives in the slice that owns it:

- **A read that several slices need → `entities/<domain>/<slice>/api/`.** `getTank`, `listTankStats`, `getPlayer`, `listMaps`, `getGuide`… The entity's `index.ts` re-exports them; `entities/search/search`, `entities/pulse/pulse`, `entities/tank/tree`, `entities/player/leaderboard` exist for exactly this.
- **An action several slices trigger → `features/<domain>/<slice>/api/`.** Favourites in `features/player/toggle-favorite`, the watchlist in `features/player/watch-player`, notification settings in `features/notifications/notification-settings`, comments, reports.
- **Anything one screen alone uses → `views/<view>/api/`.** A mutation only the tournament page runs (`openTournament`, `reportTournamentMatch`) sits next to that page, importing the request types from its entity.

Layer rules still hold: an entity never imports another entity, so two entities that need each other's data are composed one layer up. A split action module imports its types from the entity's public API (`@/entities/guide/guide`), never from a sibling slice. Query keys stay in the shared registry `QUERY_KEYS` (`shared/constants/query-keys`): invalidation crosses slices (`QUERY_KEYS.me.all` is cleared by a dozen features), and a registry below every layer is the one place all of them may import.

### Every thing is a folder

A file that has companions — `x.ts` with `x.types.ts`, `x.constants.ts`, `x.schemas.ts`, `_tests/` — lives in its own `x/` folder with an `index.ts`. Nothing lies flat next to another concern: a folder holds its own concern's files plus subfolders, and a second concern gets a second folder (`shared/api/http/` holds `http.ts` + `http.constants.ts` and the subfolders `bearer-token/`, `client-config/`, `list-param/`). The one flat exception is `config/`, which is one `<concern>.constants.ts` per concern until a concern grows a companion.

`shared/lib/` is flat, one folder per concern, the same layout GnomeVPN and Chatovo use: pure helpers as `shared/lib/<concern>/`, hooks as `shared/lib/use-<x>/` (`use-hydrated`, `use-reveal-once`, `use-client-now`). The `use-` prefix is what separates the two; there is no `hooks/` or `utils/` grouping folder. `shared/constants/` is the same — `routes/`, `site-nav/`, `account-nav/`, `query-keys/`, `storage-keys/`, each with its `index.ts`.

`ROUTES` is nested by page family: `ROUTES.players.{list, profile(nick), session({ nickname, sessionId }), compare}`, `ROUTES.tanks.{list, detail, armor, compare}`, `ROUTES.guides.{list, detail, create, edit}`, `ROUTES.streamers.{list, profile, claim, overlay, forStreamers, settings.{table, compare, profile}}`, `ROUTES.auth.{login, telegram}`, `ROUTES.account.{overview, …}`, `ROUTES.api.playerCard`, `ROUTES.sw`. Single pages stay flat (`ROUTES.top`, `ROUTES.tree`).

A component folder holds only `Name.tsx`, `Name.types.ts`, `Name.module.scss`, `index.ts` and nested `components/` (plus `.motion.ts` / `.variants.ts`); never `*.helpers.ts`, `*.utils.ts`, `*.constants.ts` or `hooks/`. One component per folder, and a `ui/` root holds at most one flat component. Full rules: [style.md §2](../guides/style.md).

## 5. `ui-kit`

```text
ui-kit/
├── atoms/       # AnimatedNumber, Avatar, Badge, Button, ClassIcon, DeltaValue, IconButton, Input, Kbd,
│                # NationLabel, ProgressBar, ProgressRing, RatingBadge, RelativeTime, Skeleton, Switch,
│                # TankImage, TierNumeral
├── molecules/   # Card, CodeBlock, CopyField, DataSourceNote, Dialog, Drawer, EmptyState, ErrorState,
│                # GameVersionBadge, KeyFigure, KeyFigures, NumberField, Popover, RangeSlider, RetryButton,
│                # SectionHeader, SegmentedControl, Select, ServiceStatus, Sparkline, Tabs, ToggleChips, Tooltip
├── organisms/   # AppToaster, AreaChart, BarChart, CalendarHeatmap, ChartKit, DataTable, LineChart, PageHeader
└── index.ts     # the one barrel the rest of the app imports
```

**Each component gets its own PascalCase folder** with `Component.tsx`, `Component.module.scss`, and where it needs them `Component.types.ts`, `Component.variants.ts`, `Component.motion.ts` and `Component.constants.ts`, plus a barrel. `ui-kit` has no slice segments: a primitive's helpers go to `shared/lib/<concern>/` and its hooks to `shared/lib/use-<x>/`, never `Component.helpers.ts` or a `hooks/` folder.

Headless primitives come from **`@base-ui/react`** — every molecule that needs behaviour wraps one rather than hand-rolling focus management. Variant maps use `class-variance-authority` over module classes (`Button.variants.ts`). Charts are built on **visx** through `ChartKit`; `DataTable` is **TanStack Table** + **TanStack Virtual**. Styles are SCSS modules; tokens live in `shared/styles/_tokens.scss`, with a dark and a light palette switched by `data-theme`.

From outside — only `@/ui-kit`. Inside it, imports between segments are relative (`../../atoms`).

## 6. The `app` layer

`app/` is Next.js routing and nothing else:

```text
app/
├── [locale]/              # every page lives under the locale segment
│   ├── (site)/            # the public site: header + main + footer
│   │   ├── page.tsx       # home
│   │   ├── p/ c/ t/ s/    # player, clan, tank, streamer pages
│   │   ├── builds/ clans/ compare/ design/ developers/ login/ maps/ marks/
│   │   ├── me/ play/ players/ plus/ streamers/ tanks/ tools/ top/ tree/
│   │   ├── [...rest]/     # unknown paths → not-found inside the site shell
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── (overlay)/overlay/ # stream overlays, no site shell
│   ├── (tma)/tg/          # Telegram Mini App
│   ├── layout.tsx         # the root layout — html, fonts, providers
│   ├── error.tsx
│   └── not-found.tsx
├── api/og/                # OG image routes
├── serwist/               # service worker route (sw.ts source)
├── providers/             # AppProviders: Query, next-intl, next-themes, motion, tooltips, palette
├── globals.scss           # pulls in the tokens and the base element styles
├── manifest.ts, icon.svg
└── global-error.tsx
```

Route groups do not appear in the URL. `(site)` carries the layout that wraps its pages in `SiteHeader` and `SiteFooter`; the footer carries the Lesta attribution every site page needs. `(overlay)` and `(tma)` have their own layouts for OBS overlays and the Telegram Mini App.

**The root layout must be inside `[locale]`.** `next/root-params` only reports a parameter that precedes the single root layout; an outer `app/layout.tsx` makes `rootParams.locale()` unresolvable.

## 7. Where a thing goes

| It is… | It goes in |
|---|---|
| a route | `app/[locale]/…/page.tsx`, thin — metadata plus one view |
| a whole screen | `views/<route>` |
| a block two views share | `widgets/<domain>/<slice>` |
| something the user does | `features/<domain>/<slice>` |
| a domain concept with its own data | `entities/<domain>/<slice>` |
| a read several slices need | `entities/<domain>/<slice>/api/<resource>/` |
| an action several slices trigger | `features/<domain>/<slice>/api/<resource>/` |
| a request one screen alone uses | `views/<view>/api/<resource>/` |
| an API → UI model converter | `<slice>/api/mappers/<name>/` |
| HTTP / generated client / error infrastructure | `shared/api/` |
| a constant, helper or type with no domain | `shared/` |
| a visual primitive | `ui-kit/<segment>/<Component>` |
| a hook with state, effects, queries or handlers | `<slice>/model/hooks/use-<x>/` |
| a pure helper | `<slice>/lib/<concern>/` |
| a constant | `<slice>/config/<concern>.constants.ts` |

An example from live code: `views/home` assembles `HomePage` out of its own `ui/components` (`HomeHero`, `LiveCounters`, `TopPlayers`, `HotTanks`, `MarksShowcase`) and `model/hooks` (`useTopPlayers`, `useLiveCounters`). `TopPlayers` in turn takes `PlayerIdentity` from `entities/player/player`, `PeriodSwitcher` from `features/stats/select-period` and `SectionHeader` / `buttonVariants` from `ui-kit`. It reaches nothing sideways.

## 8. Tests

A test lives in a `_tests/` folder next to what it tests and covers pure logic and components with real behaviour:

```text
features/search/command-palette/lib/group-results/_tests/group-results.test.ts
shared/i18n/locale-path/_tests/locale-path.test.ts
shared/lib/rating-tone/_tests/rating-tone.test.ts
ui-kit/atoms/Button/_tests/Button.test.tsx
```

The runner is Vitest — `bun run test`, never bare `bun test`. End-to-end coverage of the public routes is Playwright, in the root `e2e/`.
