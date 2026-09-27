# Component body order

Part of the [style guide](../../README.md).

## 13.5. A component body reads top to bottom

A component is **hooks, then the JSX** — its handlers and derived values come from its
model hook ([§2](slice-ui.md)). Inside that hook the order is fixed: **hooks, then derived values, then
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

**Pure lookups may stay in the component.** A single expression that reads one value
from props or config — `const Icon = ICONS[kind]`, `const { width, height } = TANK_IMAGE[size]`,
one helper call destructured — sits after the hooks. A hook per lookup would be ceremony.
What goes back to the model hook is derivation in several steps: values that feed each
other, formatting, filtering, geometry.
