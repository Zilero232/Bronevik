---
paths:
  - "apps/web/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/component-body.md; keep them in sync. -->

# Code style — client: component body order

## A component body reads top to bottom

Hooks first, then the JSX. Every hook sits above the first `const` that is not
one, so the dependency order is the reading order. Handlers and derived values
come back from the component's model hook rather than being declared here. A pure
single-expression lookup from props or config may stay in the component, after the
hooks (`const Icon = ICONS[kind]`, `const { width } = TANK_IMAGE[size]`); anything
derived in more than one step does not.

```tsx
const t = useTranslations('search');
const { query, setQuery, results, total, isOpen, onOpenChange } = useCommandPaletteView();

return ( ... );
```

The same ordering applies inside a hook: hooks, then derived values, then handlers,
then the returned object. Hooks keep the group order of `docs/guides/client/react.md`
§10.1 (i18n/navigation → context → data → state → ref → memo → effects) unless a
dependency forces otherwise. Query results are destructured where they are read; a
query handed whole to `QueryState` / `ResourceGate` stays an object, and the fields the
hook reads from it are destructured from that object once.

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
