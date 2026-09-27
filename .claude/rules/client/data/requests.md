---
paths:
  - "apps/web/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/segments.md; keep them in sync. -->

# Code style — client: requests

## Requests live in their slice

`shared/api` is infrastructure only: `http/`, `generated/` (hey-api client, types and
`zod.gen.ts` schemas), `openapi/` (the spec they are generated from), `query-options/`,
`source/` (+ `source/errors/`), `auth/` (client base), `query-client/`,
`prefetch-state/` (server prefetch into a dehydrated query state). A read several slices need →
`entities/<d>/<s>/api/<resource>/`; an action several slices trigger →
`features/<d>/<s>/api/<resource>/`; a request one screen alone uses →
`views/<v>/api/<resource>/`. The slice barrel re-exports it; inside the slice import
`../../../api`. Query keys stay in `QUERY_KEYS` (`@/shared/constants`), because
invalidation crosses slices. `ROUTES` is nested per page family
(`ROUTES.tanks.detail(slug)`, `ROUTES.account.overview`, `ROUTES.auth.login`).
