# Shared schemas

Part of the [style guide](../../README.md).

## 14. Shared schemas — `@otmetki/schemas`

Zod schemas and the types shared between the client and the server app
live in `packages/schemas`.

Each domain is a folder, and a domain wide enough to hold several concerns
splits again — one folder per concern, never one file holding schemas,
constants and functions together:

```text
packages/schemas/src/
  search/                     ← one concern, files by role
    search.constants.ts       ← SEARCH (minLength, maxLength, defaultLimit, maxLimit)
    search.schemas.ts         ← searchQuerySchema, searchResultSchema, searchResponseSchema
    search.types.ts           ← SearchQuery, SearchResult, SearchResponse
    index.ts
    _tests/search.test.ts
  common/                     ← several concerns, one folder each
    period/                   ← recentPeriodSchema, ratingPeriodSchema, …
    primitives/               ← accountIdSchema, clanIdSchema, …
    query/                    ← listParam and query-string helpers
    rating/
    index.ts                  ← re-exports every concern
  players/, tanks/, marks/, clans/, errors/, compare/, …
```

The suffix says what the file holds, so a reader never opens one to find out:
`.schemas.ts` for zod, `.constants.ts` for data, `.types.ts` for inferred types,
`<name>.ts` for functions. A domain barrel re-exports its concerns; the root
barrel re-exports the domains.

The package exposes a single root entry point — import from `@otmetki/schemas`,
not from a subpath:

```ts
// ✓ OK
import type { SearchResponse } from '@otmetki/schemas';

import { searchResponseSchema } from '@otmetki/schemas';

// ✗ NOT OK — a type redeclared on the client
type SearchResponse = { query: string; results: ... };
```

`@/shared/api` exports the axios instance and the query client only; request wrappers are
imported from the slice that owns them.

**Input vs output types.** One Zod schema can yield two types: `.default()`,
`.coerce` and `.transform()` make `z.input` and `z.output` incompatible.
`searchQuerySchema` is such a schema — `limit` is coerced from a query string and
defaults to `SEARCH.defaultLimit`. Where that happens, name them apart:

- `z.input<typeof schema>` is the shape **before** validation — what a form's
  `defaultValues` or a raw query string holds.
- `z.output<typeof schema>` is the shape **after** it, with defaults applied and
  transforms run — what the controller and the service see.

That axis is the validation stage, not HTTP request versus response. An entity's
response type is its own (`SearchResponse`), never the `z.output` of an input schema.

Most schemas have neither a default nor a transform, so a single `z.infer` type
serves both ends.
