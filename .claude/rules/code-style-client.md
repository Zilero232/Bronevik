---
paths:
  - "apps/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/style.md; keep them in sync. -->

# Code style — client

Feature-Sliced Design with two local tweaks: `pages` → `views`, and the design
system at the root as `ui-kit`. Slices are grouped by business domain. Imports go
downward only: `app → views → widgets → features → entities → shared`; every
layer may import `@/ui-kit`.

## Public API

Import the slice (`@/features/search/command-palette`), never the domain group
(`@/features/search`) and never past the barrel. The design system has one root
barrel — `@/ui-kit`; primitives live in `atoms/`, `molecules/`, `organisms/`.

`model/` barrels live in subfolders (`model/hooks/index.ts`), never a slice-level
`model/index.ts`.

## Components only render

```text
<layer>/<domain>/<slice>/
  index.ts
  ui/
    <Main>.tsx .types.ts .module.scss     ← at most ONE flat main component
    <Other>/                              ← every further component gets a folder
      <Other>.tsx  <Other>.types.ts  <Other>.module.scss  index.ts
      [<Other>.motion.ts] [<Other>.variants.ts]
      components/  index.ts  <Sub>/…     ← nesting max 2 levels
  model/hooks/use-<x>/  use-<x>.ts  use-<x>.types.ts  index.ts  _tests/
  model/hooks/use-<x>-form/               ← react-hook-form + zodResolver
  model/context/
  lib/<concern>/  <concern>.ts  <concern>.types.ts  index.ts  _tests/
  config/  index.ts  <concern>.constants.ts
```

- A component folder holds only `Name.tsx`, `Name.types.ts`, `Name.module.scss`,
  `index.ts`, nested `components/` (plus `.motion.ts` / `.variants.ts` / `_tests/`).
  **Never** `*.helpers.ts`, `*.utils.ts`, `*.constants.ts`, `*.columns.tsx` or `hooks/`
  there. One component per folder and per file; no `ui/` root with two flat components.
- A `.tsx` may call `useTranslations`/`useFormatter`, navigation and context hooks,
  **one** model hook of its own and at most one trivial UI flag (`useBoolean` /
  a single `useState` for open or tab). Queries, mutations, effects,
  `useMemo`/`useCallback`/`useReducer`, timers, storage, clipboard and multi-statement
  or `async` handlers go to `model/hooks/use-<x>/`; forms to `use-<x>-form/`.
- Module-level constants → `config/<concern>.constants.ts`; helpers →
  `lib/<concern>/`. `ui-kit` has no segments: its helpers go to `shared/lib/<concern>/`,
  its hooks to `shared/lib/use-<x>/`; only a primitive's own `<Name>.constants.ts` may stay.
- Table columns: `model/hooks/use-<table>-columns/use-<table>-columns.tsx`; cells are
  components in `ui/components/<Table>/components/<X>Cell/`.

## No mocks

No mock data layer, fixture fallback or fake latency. Every request goes through
`fromServer` (`shared/api/source`); with no data a screen shows its empty state, with
the API down its error state with a retry.

## Server and browser are both real

Every page is rendered on the server first. A component that touches `window`
during render breaks the prerender, not just a test.

- **Guard browser APIs with `isBrowser()`/`isServer()` from `@/shared/lib`**,
  never a raw `typeof window` check, or read them inside `useEffect`.
- **A provider that wraps every page never swaps `children` for a placeholder.**
  Returning a splash instead ships an empty `<body>` to crawlers, and drops the
  page segment from rendering altogether — which is what Next 16 reports as
  "could not validate that a segment has instant navigation". `AppProviders`
  always renders its children.
- **A `useState` initialiser that reads browser state is a hydration mismatch.**
  Read it in an effect, or gate the value on `useHydrated()` from `@/shared/lib`
  the way `ThemeToggle` and `useRatingPatterns` do with the theme and
  `localStorage`.
- **Client-only modules stay out of barrels the server reads.**
  `shared/i18n/navigation` is client React and is imported by its own path,
  never re-exported from `@/shared/i18n`, which the root layout reads on the
  server.

## Locales live in the URL

Import `Link`, `useRouter` and `usePathname` from `@/shared/i18n/navigation`,
never from `next/*` — a raw `next/link` drops the user back to the default
locale. Server code reads the locale with `rootParams.locale()` from
`next/root-params`.

## A component body reads top to bottom

Hooks first, then the JSX. Every hook sits above the first `const` that is not
one, so the dependency order is the reading order. Handlers and derived values
come back from the component's model hook rather than being declared here.

```tsx
const t = useTranslations('search');
const { query, setQuery, results, total, isOpen, onOpenChange } = useCommandPaletteView();

return ( ... );
```

The same ordering applies inside a hook: hooks, then derived values, then handlers,
then the returned object.

React already forbids a conditional hook; this keeps them visually grouped too,
so a hook added later cannot drift below a branch by accident.

