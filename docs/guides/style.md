# Bronevik Style Guide

Project code-style conventions for `apps/client/`, plus the parts of the server app and the shared packages that the client touches. Architectural rules live in [`docs/architecture/fsd.md`](../architecture/fsd.md).

Tools:

- **ESLint** (`bun lint` / `bun lint:fix`) — linter + import sorting (`perfectionist/sort-imports`) + JSX prop sorting (`perfectionist/sort-jsx-props`) + `padding-line-between-statements`. Config: the root `eslint.config.mjs`, on top of `@siberiacancode/eslint`.
- **Prettier** (`bun format` / `bun format:check`) — formatter. Config: `prettier.config.mjs`.
- **Stylelint** (`bun lint:css`) — SCSS modules, `stylelint-config-standard-scss` + `stylelint-config-idiomatic-order`.
- **TypeScript** strict + `noUnusedLocals` + `noUnusedParameters`.
- FSD boundaries and a handful of React conventions are kept by hand and caught at review (the linter does not cover hook order or FSD cross-slice imports).

**Why ESLint + Prettier:** the `@siberiacancode/*` configs already carry a rule set for
React/TS/SCSS, and `perfectionist` plus `padding-line-between-statements` autofix exactly
the things that would otherwise have to be kept by hand. It all runs under one
command — `bun run verify` (typecheck + ESLint + Prettier + Stylelint).

---

## 1. Slice structure

Every slice is a folder of segments. The minimum is `ui/` + `index.ts`:

```text
features/search/command-palette/
  index.ts          ← public API (barrel)
  ui/               ← React components — render only
  model/            ← hooks (state, effects, queries, handlers, forms), contexts, state types
  lib/              ← pure slice utilities, one folder per concern
  api/              ← the I/O boundary tied to this slice's domain (when there is one)
  config/           ← constants, one file per concern
```

**Components only render.** State, effects, queries, handlers and derived data live in
`model/hooks/`, pure helpers in `lib/<concern>/`, constants in `config/`. The same layout
holds in every slice of every layer (`entities`, `features`, `widgets`, `views`).

Slices are grouped by business domain (`features/app`, `features/search`, `features/stats`,
`entities/player`, `entities/tank`) — a layer on top of canonical FSD, see
[`docs/architecture/fsd.md`](../architecture/fsd.md) §2. Always import down to the slice level:
`@/features/search/command-palette`, not `@/features/search`.

---

## 2. Slice `ui/` structure

**One component per folder.** A slice's `ui/` holds at most **one** flat main component;
every other component gets its own PascalCase folder. Never two flat components side by
side in a `ui/` root, and never two components in one file.

```text
features/app/switch-theme/ui/
  ThemeToggle.tsx                    ← the one flat main component
  ThemeToggle.types.ts               ← Props and local union types
  ThemeToggle.module.scss
  ThemeToggle.motion.ts              ← motion presets (when the component is animated)

features/search/command-palette/ui/
  CommandPalette/                    ← a second top-level component → every one gets a folder
    CommandPalette.tsx
    CommandPalette.module.scss
    index.ts
    components/
  CommandPaletteTrigger/
    CommandPaletteTrigger.tsx
    CommandPaletteTrigger.types.ts
    CommandPaletteTrigger.module.scss
    index.ts
```

**A component folder holds only these files:**

| File | When |
| --- | --- |
| `<Name>.tsx` | always — the component, JSX only |
| `<Name>.types.ts` | there are Props or local union types |
| `<Name>.module.scss` | the component has styles |
| `index.ts` | always — `export { Name } from './Name';` |
| `components/` | nested subcomponents (barrel + one folder each) |
| `<Name>.motion.ts` / `<Name>.variants.ts` | motion presets / a `cva` variant map, when needed |
| `_tests/` | a component with real behaviour |

**Never** `<Name>.helpers.ts`, `<Name>.utils.ts`, `<Name>.constants.ts`, `<Name>.columns.tsx`
or a `hooks/` folder inside a component folder. Where they go instead:

| Found in a component | Moves to |
| --- | --- |
| `useQuery`/`useMutation`, `useEffect`, `useMemo`/`useCallback`/`useReducer`, 2+ `useState`, timers, storage, clipboard, handlers with more than one statement or `async` | `model/hooks/use-<x>/use-<x>.ts` + `use-<x>.types.ts` + `index.ts` |
| a form (`useForm`, fields, submit) | `model/hooks/use-<x>-form/` (§15) |
| a helper function (module-level or inside the component) | `lib/<concern>/<concern>.ts` + `index.ts` + `_tests/` |
| a module-level `const`, icon maps, `DEFAULT_VALUES`, skeleton row counts | `config/<concern>.constants.ts`, re-exported from `config/index.ts` |
| a second component | `components/<Name>/` |

What a component body may contain: `useTranslations`/`useFormatter`, navigation and context
hooks, **one** call to its own model hook, **at most one** trivial UI flag (`useBoolean` or a
single `useState` for open/tab), and JSX.

Table column definitions are the one hook that may be `.tsx`:
`model/hooks/use-<table>-columns/use-<table>-columns.tsx`. It only references cell
components, which live in `ui/components/<Table>/components/<X>Cell/`; no JSX-heavy cells or
`.module.scss` in `model/`.

**Subcomponents** (used only inside the parent) — each one in a `components/` folder:

```text
features/search/command-palette/ui/CommandPalette/
  CommandPalette.tsx
  components/
    index.ts                   ← barrel: re-exports every subcomponent
    PaletteInput/
      PaletteInput.tsx
      PaletteInput.types.ts
      PaletteInput.module.scss
      index.ts                 ← `export { PaletteInput } from './PaletteInput';`
    PaletteResults/
      ...
```

The parent imports through the barrel:

```ts
// ✓ OK
import { PaletteFooter, PaletteInput, PaletteNavigation, PaletteResults, PaletteStatus } from './components';

// ✗ NOT OK
import { PaletteInput } from './components/PaletteInput';
```

**File rules:**

- `.types.ts` — created only when there are Props or local union types.
- `.module.scss` — component styles (imported as `import s from './Foo.module.scss'`). Required everywhere: in `ui-kit` as much as in widgets/features/views. There is no CSS-in-JS in this project.
- `.motion.ts` — animation presets for `motion`, next to the component (`ThemeToggle.motion.ts`, `BarChart.motion.ts`). Don't duplicate an animation with a CSS transition.
- `ui-kit/` — the atomic layer (atoms/molecules/organisms). **No flat `button.tsx`** — every primitive lives in a PascalCase folder (§2.1). From outside — `@/ui-kit`.

### 2.1. `ui-kit` structure

Every primitive gets its own folder.

