# CLAUDE.md — apps/client

Guidance for the web client. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply.

**Next.js 16 / React 19**, App Router, `cacheComponents` and the React Compiler on, shipped as a Node server (`output: 'standalone'`, see [Dockerfile](Dockerfile)). Caddy sits in front of it in [docker-compose.yml](../../docker-compose.yml).

Architecture is **Feature-Sliced Design** with two local tweaks: `pages` → `views`, and the design system lives at the root as `ui-kit` rather than inside `shared`. Full rules: [docs/architecture/fsd.md](../../docs/architecture/fsd.md); code style: [docs/guides/style.md](../../docs/guides/style.md).

## Layer map

```text
app/          # Next.js routes — [locale]/(site)/… plus global-error and providers
views/        # whole screens per route: home, design, error, not-found
widgets/      # composable blocks shared by several views: site/site-header, site/site-footer
features/     # user interactions by domain: app/ (switch-locale, switch-theme, rating-patterns), search/ (command palette), stats/ (select-period)
entities/     # domain concepts: app/locale, player/player, tank/tank
shared/       # project-agnostic: api/ config/ constants/ i18n/ lib/ mocks/ seo/ styles/
ui-kit/       # the design system: atoms/ molecules/ organisms/ (charts, DataTable, toaster)
config/       # build-time helpers for next.config.ts — not imported by the app
```

Imports go downward only: `app → views → widgets → features → entities → shared`. `ui-kit` sits beside `shared` and every layer may import it. Alias `@/*` → `apps/client/*`.

## Conventions that bite

- **Public API**: import the slice (`@/features/search/command-palette`), never the domain group or past the barrel.
- **`ui-kit`** has one root barrel — `@/ui-kit`.
- **`model/` barrels** live in subfolders (`model/hooks/index.ts`), never a slice-level `model/index.ts`.
- **Shared Zod schemas** come from `@bronevik/schemas`, icons from `@bronevik/icons` (next to `lucide-react`).
- **Styling** is SCSS modules; tokens (`_tokens.scss`), breakpoints (`xs` … `4xl`) and mixins live in `shared/styles/`. `stylelint` runs on every `*.scss`. No CSS-in-JS; `class-variance-authority` only maps variant props to module classes (`Button.variants.ts`).
- **Two themes.** Dark (default) and light, switched by `next-themes` through `data-theme` on `<html>`. A colour token goes into both palettes in `_tokens.scss`; components read tokens and carry no theme code.
- **Tank renders** come from the Lesta API (`images` on `VehicleSummary`) and are shown only through `TankImage` from `@/entities/tank/tank` (`contour` / `small` / `big`, native size, class-glyph fallback, nation-flag backdrop on `big`). Never upscale a render past 160 px wide; `api.tanki.su/static/**` is the only allowed remote image host.
- **Rating colours** go through `ratingTone` / `toneOfTier` from `@/shared/lib` (nine `@bronevik/ratings` tiers → six tones) plus `data-tone` and `@include tone`. The display settings can swap the tones for the XVM scale (`data-rating-palette='xvm'` on `<html>`, overrides in `_tokens.scss`).
- **Fonts**: Tektur (display, numbers), Onest (body), IBM Plex Mono (HUD labels), self-hosted in `shared/config/fonts`.
- **`ui-kit`** wraps `@base-ui/react` primitives; charts are visx (`ChartKit`), the command palette is `cmdk`, `DataTable` is TanStack Table + Virtual and opts out of the React Compiler with `'use no memo'`. Generic hooks come from `@siberiacancode/reactuse`.

## Locales live in the URL

`/` is Russian, `/en` is English. The default locale carries no prefix (`localePrefix: 'as-needed'`), and `proxy.ts` — Next 16's name for middleware — negotiates from `Accept-Language` and rewrites.

- **Never import `Link`, `useRouter` or `usePathname` from `next/*`.** Use `@/shared/i18n/navigation`, which keeps the locale in every href.
- **`next/root-params` is how server code reads the locale** (`rootParams.locale()` in layouts, pages and `generateMetadata`).
- Every user-visible string goes through next-intl, in both `shared/i18n/locales/ru.json` and `en.json`.

## Data

- `shared/api` holds the axios instance and the TanStack Query client; hooks live in the slice that owns them (`views/home/model/hooks`, `features/search/command-palette/model/hooks`).
- `NEXT_PUBLIC_USE_MOCKS` (default `true`, see `shared/config/client-env.ts`) serves `shared/mocks` instead of the API. That is why the e2e smoke and `next build` need no running server. Production builds pass `false` (Dockerfile build arg).
- Env is read only through `@/shared/config` (`env`), which validates it with Zod. `next.config.ts` loads `NEXT_PUBLIC_*` from the root `.env` via `config/root-env.ts`.

## Lesta terms in the UI

Every page renders `SiteFooter`, which carries the Lesta copyright, the data-source link to tanki.su and the fan-project disclaimer ([docs/research/lesta-api.md](../../docs/research/lesta-api.md)). Don't add a layout that skips it; the e2e smoke checks it.

## Commands

```bash
bun run dev:client                      # next dev on :3000
bun --filter @bronevik/client build     # production build (standalone)
bun run test                            # vitest — client project runs in jsdom
bun run test:e2e                        # playwright smoke, root e2e/
```