Two shapes legitimately sit between hooks and stay where they are:

- **A ref sync** — `onEventRef.current = onEvent;` between the `useRef` that
  holds it and the `useEffect` that reads it. It has to run on every render,
  before the effect, which is the whole point of the pattern.
- **A value a later hook consumes** — when the expression is only an argument,
  inline it into the hook call. When inlining it would be unreadable, leave the
  `const` where it is: the rule orders declarations, it does not ask you to
  hide a dependency.

## Shared feature state

Once more than two components read a feature's hook, put it behind a context —
`CommandPaletteProvider` + `useCommandPalette` is the shape. Threading
`ReturnType<typeof useX>` down as a prop leaks the hook's whole shape into every
signature below it.

## React Compiler

The compiler is on, so `useMemo`/`useCallback` are for semantic stability only.
`'use no memo'` opts out a component that holds a mutable library instance — the
TanStack Table components in `ui-kit/organisms/DataTable`. Nowhere else without
that reason. Generic hooks come from `@siberiacancode/reactuse` (`useBoolean`,
`useDebounceValue`, `useHotkeys`, `useLocalStorage`, `useInterval`).

## i18n

Everything user-visible goes through next-intl, in **both** languages: `shared/i18n/locales/{ru,en}/<namespace>.json`
(one file per top-level namespace; a new namespace needs a file in both folders and a line in both `index.ts`), always in sync. Shared Zod schemas come from
`@bronevik/schemas`, not inline.

## Theming and tokens

Tokens are CSS variables in `shared/styles/_tokens.scss`: theme-independent ones
on `:root`, the dark palette on `:root, [data-theme='dark']`, the light one on
`[data-theme='light']`. `next-themes` sets `data-theme` (dark by default, no
system detection). A colour token goes into both theme blocks in the same change;
components read tokens and carry no theme-specific code.

Rating colours: `ratingTone({ scale, value })` / `toneOfTier(tier)` from
`@/shared/lib` fold the nine `@bronevik/ratings` tiers into six tones (`bad`,
`below`, `average`, `good`, `great`, `unicum`). The component sets
`data-tone={tone}`; its SCSS uses `@include tone`, which resolves to
`--rating-<tone>`. Reuse that mapping rather than re-deriving one.

Fonts: Tektur (`--font-display`, headings and numbers), Onest (`--font-sans`),
IBM Plex Mono (`--font-mono`, HUD labels), self-hosted via `shared/config/fonts`.
Before re-declaring a look, check `shared/styles/_mixins.scss` — `plate`,
`hud-label`, `display`, `numeric`, `popup-surface`, `tone`, `tile-grid`.

## Variants

A primitive's variants are a `class-variance-authority` map over its module
classes in `<Name>.variants.ts` (`Button.variants.ts` → `buttonVariants`). The
styles stay in SCSS; `cva` only picks classes.

## Breakpoints

Nine steps in `shared/styles/_breakpoints.scss` — `xs` 420, `sm` 520, `md` 560,
`lg` 640, `wide` 700, `xl` 760, `2xl` 900, `3xl` 1100, `4xl` 1280 — used as
`@include below(md)` / `@include from(2xl)` and forwarded by
`shared/styles/mixins`. Never write a raw `@media (width <= 620px)`: add a step to
the map instead.

Rounding a `below()` up degrades early and is safe; rounding a `from()` up takes
a layout away from every viewport in between. `wide` exists for exactly that.

## Animation

`motion` is already a dependency and is the way to animate. Presets shared by
several components live in `shared/lib/motion`; one-off presets go in a sibling
`<Component>.motion.ts`. Do not hand-roll a CSS `transition` for something
motion is already driving.

**Never put `backdrop-filter` under an opaque background.** It composites and
blurs a layer nobody can see through, and a panel that also animates `scale`
then scales that rasterised layer — text arrives visibly soft for the first
frames. Menus, popovers and select lists all sit on `--color-surface-raised`
(`@include popup-surface`), which is opaque, so none of them carry one. The
overlays of `Dialog`, `Drawer` and the command palette, and the translucent
sticky header, are the exceptions and keep their blur: there the page behind
really does show through.

`will-change: transform` goes with that blur, not with the animation. Without a
filter to composite it only pins an extra layer, which is what rasterises the
text. Nothing in the client needs it today.

## Verification

`bun --filter @bronevik/client build` is the only check that catches SSR
breakage — typecheck passes on code that throws during prerender.

## Route prop types

Never hand-write `params`/`searchParams` types in `app/`. Use Next's generated globals (no import): `PageProps<'/[locale]/t/[slug]'>` for pages, metadata and `opengraph-image`; `Pick<PageProps<'…'>, 'params'>` for an inner component that only receives params; `LayoutProps<'…'>` for layouts; `RouteContext<'…'>` for route handlers. Route keys omit route groups. `bun run typecheck` runs `next typegen` first.
