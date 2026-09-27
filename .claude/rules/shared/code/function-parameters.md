---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/types.md; keep them in sync. -->

# Code style — TypeScript: parameters

## Two or more parameters → one object

The shape lives in a sibling `*.types.ts` as `<Fn>Input`, so a call site never has
to guess argument order. One-argument functions stay positional.

```ts
search({ query, signal });

// no
search(query, signal);
```

NestJS constructors are not this: injecting collaborators positionally is the
framework's own convention and is used throughout the server app and the collector.
