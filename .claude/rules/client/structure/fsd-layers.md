---
paths:
  - "apps/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/architecture/fsd.md; keep them in sync. -->

# Code style — client: FSD layers and public API

Feature-Sliced Design with two local tweaks: `pages` → `views`, and the design
system at the root as `ui-kit`. Slices are grouped by business domain. Imports go
downward only: `app → views → widgets → features → entities → shared`; every
layer may import `@/ui-kit`.

## Public API

Import the slice (`@/features/search/command-palette`), never the domain group
(`@/features/search`) and never past the barrel. The design system has one root
barrel — `@/ui-kit`; primitives live in `atoms/`, `molecules/`, `organisms/`.

`model/` barrels live in subfolders (`model/hooks/index.ts`), never a slice-level
`model/index.ts`.
