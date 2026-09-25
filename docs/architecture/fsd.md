# Feature-Sliced Design — Bronevik

The FSD methodology for `apps/client/`. This document is the working reference for the frontend architecture: the layer hierarchy, import rules, public APIs, segments.

Full specification: [feature-sliced.design](https://feature-sliced.design). Linter for FSD rules: [Steiger](https://github.com/feature-sliced/steiger).

> **Where this project departs from canonical FSD** (deliberately — reasons below):
>
> | Canonical FSD | Bronevik | Why |
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
├── shared/             # project-agnostic: api, config, constants, i18n, lib, mocks, seo, styles
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
├── app/        # cross-domain application concerns
│   ├── rating-patterns/   # colour-blind patterns on rating colours
│   ├── switch-locale/
│   └── switch-theme/
├── search/     # command-palette (cmdk, Ctrl+K and /)
└── stats/      # select-period
entities/
├── app/        # locale
├── player/     # player — PlayerCard, PlayerIdentity
└── tank/       # tank — TankCard, TankIdentity
widgets/
└── site/       # site-header, site-footer
```

`views/` does not group by domain — route screens sit directly in it: `views/home`, `views/design` (the living design-system page), `views/error`, `views/not-found`.

## 3. Public API

**Import the slice, never past its barrel and never the domain group:**

```ts
// yes
import { CommandPalette, CommandPaletteTrigger } from '@/features/search/command-palette';
import { PlayerCard } from '@/entities/player/player';
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
| `ui/` | components |
| `model/` | hooks, contexts, derived state, model types |
| `lib/` | pure functions, one folder per concern |
| `config/` | constants |
| `api/` | requests — but most requests live in `shared/api` |

A folder is one concern, not one function: each gets its own `index.ts`, `<name>.types.ts` and `<name>.constants.ts` where it needs them.

## 5. `ui-kit`

```text
ui-kit/
├── atoms/       # AnimatedNumber, Avatar, Badge, Burst, Button, IconButton, Input, Kbd,
│                # ProgressBar, ProgressRing, RatingBadge, Skeleton, Switch
├── molecules/   # Card, Dialog, Drawer, EmptyState, Popover, SectionHeader, SegmentedControl,
│                # Select, Sparkline, StatTile, Tabs, Tooltip
├── organisms/   # AppToaster, AreaChart, BarChart, ChartKit, DataTable, LineChart
└── index.ts     # the one barrel the rest of the app imports
```

**Each component gets its own PascalCase folder** with `Component.tsx`, `Component.module.scss`, and where it needs them `Component.types.ts` and `Component.variants.ts`, plus a barrel.

Headless primitives come from **`@base-ui/react`** — every molecule that needs behaviour wraps one rather than hand-rolling focus management. Variant maps use `class-variance-authority` over module classes (`Button.variants.ts`). Charts are built on **visx** through `ChartKit`; `DataTable` is **TanStack Table** + **TanStack Virtual**. Styles are SCSS modules; tokens live in `shared/styles/_tokens.scss`, with a dark and a light palette switched by `data-theme`.

From outside — only `@/ui-kit`. Inside it, imports between segments are relative (`../../atoms`).

## 6. The `app` layer

`app/` is Next.js routing and nothing else:

```text
app/
├── [locale]/              # every page lives under the locale segment
│   ├── (site)/            # the public site: header + main + footer
│   │   ├── page.tsx       # home
│   │   ├── design/        # the design-system page
│   │   ├── [...rest]/     # unknown paths → not-found inside the site shell
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── layout.tsx         # the root layout — html, fonts, providers
│   ├── error.tsx
│   └── not-found.tsx
├── providers/             # AppProviders: Query, next-intl, next-themes, motion, tooltips, palette
├── globals.scss           # pulls in the tokens and the base element styles
├── icon.svg
└── global-error.tsx
```

The route group `(site)` does not appear in the URL — it exists so the group can carry its own layout, which wraps its pages in `SiteHeader` and `SiteFooter`. The footer carries the Lesta attribution every page needs.

**The root layout must be inside `[locale]`.** `next/root-params` only reports a parameter that precedes the single root layout; an outer `app/layout.tsx` makes `rootParams.locale()` unresolvable.

## 7. Where a thing goes

| It is… | It goes in |
|---|---|
| a route | `app/[locale]/…/page.tsx`, thin — metadata plus one view |
| a whole screen | `views/<route>` |
| a block two views share | `widgets/<domain>/<slice>` |
| something the user does | `features/<domain>/<slice>` |
| a domain concept with its own data | `entities/<domain>/<slice>` |
| a request | `shared/api/<resource>` |
| a constant, helper or type with no domain | `shared/` |
| a visual primitive | `ui-kit/<segment>/<Component>` |

An example from live code: `views/home` assembles `HomePage` out of its own `ui/components` (`HomeHero`, `LiveCounters`, `TopPlayers`, `HotTanks`, `MarksShowcase`) and `model/hooks` (`useTopPlayers`, `useLiveCounters`). `TopPlayers` in turn takes `PlayerCard` from `entities/player/player`, `PeriodSwitcher` from `features/stats/select-period` and `SectionHeader` / `buttonVariants` from `ui-kit`. It reaches nothing sideways.

## 8. Tests

A test lives in a `_tests/` folder next to what it tests and covers pure logic and components with real behaviour:

```text
features/search/command-palette/lib/group-results/_tests/group-results.test.ts
shared/i18n/locale-path/_tests/locale-path.test.ts
shared/lib/rating-tone/_tests/rating-tone.test.ts
ui-kit/atoms/Button/_tests/Button.test.tsx
```

The runner is Vitest — `bun run test`, never bare `bun test`. End-to-end coverage of the public routes is Playwright, in the root `e2e/`.
