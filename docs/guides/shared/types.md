# Types

Part of the [style guide](../README.md).

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

### 8.1 Props order

There is no required field order in a Props type or its destructuring; group what
reads well together. **The JSX call site is sorted by ESLint**, not by hand:
`perfectionist/sort-jsx-props` puts shorthand props first, then `key`/`ref`, then the
rest alphabetically, and every `on<Event>` callback last. `bun lint:fix` applies it.

### 8.2 Derive, don't retype

A type that already exists somewhere is derived from it, never written out again: from a
Zod schema (`z.infer`, `z.input`), from Prisma, from the generated API types
(`NonNullable<ClansControllerListData['query']>`), from a library (`typeof
authClient.$Infer.Session['user']`, TanStack `TableOptions<T>['columns']`) or from a
neighbour's type (`Pick<StreamerChallenge, 'amount' | 'currency'>`). A hook's return shape
that other code needs gets a named type in the hook's `.types.ts` rather than
`ReturnType<typeof useX>` threaded through Props ([shared state](../client/drill-cleanup.md)).
