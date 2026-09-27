---
paths:
  - "apps/web/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/slice-ui.md; keep them in sync. -->

# Code style — client: slice layout

## Components only render

```text
<layer>/<domain>/<slice>/
  index.ts
  ui/                                     ← one exported component:
    <Main>.tsx .types.ts .module.scss     ←   the flat main component
    components/  index.ts  <Sub>/…        ←   its subcomponents, one folder each
  ui/                                     ← several exported components:
    <A>/  <A>.tsx .types.ts .module.scss index.ts [components/]
    <B>/  …                               ←   every one gets a folder, none flat
    [components/]                         ←   subcomponents several of them share
  <Sub>/ or <A>/:
    <Sub>.tsx  <Sub>.types.ts  <Sub>.module.scss  index.ts
    [<Sub>.motion.ts] [<Sub>.variants.ts] [_tests/]
    components/  index.ts  <Nested>/…     ← nesting max 2 `components/` levels
  model/hooks/use-<x>/  use-<x>.ts  use-<x>.types.ts  index.ts  _tests/
  model/hooks/use-<x>-form/               ← react-hook-form + zodResolver
  model/hooks/use-<x>-state/              ← builds a Provider's value
  model/context/  index.ts  <name>/       ← context object + useX consumer:
    <name>-context.ts  <name>-context.types.ts  index.ts
  ui/…/<X>Provider/                       ← the Provider is a component: calls
                                          ←   use-<x>-state, renders <XContext value>
  api/<resource>/  <resource>.ts  <resource>.types.ts  index.ts   ← the slice's requests
  api/mappers/<name>/                    ← API DTO → UI model converters
  api/index.ts
  lib/<concern>/  <concern>.ts  <concern>.types.ts  index.ts  _tests/
  config/  index.ts  <concern>.constants.ts
```

- A component folder holds only `Name.tsx`, `Name.types.ts`, `Name.module.scss`,
  `index.ts`, nested `components/` (plus `.motion.ts` / `.variants.ts` / `_tests/`).
  **Never** `*.helpers.ts`, `*.utils.ts`, `*.constants.ts`, `*.columns.tsx` or `hooks/`
  there. One component per folder and per file. A flat main component never sits beside
  sibling component folders: either `<Main>.tsx` + `components/`, or a folder per exported
  component. A third `components/` level is lifted to a sibling of its parent.
- A `.tsx` may call `useTranslations`/`useFormatter`, navigation and context hooks,
  **one** model hook of its own and at most one trivial UI flag (`useBoolean` /
  a single `useState` for open or tab). Queries, mutations, effects,
  `useMemo`/`useCallback`/`useReducer`, timers, storage, clipboard and multi-statement
  or `async` handlers go to `model/hooks/use-<x>/`; forms to `use-<x>-form/`.
- A pure single-expression lookup from props or config may stay in the body
  (`const Icon = ICONS[kind]`, `const { width } = TANK_IMAGE[size]`, one helper call
  destructured). Anything built in several steps — two or more derived values feeding
  each other, formatting, filtering, geometry — comes back from the model hook
  (`ui-kit`: a `shared/lib` helper or `use-<x>` hook).
- Module-level constants → `config/<concern>.constants.ts`; helpers →
  `lib/<concern>/`. The one module-level value allowed in a hook file is the TanStack
  helper `const column = createColumnHelper<Row>()` in a `use-<x>-columns.tsx`.
  `ui-kit` has no segments: its helpers go to `shared/lib/<concern>/`, its hooks to
  `shared/lib/use-<x>/`; only a primitive's own `<Name>.constants.ts` may stay.
- Table columns: `model/hooks/use-<table>-columns/use-<table>-columns.tsx`; cells are
  components in `ui/components/<Table>/components/<X>Cell/`.
