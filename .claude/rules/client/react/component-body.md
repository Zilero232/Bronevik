---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/component-body.md; keep them in sync. -->

# Code style — client: component body order

## A component body reads top to bottom

Hooks first, then the JSX. Every hook sits above the first `const` that is not
one, so the dependency order is the reading order. Handlers and derived values
come back from the component's model hook rather than being declared here.

```tsx
const t = useTranslations('search');
const { query, setQuery, results, total, isOpen, onOpenChange } = useCommandPaletteView();

return ( ... );
```

The same ordering applies inside a hook: hooks, then derived values, then handlers,
then the returned object.

React already forbids a conditional hook; this keeps them visually grouped too,
so a hook added later cannot drift below a branch by accident.

Two shapes legitimately sit between hooks and stay where they are:

- **A ref sync** — `onEventRef.current = onEvent;` between the `useRef` that
  holds it and the `useEffect` that reads it. It has to run on every render,
  before the effect, which is the whole point of the pattern.
- **A value a later hook consumes** — when the expression is only an argument,
  inline it into the hook call. When inlining it would be unreadable, leave the
  `const` where it is: the rule orders declarations, it does not ask you to
  hide a dependency.