```text
ui-kit/
  index.ts                    ← re-export atoms + molecules + organisms
  atoms/
    index.ts                  ← re-export every atom
    Button/
      Button.tsx
      Button.module.scss
      Button.types.ts         ← optional
      Button.variants.ts      ← optional: the cva variant/size map
      _tests/                 ← optional: Vitest next to the component
      index.ts                ← export { Button, buttonVariants } from './Button…';
    RatingBadge/
      ...
  molecules/
    Select/
      Select.tsx
      Select.module.scss
      Select.types.ts
      index.ts
    Dialog/
      Dialog.tsx
      Dialog.module.scss
      index.ts
  organisms/
    DataTable/
      DataTable.tsx
      DataTable.constants.ts
      DataTable.types.ts
      components/             ← DataTableHead, DataTableRows, DataTableVirtualRows, DataTableSkeleton
      _tests/
      index.ts
    ChartKit/                 ← shared visx building blocks for AreaChart, BarChart, LineChart
      ...
```

**Rules:**

- Component folder and file names are **PascalCase** (`Button/`, `Button.tsx`).
- `ui-kit` has no slice segments. A primitive's pure helpers go to `shared/lib/<concern>/`,
  its hooks to `shared/lib/use-<x>/` — never `<Name>.helpers.ts` or a `hooks/` folder in the
  component. The one exception to §2's file list: a primitive's own tuning constants may sit
  in `<Name>.constants.ts` (`DataTable.constants.ts`), since there is no `config/` to hold them.
- Styles are **`*.module.scss`**; shared utilities are imported as `@use '@/shared/styles/mixins' as *` (the `@/` alias comes from `sassOptions.loadPaths` + `turbopack.resolveAlias` in `next.config.ts`, so no `../../../`).
- Headless + a11y — **`@base-ui/react`**; imported from the package subpath: `@base-ui/react/dialog`, `@base-ui/react/select`, `@base-ui/react/popover`, `@base-ui/react/tabs`. Rename the base primitive at the import (`Select as BaseSelect`) so our own export can carry the plain name.
- Variant maps use **`class-variance-authority`** over the module classes, in `<Name>.variants.ts` (`Button.variants.ts` → `buttonVariants`). The map is exported, so a `Link` can wear a button's look: `className={buttonVariants({ variant: 'secondary' })}`.
- Charts are **visx** (`@visx/scale`, `@visx/shape`, `@visx/axis`, …), assembled from `ChartKit` (`ChartFrame`, `ChartCanvas`, `useChartHover`). The command palette is **`cmdk`**; tables are **`@tanstack/react-table`** with **`@tanstack/react-virtual`** past `DATA_TABLE.virtualizeAfter` rows.
- React types are **named imports** (`ComponentProps`, `ReactNode`, …), not `import type * as React`.
- Inside `ui-kit`, imports between layers are relative (`../../atoms`). From outside — only `@/ui-kit`.
- The barrels at all levels (`atoms/index.ts`, `molecules/index.ts`, `organisms/index.ts` and the root `ui-kit/index.ts`) use **explicit named** re-exports, with values and types in separate blocks.

### Slice barrel

```ts
// features/search/command-palette/index.ts
export { CommandPaletteProvider, useCommandPalette } from './model/context';
export { CommandPalette } from './ui/CommandPalette';
export { CommandPaletteTrigger } from './ui/CommandPaletteTrigger';
export type { CommandPaletteTriggerProps } from './ui/CommandPaletteTrigger';
```

### Effect hooks instead of a pile of `useEffect` in the component

A side effect with no markup is **its own hook in `model/hooks/`** — it returns nothing
(or a single value) and encapsulates a single effect: the palette hotkey, the
rating-patterns sync, the header's scroll state. The orchestrator is the Provider or the
component that calls them:

```tsx
// features/search/command-palette/model/context/CommandPaletteProvider.tsx
export const CommandPaletteProvider = ({ children }: CommandPaletteProviderProps) => {
  const [isOpen, toggleOpen] = useBoolean(false);

  useCommandPaletteHotkey(() => toggleOpen());

  return <CommandPaletteContext value={{ isOpen, setOpen: toggleOpen }}>{children}</CommandPaletteContext>;
};
```

This keeps effects from bloating the body of the main component; each one is isolated
and can be reasoned about on its own. The alternative — a pile of `useEffect` inside
`CommandPalette.tsx` — is forbidden (it blows past the 100-line limit, section 4).

`useCommandPaletteHotkey` (`features/search/command-palette`), `useRatingPatternsSync`
(`features/app/rating-patterns`) and `useIsScrolled` (`widgets/site/site-header`) each live
in their slice's `model/hooks/`.

### Examples

**`CommandPaletteTrigger.types.ts`:**

```ts
export type CommandPaletteTriggerProps = {
  variant?: 'bar' | 'hero' | 'icon';
  className?: string;
};
```

**`CommandPaletteTrigger.module.scss`** — the component's styles; classes are read off `s`:

```scss
@use '@/shared/styles/mixins' as *;

.root {
  @include reset-button;

  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border-strong);
  gap: var(--space-3);
}
```

**`PeriodSwitcher.tsx`:**

```tsx
'use client';

import type { RecentPeriod } from '@bronevik/schemas';

import { recentPeriodSchema } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { PeriodSwitcherProps } from './PeriodSwitcher.types';

export const PeriodSwitcher = ({ value, size = 'md', className, onChange }: PeriodSwitcherProps) => {
  const t = useTranslations('periods');

  return (
    <SegmentedControl<RecentPeriod>
      aria-label={t('label')}
      className={className}
      options={recentPeriodSchema.options.map((period) => ({ value: period, label: t(period) }))}
      size={size}
      value={value}
      onChange={onChange}
    />
  );
};
```

---

### 2.2. `model/hooks` structure

Symmetrical to `ui/`: **every hook gets its own folder**, named after it.

```text
entities/app/locale/model/hooks/
  index.ts                        ← segment barrel
  use-locale/
    use-locale.ts
    use-locale.types.ts           ← Input/Output types, when there are any
    index.ts
    _tests/                       ← a hook with real logic
  use-profile-form/               ← a form hook: useForm + zodResolver + submit (§15)
    use-profile-form.ts
    use-profile-form.types.ts
    index.ts
```

A component calls **one** hook of its own (`use-<component>`), which composes queries,
state, effects and handlers and returns what the JSX needs. A hook's constants, when it has
any, go to the slice's `config/`, not beside the hook.

A hook's `index.ts` re-exports both the hook and its types:

```ts
export { useLocale } from './use-locale';

export type { UseLocale } from './use-locale.types';
```

