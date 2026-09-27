---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
  - "**/package.json"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full guide is docs/guides/ (index: docs/guides/README.md); the root CLAUDE.md carries the key rules. Keep them in sync. -->

# Dependencies — the catalog

## Shared versions live in the catalog

A dependency used by more than one workspace is pinned once in
`workspaces.catalog` and referenced as `"remeda": "catalog:"`. Bumping means
editing the catalog, not the packages.
