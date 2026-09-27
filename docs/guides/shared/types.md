# Types

Part of the [style guide](../../README.md).

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
