---
paths:
  - "apps/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/architecture/fsd.md; keep them in sync. -->

# Code style — client: FSD layers and public API

Feature-Sliced Design with two local tweaks: `pages` → `views`, and the design
system at the root as `ui-kit`. Slices are grouped by business domain. Imports go
downward only: `app → views → widgets → features → entities → shared`; every
layer may import `@/ui-kit`. `ui-kit` sits beside `shared` and may import `@/shared/*`
(helpers, hooks, config, i18n) — never a slice layer.

## Public API

Import the slice (`@/features/search/command-palette`), never the domain group
(`@/features/search`) and never past the barrel. The design system has one root
barrel — `@/ui-kit`; primitives live in `atoms/`, `molecules/`, `organisms/`.

`model/` barrels live in subfolders (`model/hooks/index.ts`), never a slice-level
`model/index.ts`.

Inside a slice, relative imports go through the nearest barrel too: `../hooks`,
`../../model/hooks`, `./components`, `../lib/<concern>` — not the file behind it
(`../hooks/use-x`, `./components/X`, `../lib/x/x.types`). Two exceptions: sibling hooks
(or sibling components) import each other by folder (`../use-x`), since a module
never imports itself through its own barrel; and code in `lib/` never imports from
`model/` — a type both need lives in `lib/`.

## No import cycles

`apps/client/_tests/import-cycles.test.ts` runs madge over `views`, `widgets`, `features`,
`entities`, `shared` and `ui-kit` (tsconfig paths, type-only and dynamic imports skipped,
`generated/` and `_tests/` ignored) and fails on any runtime cycle. A barrel makes a cycle
easy to miss — `a → ../hooks → b → a` — so:

- **A module never imports a barrel that re-exports it**, directly or through a chain:
  sibling hooks and sibling components import each other by folder (above).
- **`model/context` never imports `model/hooks`** (a type-only import is fine). The
  context folder holds the context object and its `useX` consumer; the hook that builds
  the value lives in `model/hooks/use-<x>-state/`, and the Provider is a component in
  `ui/` that imports both. Hooks read the context through `../../context`.
- **`lib/` never imports `model/`**, and **`config/` never imports `ui/`** — a map of
  components (React Flow `nodeTypes`) is written in the component that passes it.
- **A hook that renders the slice's `ui/`** (a `use-<table>-columns` hook, or a hook that
  calls one) stays out of the `model/hooks` barrel when a component it renders reaches back
  into that barrel; its one consumer imports it by folder (`../../../model/hooks/use-x-columns`).

**Tests** import the public API like any other code, with the `@/` alias rather than a
relative path out of their slice. The one deep import a test may make is the concrete
module it mocks or spies on (`vi.mock('@/entities/search/search/api/search/search')`),
because `vi.mock` has to name the module that is actually loaded.
