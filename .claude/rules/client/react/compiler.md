---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/react.md; keep them in sync. -->

# Code style — client: React Compiler

## React Compiler

The compiler is on, so `useMemo`/`useCallback` are for semantic stability only.
`'use no memo'` opts out a component or hook that holds a mutable library
instance the compiler would memoise into staleness: TanStack Table and Virtual
(`ui-kit/organisms/DataTable`, `shared/lib/use-data-table`,
`shared/lib/use-table-virtualizer`) and three.js / React Three Fiber scenes, meshes
and their hooks (`widgets/armor/armor-viewer`, `widgets/showcase/showcase-3d`).
Nowhere else without that reason. Generic hooks come from `@siberiacancode/reactuse` (`useBoolean`,
`useDebounceValue`, `useHotkeys`, `useLocalStorage`, `useInterval`).
