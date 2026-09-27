---
paths:
  - "apps/client/app/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/shared/types.md; keep them in sync. -->

# Code style — client: route prop types

## Route prop types

Never hand-write `params`/`searchParams` types in `app/`. Use Next's generated globals (no import): `PageProps<'/[locale]/t/[slug]'>` for pages, metadata and `opengraph-image`; `Pick<PageProps<'…'>, 'params'>` for an inner component that only receives params; `LayoutProps<'…'>` for layouts; `RouteContext<'…'>` for route handlers. Route keys omit route groups. `bun run typecheck` runs `next typegen` first.
