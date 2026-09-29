# React conventions

Part of the [style guide](../README.md).

## 10. React conventions

- Function components, arrow functions.
- `'use client'` in every file with hooks, state or event handlers.
- The React Compiler is on — `useMemo`/`useCallback` are not needed for micro-optimisations. Keep them only for a semantically stable ref (`useEffect` dependencies, a key in a Map).
- **`'use no memo'`** opts a component or hook out of the compiler. It is used only where a library hands back a mutable instance the compiler would memoise into staleness: TanStack Table and Virtual (`DataTable` and its parts, `useDataTable`, `useTableVirtualizer`) and three.js / React Three Fiber (the armor viewer and the 3D showcase: meshes, scenes, camera bridges and the hooks that drive them). Don't add it elsewhere without that reason.
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

**Anti-pattern: `useEffect` + `mutate` to load data.** A one-shot action that must run once on arrival (a Telegram sign-in, a referral capture) is not loading data and may fire a mutation from an effect. A mutation object in deps means a new ref every render, which means refetch loops. Declarative loading goes through `useQuery` with a key (`queryKey: QUERY_KEYS.search(debounced)`) — react-query refetches on a key change by itself, and neither `useEffect` nor `reset()` is needed.

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

**A query handed on whole is kept whole too.** `QueryState query={q}` and `ResourceGate query={q}` need the object itself, so a hook that returns the query for them keeps `const query = useQuery(...)`. Whatever the hook itself reads from it is still destructured once, not reached through the dot:

```ts
const query = useInfiniteQuery({ ... });

const { data: feed, fetchNextPage } = query;

return { query, items: feed?.pages.flatMap((page) => page.items) ?? [], loadMore: () => void fetchNextPage() };
```

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

**Function parameters: 2+ arguments → one destructured object.** Positional arguments (especially same-typed ones — `number, number`) are easy to swap by mistake; an object is self-documenting and order stops mattering. A signature a library fixes is exempt — a `useReducer` reducer `(state, action)`, a sort comparator, a TanStack `retry: (failureCount, error)`.

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
