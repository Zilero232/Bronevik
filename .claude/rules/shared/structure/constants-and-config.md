---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full guide is docs/guides/ (index: docs/guides/README.md); the root CLAUDE.md carries the key rules. Keep them in sync. -->

# Structure — constants and config

## Constants group into objects, and config splits by concern

Values that are read together live in one frozen object rather than side by side
as loose exports. `SEARCH_REQUEST.debounceMs` says which request it belongs to;
`SEARCH_DEBOUNCE_MS` next to eight other flat constants says only that somebody
had a number.

```ts
// no — a file of unrelated exports, and the reader has to hold the prefixes
export const SEARCH_LIMIT = 15;
export const SEARCH_PER_KIND = 5;
export const SEARCH_DEBOUNCE_MS = 180;

// yes
export const SEARCH_REQUEST = {
  limit: 15,
  perKind: 5,
  debounceMs: 180
} as const;
```

A `config/` folder holds one file per concern — `player-lookup.constants.ts`,
`player-stats.constants.ts` in the client (the server keeps `*.config.ts`) — not one `<module>.config.ts` that accumulates
everything the module ever needed. The barrel re-exports them, so a call site
still imports from `../config` and never learns the file names.

Two things stay flat: a single value with no siblings, and a name that is part
of a package's public API, where grouping would rename it for every consumer.
