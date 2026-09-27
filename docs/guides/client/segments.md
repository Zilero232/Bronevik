# The `model/`, `lib/` and `api/` segments

Part of the [style guide](../../README.md).

## 11. The `model/`, `lib/` and `api/` segments

**`model/`** — hooks, context providers, state types.

```text
features/search/command-palette/model/
  hooks/                          ← a group of hooks
    index.ts                      ← the hooks barrel
    use-command-palette-hotkey/   ← use-command-palette-hotkey.ts + index.ts
    use-search-results/           ← use-search-results.ts + .types.ts + index.ts + _tests/
  context/                        ← a subsystem is a folder
    index.ts                      ← barrel: { CommandPaletteProvider, useCommandPalette }
    CommandPaletteProvider.tsx
    command-palette-context.ts
    command-palette-context.types.ts
  (no model/index.ts — the barrel sits on the subfolders)
```

Files are kebab-case. The functions inside them are camelCase.

**A subsystem is a folder.** A provider plus its context and hook (or a hook plus
two or more modules that exist only for it) gets its own folder with an
`index.ts` — `model/context/`, for instance. A slice's hooks and contexts are
grouped into `model/hooks/` and `model/context/` (see the barrel rule below). A
flat `model/` — one or two files, no subfolders — is fine for a small slice
(`entities/player/player/model/player.types.ts`).

**Grouping inside `model/`.** When a slice accumulates many `model` files, group
them into subfolders by nature (`model/context/`, `model/hooks/`) — see
`features/search/command-palette`. That is organisation **inside** the `model/`
segment, not a separate top-level `hooks/` segment (which is forbidden — see below).

**The `model/` barrel rule.** Every `model/` subfolder gets its own `index.ts`
(`model/hooks/index.ts`, `model/context/index.ts`). **Do not create a slice-level
`model/index.ts`.** Importing from outside a subfolder goes through its barrel:

```ts
// ✓ OK
import { useSearchResults } from '../model/hooks';
import { useCommandPalette } from '../model/context';
// the slice index.ts
export { CommandPaletteProvider, useCommandPalette } from './model/context';

// ✗ NOT OK
import { useSearchResults } from '../model/hooks/use-search-results'; // deep, past the barrel
import { useSearchResults } from '../model';                          // model/index does not exist
```

Between files **inside one subfolder**, import by file (`./use-x`, `./x.types`),
never through your own barrel — that is a self-import. A flat `model/` — no
subfolders — needs no barrel at all; import by file.

**Types:**

- Types local to one hook (its input and output, internal unions) live in its
  `use-<x>.types.ts`.
- The slice's public model types — the ones other slices reach through the barrel —
  go in a `model/<name>.types.ts` file (`entities/tank/tank/model/tank.types.ts`).
- A subsystem folder with types of its own gets `model/<subsystem>/<name>.types.ts`
  (`model/context/command-palette-context.types.ts`).

Do not create a separate `types/` or `hooks/` segment. That splits code by the
shape of the file rather than by its nature, which is an FSD anti-pattern.

**`lib/`** — pure functions with no React dependency, one folder per concern:

```text
features/search/command-palette/lib/
  group-results/       ← splits a flat search response into players / tanks / clans
    group-results.ts
    group-results.types.ts
    index.ts
    _tests/group-results.test.ts
shared/lib/
  rating-tone/         ← maps a rating to one of six colour tones
  seeded-random/       ← deterministic PRNG for the daily puzzle
```

A helper used by one component still goes here, never into a `<Name>.helpers.ts` or
`<Name>.utils.ts` beside the component. A project-agnostic helper goes to `shared/lib/`.

A function that returns JSX is a component: move it to `ui/`.

**`config/`** — constants, one file per concern (`config/search.constants.ts`,
`config/player-stats.constants.ts`), re-exported from `config/index.ts`. Every module-level
`as const` object, `DEFAULT_VALUES`, icon map or skeleton row count a component or hook needs
lives here, not at the top of the `.tsx`.

**Choosing between `lib/` and `model/`:** a function that uses React
(`useState`, `useEffect`, a context) belongs in `model/`. A pure one — takes
arguments, returns a value — belongs in `lib/`. Error classes and parsers are
`lib/`. A converter from a server DTO to the shape the UI draws is part of the
API boundary and goes in `api/mappers/<name>/` (FSD's `api` segment is "request
functions, data types, mappers"). A set of settings or constants is `config/`.

**A slice's `api/`** holds the requests the slice owns, one folder per resource,
plus one barrel:

```text
entities/tank/tank/api/
  tanks/          ← tanks.ts + tanks.types.ts + index.ts (+ _tests/)
  route-meta/     ← tankRouteName, topTankSlugs for the app routes
  mappers/<name>/ ← API DTO → UI model converters
  index.ts
```

Where a request goes is decided by who uses it:

- a read several slices need → `entities/<domain>/<slice>/api/` (`getTank`, `getPlayer`, `listMaps`);
- an action several slices trigger → `features/<domain>/<slice>/api/` (favourites, watchlist, notification settings, comments, reports);
- anything one screen alone uses → `views/<view>/api/` (`openTournament`, `createCheckout`), importing its request types from the entity's public API.

The slice's `index.ts` re-exports its `api/`; inside the slice, import `../../../api`.
An entity never imports another entity — two entities that need each other's data
are composed a layer up. Query keys stay in the `QUERY_KEYS` registry in
`shared/constants/query-keys`: invalidation crosses slices, and a registry below
every layer is the one place they may all import.

**`api/` in `shared/`** — infrastructure only, no domain requests:

```text
shared/api/
  http/           ← http.ts (the axios instance) + http.constants.ts, bearer-token/, client-config/, list-param/
  generated/      ← the OpenAPI client (hey-api), never edited by hand
  query-options/  ← re-exports of generated TanStack Query options
  source/         ← fromServer / fromSdk / fromAuth, NotFoundError / UnauthorizedError / PlusRequiredError
  auth/           ← the better-auth client base (auth-client/, telegram-login-client/)
  query-client/
  index.ts
```

HTTP goes through the shared axios instance from `shared/api/http`. A hand-rolled
`fetch` is unnecessary. The response is parsed with the shared schema, so a drifted
contract fails loudly at the boundary (`entities/search/search/api/search/search.ts`):

```ts
export const search = async ({ query, signal }: SearchInput): Promise<SearchResponse> => {
  const trimmed = query.trim();

  if (trimmed.length < SEARCH.minLength) {
    return { query: trimmed, correctedQuery: null, results: [] };
  }

  const { data } = await api.get('/search', { params: { q: trimmed, limit: SEARCH_REQUEST.limit }, signal });

  return searchResponseSchema.parse(data);
};
```

Request and response types come from `@otmetki/schemas` — the same contract
NestJS validates against. The function returns data; errors are thrown, and
React Query catches them.

**No mocks.** No mock data layer, no fixture fallbacks, no fake latency, no
`USE_MOCKS` switch — every request goes to the real server through `fromServer`
(`shared/api/source`). With no data a screen shows its empty state; with the server
down, its error state with a retry. Test doubles in `_tests/` are not this — they
stay in tests.
