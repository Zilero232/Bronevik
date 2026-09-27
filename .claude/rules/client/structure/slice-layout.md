---
paths:
  - "apps/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/slice-ui.md; keep them in sync. -->

# Code style — client: slice layout

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
  api/<resource>/  <resource>.ts  <resource>.types.ts  index.ts   ← the slice's requests
  api/mappers/<name>/                    ← API DTO → UI model converters
  api/index.ts
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