A hook's input type is named `Use<Name>Input` (§5). When it merely repeats a
component's props, don't duplicate it; derive it instead:
`Pick<PeriodSwitcherProps, 'value' | 'onChange'>`.

---

## 3. Styles: SCSS modules only

| Layer                      | Format                                                           |
| -------------------------- | ---------------------------------------------------------------- |
| `ui-kit/**`                | `*.module.scss` + CSS variables from `shared/styles/_tokens.scss` |
| widgets / features / views | `*.module.scss`                                                  |

There is no CSS-in-JS in this project — no Tailwind, no `.styles.ts`. `class-variance-authority`
is allowed, but only as a map from variant props to **module classes** (`Button.variants.ts`);
the styles themselves stay in SCSS.

| Case                            | Where                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Component styles in `ui-kit`    | `<Name>.module.scss`                                                                      |
| Styles for a slice subcomponent | `<Name>.module.scss` next to it                                                           |
| Conditional classes             | `clsx(s.root, s[tone], className)` or a `data-*` attribute styled in SCSS                 |
| Primitive variants/sizes        | a `cva` map in `<Name>.variants.ts` (`Button.variants.ts`)                                |
| Rating colour                   | `data-tone={ratingTone(...)}` + `@include tone` from `shared/styles/mixins` (§12)         |
| Animation                       | `motion` + presets in `<Name>.motion.ts`, shared ones in `shared/lib/motion`              |
| Media query                     | `@include below(md)` / `@include from(2xl)` from `shared/styles/mixins` — never raw pixels |

Joining module classes with an optional `className` prop is done with **`clsx`** (`import { clsx } from 'clsx'`).

The principle: the JSX reads, and `s.root`/`s.head` tell you the structure.

---

## 4. Component size

**100 lines per JSX file, maximum.**

Over the line means refactor:

1. Subcomponents → `components/`.
2. Logic → `model/hooks/use-<x>/`.
3. Helpers → the slice's `lib/<concern>/`; constants → `config/<concern>.constants.ts`.

**A multi-export primitive** (`Dialog` ships `Dialog`, `DialogTrigger`, `DialogClose`,
`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`) stays in
one file **as long as it fits the limit** — `ui-kit/molecules/Dialog/Dialog.tsx` is thin
wrappers over `@base-ui/react/dialog`, all of them in under 50 lines. The moment it goes
over, the parts move out into `components/<Name>/` and `<Name>.tsx` stays as a thin
re-export. Group by meaning, not one file per export: closely related parts
(`Header`/`Title`/`Description`) live together.

Subcomponent nesting may go to a second level when a subcomponent has grown of its own
accord. No deeper than that — it is a signal that the block should be lifted into a
slice of its own.

**Context shared between the parts goes in its own module** next to the component, not
inside it: otherwise `components/*` import the parent and the parent imports them. That
is how `features/search/command-palette` is built — the context in
`model/context/command-palette-context.ts`, the provider in a separate file alongside it.

---

## 5. Naming

| What                     | How                  | Example                                      |
| ------------------------ | -------------------- | -------------------------------------------- |
| Slices                   | kebab-case           | `command-palette`, `switch-locale`           |
| Segments                 | kebab-case           | `ui`, `model`, `lib`, `api`, `config`        |
| Component folder         | PascalCase           | `PaletteInput/`, `RatingBadge/`              |
| Component file           | PascalCase + `.tsx`  | `PaletteInput.tsx`                           |
| Types file               | `<Name>.types.ts`    | `PaletteInput.types.ts`                      |
| Styles file              | `<Name>.module.scss` | `Button.module.scss`                         |
| Hook folder + file       | kebab-case           | `use-search-results/use-search-results.ts`   |
| Helper folder + file     | kebab-case           | `lib/group-results/group-results.ts`         |
| Constants file           | kebab-case           | `config/search.constants.ts`                 |
| React component (export) | PascalCase           | `CommandPalette`                             |
| Hook                     | `use` + camelCase    | `useSearchResults`, `useCommandPaletteHotkey` |
| Utility                  | camelCase            | `groupSearchResults`, `ratingTone`           |
| Props type               | `<Name>Props`        | `PlayerCardProps`                            |
| DTO type                 | `<Name>Input/Output` | `SearchInput`, `LocalePathInput`             |

> Canonical FSD: kebab-case for every file. Bronevik deviates: PascalCase for component folders and files, kebab-case for hooks and utilities.

---

## 6. Imports

### Aliases

`@/` → the `apps/client/` root. Used for everything except relatives inside the same slice.

### Group order

`perfectionist/sort-imports` (`bun lint:fix`) sorts imports into groups in this order, **with a blank line between groups**:

1. **External types** — `import type` from packages, `@bronevik/*` included.
2. **External values** — packages, `node:` builtins, `@bronevik/*`.
3. **Internal types** — `import type` from `@/` aliases.
4. **Internal values** — `@/` aliases.
5. **Relative types** — `import type` from `./` and `../`.
6. **Relative values** — `./` and `../`.
7. **Styles** — `*.scss` / `*.css` imported as a module.
8. **Side effects** — `import './globals.scss'` and the like.

```ts
// 1. external types
import type { RecentPeriod } from '@bronevik/schemas';

// 2. external values
import { recentPeriodSchema } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';

// 3. internal types
import type { TankStats } from '@/entities/tank/tank';

// 4. internal values
import { ratingTone } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

// 5. relative types
import type { PlayerCardProps } from './PlayerCard.types';

// 6. relative values
import { PlayerIdentity } from './PlayerIdentity';

// 7. styles
import s from './PlayerCard.module.scss';
```

The configuration lives in the `@siberiacancode/eslint` preset the root `eslint.config.mjs` extends.
ESLint inserts the blank lines between groups on `bun lint:fix`; don't strip them by hand.

### Prohibitions

A deep import past a barrel is forbidden:

```ts
// ✗ FORBIDDEN
import { PaletteInput } from '@/features/search/command-palette/ui/components/PaletteInput';
import { Button } from '@/ui-kit/atoms/Button';

// ✓ OK
import { CommandPalette } from '@/features/search/command-palette';
import { Button } from '@/ui-kit';
```

`ui-kit` has a single root barrel, `@/ui-kit` (the atomic layer sits under it). Inside a slice, relative imports are fine.

ESLint does not check FSD boundaries — those are caught at review.

---

## 7. Barrel exports (`index.ts`)

**A slice:**

```ts
// entities/player/player/index.ts
export type { PlayerIdentityData, PlayerStats } from './model/player.types';
export { PlayerCard } from './ui/PlayerCard';
export type { PlayerCardProps } from './ui/PlayerCard.types';
export { PlayerIdentity } from './ui/PlayerIdentity';
export type { PlayerIdentityProps } from './ui/PlayerIdentity.types';
```

