---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/react.md; keep them in sync. -->

# Code style — client: server and browser rendering

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
- **No clock or randomness during render.** With `cacheComponents` every Client
  Component is prerendered, and `Date.now()`, `new Date()` or `Math.random()` in
  render (next-intl's `useNow`, a `useState(() => new Date())`, date-fns
  `isToday`) fails it. Read the time through `useClientNow()` from
  `@/shared/lib` (`null` on the server, ticking with `updateInterval`) or
  `useCountdown({ seconds: (now) => … })`; randomness goes in handlers. A
  library that reads the clock while rendering (TanStack Table) sits behind a
  `<Suspense>` of its own, the way `DataTable` does.
- **A query already settled before hydration is a mismatch.** A hook whose
  result gates markup on every page (`useAuthSession`) reports pending until
  `useHydrated()`.
- **Metadata that reads `params` needs a dynamic page.** A page whose body is a
  client view with no `params` renders `<Suspense><RequestTime /></Suspense>`
  (`@/shared/seo/request-time`) next to it; the account pages under `/me`,
  gated client-side by `AccountShell`, export `instant = false`.
- **Client-only modules stay out of barrels the server reads.**
  `shared/i18n/navigation` is client React and is imported by its own path,
  never re-exported from `@/shared/i18n`, which the root layout reads on the
  server.

## Verification

`bun --filter @otmetki/client build` is the only check that catches SSR
breakage — typecheck passes on code that throws during prerender.
