---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/react.md; keep them in sync. -->

# Code style — client: React Compiler

## React Compiler

The compiler is on, so `useMemo`/`useCallback` are for semantic stability only.
`'use no memo'` opts out a component that holds a mutable library instance — the
TanStack Table components in `ui-kit/organisms/DataTable`. Nowhere else without
that reason. Generic hooks come from `@siberiacancode/reactuse` (`useBoolean`,
`useDebounceValue`, `useHotkeys`, `useLocalStorage`, `useInterval`).