Only what is needed from outside. Internal subcomponents are not exported.

**A component folder:**

```ts
// ui/components/PaletteInput/index.ts
export { PaletteInput } from './PaletteInput';
export type { PaletteInputProps } from './PaletteInput.types';
```

**A subsystem in `model/`:** when a hook is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point — the Provider, the hook and the types the outside needs. Internal modules do not go out.

```ts
// features/search/command-palette/model/context/index.ts
export { useCommandPalette } from './command-palette-context';
export type { CommandPaletteContextValue, CommandPaletteProviderProps } from './command-palette-context.types';
export { CommandPaletteProvider } from './CommandPaletteProvider';
```

Wildcard exports (`export * from`) are forbidden. Explicit named exports only.

---

## 8. Types

- **Everything through `type`** — Props, unions, aliases, DTOs. `interface` is forbidden:
  ESLint `ts/consistent-type-definitions: ['error', 'type']`. The only exception is
  declaration merging into a library's interface (`global.d.ts`, `vitest.setup.ts`),
  which needs an `eslint-disable-next-line` with its reason.
- Props always live in `<Name>.types.ts` next to the component.
- `import type { ... }` — enforced by ESLint (`ts/consistent-type-imports`), `bun lint:fix` fixes it. The server app (API and worker) turns it off: Nest resolves injected classes from decorator metadata that `import type` erases.
- `export type { ... }` — enforced the same way.
- `unknown` instead of `any`. `any` is forbidden.
- Discriminated unions for state variants:

```ts
// packages/schemas/src/search/search.schemas.ts
export const searchResultSchema = z.discriminatedUnion('kind', [
  playerSearchResultSchema,
  clanSearchResultSchema,
  tankSearchResultSchema,
  mapSearchResultSchema
]);
```

### 8.1 Field order in Props and destructuring

One order in two places: **`type Props`** and **the parameter destructuring**. That way the eye looks for the same thing the same way.

The order:

1. **Data** — strings, numbers, booleans, objects, refs, `children`.
2. **Identifiers / styles** — `id`, `className`, `style`.
3. **Event handlers** — `onClick`, `onChange`, any `on<Event>`.

```ts
// ✓ OK
export type PeriodSwitcherProps = {
  value: RecentPeriod;
  size?: 'md' | 'sm';
  className?: string;
  onChange: (value: RecentPeriod) => void;
};

export const PeriodSwitcher = ({ value, size = 'md', className, onChange }: PeriodSwitcherProps) => {
  ...
};
```

The logic: "what we show" → "how it looks" → "what it does". Meaning first, then form, then behaviour.

Within each group the order is free, but **it must match between the Props type and the destructuring**. A mismatch is caught at review.

**The JSX call site is sorted by ESLint**, not by hand: `perfectionist/sort-jsx-props` puts
shorthand props first, then `key`/`ref`, then the rest alphabetically, and every `on<Event>`
callback last. `bun lint:fix` applies it.

---

## 9. Arrow functions: the body

**ESLint decides (`arrow-body-style: as-needed`, from `@siberiacancode/eslint`).** A function whose body is a single `return` uses an expression body; anything with statements uses a block body. `bun run lint:fix` rewrites it automatically, so never fight the rule by hand.

Components are arrow functions too — `siberiacancode/function-component-definition` enforces it.

```ts
// ✓ OK — single expression
export const toneOfTier = (tier: RatingTier): RatingTone => TIER_TONE[tier];

// ✓ OK — statements, so a block
export const useCommandPalette = () => {
  const context = use(CommandPaletteContext);

  if (!context) {
    throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  }

  return context;
};

// ✗ NOT OK — ESLint error
export const toneOfTier = (tier: RatingTier): RatingTone => {
  return TIER_TONE[tier];
};
```

### 9.1 `if` / `else` — always with braces

**The body of `if`, `else if` and `else` always goes in `{}`, even for a single line.** A one-liner `if (cond) doThing();` is forbidden: adding a second statement to the branch then needs no structural rewrite, diffs stay cleaner, and there is no "forgot the braces" trap. Enforced by ESLint (`curly: ['error', 'all']` in the root config) — `bun lint:fix` fixes it automatically.

```ts
// ✓ OK
if (!hasLocale(routing.locales, locale)) {
  notFound();
}

if (event.key !== '/' || isTyping(event.target)) {
  return;
}

// ✗ NOT OK
if (!hasLocale(routing.locales, locale)) notFound();
if (event.key !== '/' || isTyping(event.target)) return;
```

A ternary that returns a value is still fine (it is an expression, not a statement): `return a ? b : c;`.

---

## 10. React conventions

- Function components, arrow functions.
- `'use client'` in every file with hooks, state or event handlers.
- The React Compiler is on — `useMemo`/`useCallback` are not needed for micro-optimisations. Keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- **`'use no memo'`** opts a component out of the compiler. It is used only where a library hands back a mutable instance the compiler would memoise into staleness — the TanStack Table components (`DataTable`, `DataTableHead`, `DataTableVirtualRows`). Don't add it elsewhere without that reason.
- Generic hooks come from **`@siberiacancode/reactuse`** before a hand-written `useEffect`: `useBoolean`, `useDebounceValue`, `useHotkeys`, `useWindowEvent`, `useInterval`, `useLocalStorage`.
- Event handlers are `on<Event>` in camelCase: `onChange`, `onOpenChange`.
- React types come in as **named imports**: `import type { ComponentProps, ReactNode } from 'react'`. **`import type * as React from 'react'` is forbidden.**

### 10.1 Hook order

ESLint does not sort hooks — we keep the order by hand and catch it at review.

Group order:

1. **i18n / navigation** — `useTranslations`, `useFormatter`, `useRouter`, `usePathname`.
2. **Store / context** — `useTheme`, `useCommandPalette`, any `use<Name>Context`.
3. **Data** — TanStack Query hooks and the custom hooks that wrap them.
4. **State** — `useState`, `useReducer`, `useBoolean`.
5. **Ref** — `useRef`.
6. **Memo / callbacks** — `useMemo`, `useCallback`, `useTransition`, `useId`.
7. **Effects** — `useEffect`, `useLayoutEffect`, effect hooks.
8. **Derived consts** — values computed from what the hooks returned.

```tsx
export const CommandPalette = () => {
  const t = useTranslations('search');
  const router = useRouter();
  const { isOpen, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const { results, total, isEnabled, isFetching, isError } = useSearchResults(query);

  const onOpenChange = (next: boolean) => {
    ...
  };

  return /* ... */;
};
```

**Rules for reordering:**

- Never move a hook that has a data dependency: `useSearchResults(query)` needs `query`, so the `useState` that owns it comes first even though the Data group precedes State. When the group order conflicts with a dependency, the dependency wins.
- `if (...) useFoo()` is a `rules-of-hooks` bug — fix it, don't sort it.

**Custom hooks** are placed by what they contain: `useSearchResults` (which runs `useQuery`) → the Data group; `useCommandPalette` (a context wrapper) → the Store group; `useRatingPatternsSync` (an effect) → the Effects group.

### 10.2 Hook / effect dependencies

A `useEffect` `deps` array holds only what **should genuinely retrigger** the effect.
`react-hooks/exhaustive-deps` is off in the shared ESLint preset, so nothing forces extra
entries — don't add `router`, a query result object or a mutation "to be safe".

**Stable refs do not go in deps.** `router` from `@/shared/i18n/navigation`, `setState`
setters, and `reset`/`mutate` from react-query are stable between renders; the effect must
not react to their "change".

```tsx
// ✓ OK — the only trigger is the value the effect writes
useEffect(() => {
  document.documentElement.dataset.ratingPatterns = isEnabled ? 'on' : 'off';
}, [isEnabled]);
```

**Anti-pattern: `useEffect` + `mutate` to load data.** A mutation object in deps means a new ref every render, which means refetch loops. Declarative loading goes through `useQuery` with a key (`queryKey: QUERY_KEYS.search(debounced)`) — react-query refetches on a key change by itself, and neither `useEffect` nor `reset()` is needed.

### 10.3 Destructuring query / mutation results

The result of `useQuery` or a custom query hook is **destructured on the spot** — don't carry the object around and don't reach through the dot:

```tsx
// ✗ BAD — dot access, and the wrapper object earns nothing
const searchQuery = useQuery({ ... });
const response = searchQuery.data;
// ... searchQuery.isFetching, searchQuery.isError

// ✓ OK — destructured in place, renamed for meaning
const { data: response, isFetching, isError } = useQuery({
  queryKey: QUERY_KEYS.search(debounced),
  queryFn: ({ signal }) => search({ query: debounced, signal })
});
```

`data` is almost always renamed (`data: response`) — a bare `data` carries no meaning.

**The exception is `useMutation`.** A mutation object is kept whole: both its fields (`isPending`, `isError`, `error`, `data`) and its methods (`mutateAsync`, `reset`) are needed. Destructuring five-plus names reads worse, and the methods get called as `mutation.reset()` anyway.

### 10.4 Destructure wherever it simplifies

The principle: **destructure as much as you can** — for readability. If a value is reached through the dot twice or more, or arrives nested, pull it into a local variable. Less `obj.a.b` noise, and the names speak for themselves.

```tsx
// ✗ BAD — player.X repeats through the whole component
<span>{format.number(player.battles)}</span>
<span>{format.number(player.wn8)}</span>
<ProgressBar value={player.broneIndex} />

// ✓ OK — PlayerCard pulls the fields out once
const { nickname, battles, winRate, wn8, avgDamage, broneIndex, marks3, trend } = player;
```

**Function parameters: 2+ arguments → one destructured object.** Positional arguments (especially same-typed ones — `number, number`) are easy to swap by mistake; an object is self-documenting and order stops mattering.

```ts
// ✗ BAD — positional, easy to mix up
search(query, signal);

// ✓ OK — an object parameter, destructured in the signature
search({ query, signal });
```

**When NOT to destructure:**

- A single access — one `obj.x`, and destructuring is ceremony.
- Context is lost — if a bare `name` leaves it unclear whose it is, keep `tank.name` or rename (`const { name: tankName } = ...`).
- A stable namespace object (`router`, `console`, `Math`) — leave it alone.

---

## 11. The `model/`, `lib/` and `api/` segments

**`model/`** — hooks, context providers, state types.

```text
features/search/command-palette/model/
  hooks/                          ← a group of hooks
    index.ts                      ← the hooks barrel
    use-command-palette-hotkey/   ← use-command-palette-hotkey.ts + index.ts
    use-search-results/           ← use-search-results.ts + .types.ts + index.ts + _tests/
  context/                        ← a subsystem is a folder
    index.ts                      ← barrel: { CommandPaletteProvider, useCommandPalette }
    CommandPaletteProvider.tsx
    command-palette-context.ts
    command-palette-context.types.ts
  (no model/index.ts — the barrel sits on the subfolders)
```

Files are kebab-case. The functions inside them are camelCase.

**A subsystem is a folder.** A provider plus its context and hook (or a hook plus
two or more modules that exist only for it) gets its own folder with an
`index.ts` — `model/context/`, for instance. A slice's hooks and contexts are
grouped into `model/hooks/` and `model/context/` (see the barrel rule below). A
flat `model/` — one or two files, no subfolders — is fine for a small slice
(`entities/player/player/model/player.types.ts`).

**Grouping inside `model/`.** When a slice accumulates many `model` files, group
them into subfolders by nature (`model/context/`, `model/hooks/`) — see
`features/search/command-palette`. That is organisation **inside** the `model/`
segment, not a separate top-level `hooks/` segment (which is forbidden — see below).

**The `model/` barrel rule.** Every `model/` subfolder gets its own `index.ts`
(`model/hooks/index.ts`, `model/context/index.ts`). **Do not create a slice-level
`model/index.ts`.** Importing from outside a subfolder goes through its barrel:

```ts
// ✓ OK
import { useSearchResults } from '../model/hooks';
import { useCommandPalette } from '../model/context';
// the slice index.ts
export { CommandPaletteProvider, useCommandPalette } from './model/context';

// ✗ NOT OK
import { useSearchResults } from '../model/hooks/use-search-results'; // deep, past the barrel
import { useSearchResults } from '../model';                          // model/index does not exist
```

Between files **inside one subfolder**, import by file (`./use-x`, `./x.types`),
never through your own barrel — that is a self-import. A flat `model/` — no
subfolders — needs no barrel at all; import by file.

**Types:**

- Types local to one hook (its input and output, internal unions) live in its
  `use-<x>.types.ts`.
- The slice's public model types — the ones other slices reach through the barrel —
  go in a `model/<name>.types.ts` file (`entities/tank/tank/model/tank.types.ts`).
- A subsystem folder with types of its own gets `model/<subsystem>/<name>.types.ts`
  (`model/context/command-palette-context.types.ts`).

Do not create a separate `types/` or `hooks/` segment. That splits code by the
shape of the file rather than by its nature, which is an FSD anti-pattern.

**`lib/`** — pure functions with no React dependency, one folder per concern:

```text
features/search/command-palette/lib/
  group-results/       ← splits a flat search response into players / tanks / clans
    group-results.ts
    group-results.types.ts
    index.ts
    _tests/group-results.test.ts
shared/lib/
  rating-tone/         ← maps a rating to one of six colour tones
  seeded-random/       ← deterministic PRNG for the daily puzzle
```

A helper used by one component still goes here, never into a `<Name>.helpers.ts` or
`<Name>.utils.ts` beside the component. A project-agnostic helper goes to `shared/lib/`.

A function that returns JSX is a component: move it to `ui/`.

**`config/`** — constants, one file per concern (`config/search.constants.ts`,
`config/player-stats.constants.ts`), re-exported from `config/index.ts`. Every module-level
`as const` object, `DEFAULT_VALUES`, icon map or skeleton row count a component or hook needs
lives here, not at the top of the `.tsx`.

**Choosing between `lib/` and `model/`:** a function that uses React
(`useState`, `useEffect`, a context) belongs in `model/`. A pure one — takes
arguments, returns a value — belongs in `lib/`. Error classes, parsers and
mappers are `lib/`. A set of settings or constants is `config/`.

**A slice's `api/`** is an integration with an external service tied to that
slice's domain. It differs from `model/` in being an I/O boundary — network,
realtime — where `model/` holds hooks and state types. The heuristic: code that
**listens to or sends to** an external service is `api/`; code that **reads or
derives** domain state is `model/`. A project-agnostic request tied to no slice
goes in `shared/api/` (below).

**`api/` in `shared/`** — axios wrappers, one folder per resource:

```text
shared/api/
  http/          ← the axios instance: baseURL from env, a request timeout
  search/        ← search() with its constants and types
  query-client.ts
  index.ts
```

HTTP goes through the shared axios instance from `shared/api/http`. A hand-rolled
`fetch` is unnecessary. The response is parsed with the shared schema, so a drifted
contract fails loudly at the boundary:

```ts
export const search = async ({ query, signal }: SearchInput): Promise<SearchResponse> => {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH.minLength) {
    return { query: trimmed, correctedQuery: null, results: [] };
  }

  const { data } = await api.get('/search', { params: { q: trimmed, limit: SEARCH_REQUEST.limit }, signal });

  return searchResponseSchema.parse(data);
};
```

Request and response types come from `@bronevik/schemas` — the same contract
NestJS validates against. The function returns data; errors are thrown, and
React Query catches them.

**No mocks.** No mock data layer, no fixture fallbacks, no fake latency, no
`USE_MOCKS` switch — every request goes to the real server through `fromServer`
(`shared/api/source`). With no data a screen shows its empty state; with the server
down, its error state with a retry. Test doubles in `_tests/` are not this — they
stay in tests.

---

## 12. Global styles and SCSS

- **Design tokens** are CSS variables in `shared/styles/_tokens.scss`, pulled in once by
  `app/globals.scss` — type scale, spacing, radii, durations, easings, z-index,
  safe-area insets, colours, elevations and the rating palette. `shared/styles/` also
  holds `_animations.scss`, `_breakpoints.scss` and `_mixins.scss`.
- **Two themes, dark and light.** Theme-independent tokens sit on `:root`; the dark palette
  on `:root, [data-theme='dark']`; the light palette on `[data-theme='light']`. `next-themes`
  (`ThemeProvider` in `app/providers/AppProviders.tsx`) writes the `data-theme` attribute —
  dark by default, no system detection, persisted under `STORAGE_KEYS.theme`. A colour
  token added to one theme block is added to the other in the same change. Components read
  tokens (`var(--color-surface)`), never a hard-coded colour, so they follow the theme with
  no theme-specific code.
- **Fonts** are self-hosted through `next/font/local` in `shared/config/fonts`: **Tektur**
  for display and numbers (`--font-display`), **Onest** for body text (`--font-sans`),
  **IBM Plex Mono** for HUD labels (`--font-mono`).
- **Rating colours** come from one mapping. `@bronevik/ratings` defines nine canonical tiers
  (`very_bad` … `super_unicum`); `shared/lib/rating-tone` folds them into six colour tones —
  `bad`, `below`, `average`, `good`, `great`, `unicum` — through `ratingTone({ scale, value })`
  or `toneOfTier(tier)`. A component sets `data-tone={tone}` and its SCSS uses
  `@include tone`, which resolves `--tone` to `var(--rating-<tone>)` (`ProgressBar`,
  `ProgressRing`, `KeyFigure`, `Sparkline`, the charts). Reuse that mapping rather than re-deriving one.
- **Mixins** (`@use '@/shared/styles/mixins' as *`) carry the shared visual language:
  `panel` / `well` (bordered surfaces), `label`, `heading`, `numeric`, `field-box`,
  `popup-surface`, `popup-motion`, `tone`, `data-list-row`, `icon-button`,
  `focus-ring`, `reset-button`, `shell`. Reach for one before re-declaring its rules. The
  `@/` import works because `next.config.ts` sets `sassOptions.loadPaths` to the client
  root and aliases `@` for Turbopack.
- **Breakpoints** come from the scale in `_breakpoints.scss` — `xs` 420, `sm` 520, `md` 560,
  `lg` 640, `wide` 700, `xl` 760, `2xl` 900, `3xl` 1100, `4xl` 1280 — used as
  `@include below(md)` / `@include from(2xl)`, never a hand-written `@media (width <= 620px)`.
  An unknown name fails the Sass build.
- `clsx` joins a module class with an incoming `className` prop.

**Property order is enforced.** Stylelint runs
`stylelint-config-idiomatic-order`, so a declaration out of order is an error,
not a warning — `bun run lint:css:fix` sorts it.

---

## 13. Blank lines between logical steps

`padding-line-between-statements` is configured in the root `eslint.config.mjs`
and `bun run lint:fix` applies it. Prettier only preserves blank lines and never
inserts them, which is why the ESLint rule exists at all.

**A blank line:**

- before every `return`, `throw`, `continue`, `break`;
- between the `const`/`let` setup block and the logic that acts on it;
- before and after every block — `if`, `for`, `while`, `switch`, `try`;
- before and after every **multiline** expression or declaration.

Consecutive one-line `const`/`let` declarations and consecutive one-line calls stay grouped.

```ts
// ✓
const onOpenChange = (next: boolean) => {
  setOpen(next);

  if (!next) {
    setQuery('');
  }
};
```

```ts
// ✓ several exits
if (variant === 'icon') {
  return <IconButton ... />;
}

return <button ...>...</button>;
```

Never two blank lines in a row.

---

## 13.5. A component body reads top to bottom

A component is **hooks, then the JSX** — its handlers and derived values come from its
model hook (§2). Inside that hook the order is fixed: **hooks, then derived values, then
handlers, then the returned object.**

```ts
// model/hooks/use-command-palette-view/use-command-palette-view.ts
export const useCommandPaletteView = () => {
  const router = useRouter();
  const { isOpen, setOpen } = useCommandPalette();
  const [query, setQuery] = useState('');
  const { results, total, isEnabled, isFetching, isError } = useSearchResults(query);

  const onOpenChange = (next: boolean) => {
    setOpen(next);

    if (!next) {
      setQuery('');
    }
  };

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return { isOpen, query, setQuery, results, total, isEnabled, isFetching, isError, onOpenChange, go };
};
```

```tsx
// ui/CommandPalette/CommandPalette.tsx
export const CommandPalette = () => {
  const t = useTranslations('search');
  const { isOpen, query, setQuery, results, onOpenChange, go } = useCommandPaletteView();

  return <Command.Dialog ...>...</Command.Dialog>;
};
```

A hook that sits below a plain `const` is the shape that later drifts below a
branch, which React forbids outright. Keeping them in one block makes that
impossible to do by accident, and it means the file reads in dependency order:
nothing is used before the line that produced it.

**Two exceptions, both deliberate.**

A **ref sync** stays between its `useRef` and the `useEffect` that reads it:

```tsx
const onChangeRef = useRef(onChange);

onChangeRef.current = onChange;   // must run every render, before the effect

useEffect(() => { ... }, [value]);
```

Moving that assignment below the effect breaks it — the effect would read a
stale callback. It is not a derived value, it is part of the ref pattern.

A **value a later hook consumes** should be inlined into the hook call:

```tsx
// no — the derived value splits the hook block
const trimmed = query.trim();
const debounced = useDebounceValue(trimmed, SEARCH_REQUEST.debounceMs);

// yes
const debounced = useDebounceValue(query.trim(), SEARCH_REQUEST.debounceMs);
```

Where inlining would genuinely hurt readability — a multi-line filter, a
`useMemo` argument built from several steps — leave the `const` above the hook.
The rule orders declarations; it does not ask you to bury a dependency to
satisfy a layout.

## 14. Shared schemas — `@bronevik/schemas`

Zod schemas and the types shared between the client and the server app
live in `packages/schemas`.

Each domain is a folder, and a domain wide enough to hold several concerns
splits again — one folder per concern, never one file holding schemas,
constants and functions together:

```text
packages/schemas/src/
  search/                     ← one concern, files by role
    search.constants.ts       ← SEARCH (minLength, maxLength, defaultLimit, maxLimit)
    search.schemas.ts         ← searchQuerySchema, searchResultSchema, searchResponseSchema
    search.types.ts           ← SearchQuery, SearchResult, SearchResponse
    index.ts
    _tests/search.test.ts
  common/                     ← several concerns, one folder each
    period/                   ← recentPeriodSchema, ratingPeriodSchema, …
    primitives/               ← accountIdSchema, clanIdSchema, …
    query/                    ← listParam and query-string helpers
    rating/
    index.ts                  ← re-exports every concern
  players/, tanks/, marks/, clans/, errors/, compare/, …
```

The suffix says what the file holds, so a reader never opens one to find out:
`.schemas.ts` for zod, `.constants.ts` for data, `.types.ts` for inferred types,
`<name>.ts` for functions. A domain barrel re-exports its concerns; the root
barrel re-exports the domains.

The package exposes a single root entry point — import from `@bronevik/schemas`,
not from a subpath:

```ts
// ✓ OK
import type { SearchResponse } from '@bronevik/schemas';

import { searchResponseSchema } from '@bronevik/schemas';

// ✗ NOT OK — a type redeclared on the client
type SearchResponse = { query: string; results: ... };
```

`@/shared/api` exports runtime functions only — the request wrappers and the
query client.

**Input vs output types.** One Zod schema can yield two types: `.default()`,
`.coerce` and `.transform()` make `z.input` and `z.output` incompatible.
`searchQuerySchema` is such a schema — `limit` is coerced from a query string and
defaults to `SEARCH.defaultLimit`. Where that happens, name them apart:

- `z.input<typeof schema>` is the shape **before** validation — what a form's
  `defaultValues` or a raw query string holds.
- `z.output<typeof schema>` is the shape **after** it, with defaults applied and
  transforms run — what the controller and the service see.

That axis is the validation stage, not HTTP request versus response. An entity's
response type is its own (`SearchResponse`), never the `z.output` of an input schema.

Most schemas have neither a default nor a transform, so a single `z.infer` type
serves both ends.

---

## 15. Forms — react-hook-form + zodResolver

`react-hook-form` and `@hookform/resolvers/zod` are installed in `apps/client`. Every
form uses them, and the form logic lives in a hook, not the component:

```text
views/me/model/hooks/use-goal-form/
  use-goal-form.ts          ← useForm + zodResolver, submit mutation, setError mapping
  use-goal-form.types.ts
  index.ts
views/me/config/goal-form.constants.ts   ← GOAL_FORM_DEFAULT_VALUES
```

The component calls `useGoalForm()` and renders fields — no `useForm`, `useState` fields
or submit handler in the `.tsx`.

- The schema comes from `@bronevik/schemas`, never inline in the form.
- Default values are a constant in `config/`, not an object literal rebuilt on
  every render.
- Server-side errors go through `setError('field', { message })`.
- Validation messages are i18n keys resolved in the component — the schema never
  carries user-visible prose.

A boolean toggle outside a form uses `useBoolean` from `@siberiacancode/reactuse`
rather than `useState` (`SiteHeader`'s menu, `CommandPaletteProvider`) — except
when the setter is passed into an effect or a ref, where its identity changes
every render.

---

## 16. Conditional render — ts-pattern

Three or more render branches call for `match`, not nested
`if (...) return <X />` and not a chain of ternaries inside JSX.

There are two things worth matching on, and both are fine:

**A. A discriminated union.** The hook or the schema provides a union keyed on a
tag and the view only matches on it — `SearchResult`, keyed on `kind`, is one.
Reach for this when the assembly is substantial or reused:

```tsx
import { match } from 'ts-pattern';

return match(result)
  .with({ kind: 'player' }, (player) => <PaletteItem ... />)
  .with({ kind: 'tank' }, (tank) => <PaletteItem ... />)
  .with({ kind: 'clan' }, (clan) => <PaletteItem ... />)
  .with({ kind: 'map' }, (map) => <PaletteItem ... />)
  .exhaustive();
```

`.exhaustive()` turns a forgotten case into a TypeScript error the moment a
variant is added to the union.

**B. An object of raw hook results.** `match` runs straight on
`{ ...hook fields }`. Reach for this when there are only a few branches and a
separate hook layer would be ceremony — `PaletteStatus` does exactly this:

```tsx
return match({ total, isEnabled, isFetching, isError })
  .with({ isEnabled: false }, () => <p className={s.hint}>{t('hint')}</p>)
  .with({ isError: true }, () => <p className={s.error}>{t('error')}</p>)
  .with({ isFetching: true, total: 0 }, () => <Command.Loading ... />)
  .with({ total: 0 }, () => <p className={s.hint}>{t('empty')}</p>)
  .otherwise(() => null);
```

The order of `.with` matters — the first matching pattern wins. Take narrowed
values from the handler's argument, which `match` has already narrowed, never
from the closure and never through an `as` cast: a cast sidesteps the check that
makes this worth doing.

**Forbidden either way** — `if` and ternary chains that assemble JSX:

```tsx
// ✗ NOT OK — condition hell in the view
return !isEnabled ? <Hint /> : isError ? <Error /> : total === 0 ? <Empty /> : null;
```

**When to move it into a hook:** the state assembly is reused in two or more
places, or the logic is bulky enough that the view stops reading. Otherwise
option B, inline in the view, is normal.

### 16.1 One branch — use `&&`, not `? : null`

A present-or-absent render — one branch, nothing otherwise — is `cond && <X />`,
not `cond ? <X /> : null`:

```tsx
// ✗ NOT OK — a pointless : null
{label ? <span className={s.label}>{label}</span> : null}

// ✓ OK
{label && <span className={s.label}>{label}</span>}
```

Invert `cond ? null : <X />` into `!cond && <X />`.

**The condition must be a boolean.** `&&` renders its left operand as-is, so a
non-boolean falsy value (`0`, `''`, `NaN`) prints as literal garbage — a stray
`0` in the markup. Coerce numeric and string checks first:

```tsx
// ✗ DANGEROUS — renders "0" for an empty list
{players.length && <List />}

// ✓ OK — an explicit boolean check
{players.length > 0 && <List />}
{rank !== undefined && <span className={s.rank}>{rank}</span>}
{!isEmpty(players) && <List />}   // isEmpty from remeda
```

---

## 17. Drill cleanup

If the data is reachable through a global hook, the leaf fetches it itself
rather than accepting props:

```tsx
// ✗ BAD — drilling
<TopPlayers period={period} players={players} onPeriodChange={setPeriod} />

// ✓ OK — TopPlayers calls useTopPlayers() itself
const TopPlayers = () => {
  const { period, setPeriod, players } = useTopPlayers();
  // ...
};
```

**Do not parameterise a component for static content:**

```tsx
// ✗ NOT OK — the parent passes copy that never changes
<PaletteStatus emptyText={t('empty')} hintText={t('hint')} ... />

// ✓ OK — PaletteStatus reads its own copy through next-intl
<PaletteStatus isEnabled={isEnabled} isError={isError} isFetching={isFetching} total={total} />
```

**Keep props when:**

- The data comes from a `.map` (`<PlayerCard player={player} rank={index + 1} />`).
- It is the orchestrator's UI state (`open` on `MobileNav`).
- A callback needs the parent's context.

---

## 18. Server routes — NestJS

The server app is NestJS 11 on Bun, not a route-definition framework. What matters from
the client's side:

```text
src/modules/search/
  search.module.ts
  search.controller.ts    ← thin: validate, delegate, return
  search.types.ts
  services/               ← the business logic, one service per domain of work
  dto/                    ← createZodDto(...) wrappers
  lib/                    ← pure functions, one folder per concern
  config/                 ← constants, timeouts, lookup tables
  index.ts                ← the module's public API
```

- DTOs wrap a shared schema: `export class SearchQueryDto extends createZodDto(searchQuerySchema) {}`
  (`nestjs-zod`). The schema itself lives in `@bronevik/schemas`, so client and server
  validate against one definition.
- Domain errors are thrown as the app exceptions from `common/exceptions` with a
  code from `@bronevik/schemas` — `` throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`) ``.
  The client matches on the code, so the message is free text but the code is a
  contract.
- Import from a module's barrel across module boundaries, never into its files.

---

## 19. Forbidden

- `any` — use `unknown`. `ts/consistent-type-assertions` also warns on casts;
  a cast that survives review needs a reason.
- A non-null assertion `!` with no justification.
- Deep imports past a barrel.
- Cross-imports between slices of the same layer.
- CSS-in-JS. SCSS modules only (`cva` maps module classes, it does not style).
- Duplicating a schema between client and server. Only `@bronevik/schemas`.
- `useState` for form fields. Only `react-hook-form`, inside a `use-<x>-form` hook.
- Logic in a component: queries, effects, memoised or derived data, handlers with more
  than one statement. They go to `model/hooks/use-<x>/`.
- `<Name>.helpers.ts`, `<Name>.utils.ts`, `<Name>.constants.ts` or `hooks/` inside a
  component folder (§2). Helpers → `lib/<concern>/`, constants → `config/`.
- Two flat components in one `ui/` root, or two components in one file.
- Mock data layers or fixture fallbacks in app code (§11).
- Prisma migrations before production. The schema is synced with `bun run db:push`
  (`prisma db push` + the Timescale layer); no `prisma migrate` until the first release.
- Nested `if (...) return <X />` across three or more branches. Use
  `ts-pattern`'s `match`.
- Prop-drilling when the leaf can call the hook itself.
- Comments. The code is expected to read on its own; the reasoning belongs in
  CLAUDE.md or the commit message. An `eslint-disable-next-line` carries its reason
  after `--`.
- A user-visible string that does not go through i18n — and it goes into both
  `locales/ru/<namespace>.json` and `locales/en/<namespace>.json`, never one of them.
- `Link`, `useRouter` or `usePathname` from `next/*` — use `@/shared/i18n/navigation`.

---

## 20. Checklist before a commit

```bash
bun run fix        # every autofixer: eslint --fix, prettier, stylelint --fix, prisma format
bun run verify     # typecheck, eslint, prettier --check, stylelint
bun run test       # Vitest across every workspace
```

`bun run test`, never bare `bun test` — Bun's own runner claims that name,
collects the same files and then fails them all, because it is not Vitest.

Tests live in a `_tests/` folder beside what they test
(`shared/lib/rating-tone/_tests/rating-tone.test.ts`); the Playwright specs are in
`e2e/`, and the game mod's Python suite is in `apps/mod/tests/` (`bun run test:mod`).

A change that can break prerendering also needs `bun --filter @bronevik/client build` —
typecheck passes on code that throws during SSR.

`bun run fix` does not fix: hook order (section 10.1) or FSD import boundaries
(→ [`docs/architecture/fsd.md`](../architecture/fsd.md)).
