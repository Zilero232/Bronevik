# Slice structure

Part of the [style guide](../../README.md).

## 1. Slice structure

Every slice is a folder of segments. The minimum is `ui/` + `index.ts`:

```text
features/search/command-palette/
  index.ts          ← public API (barrel)
  ui/               ← React components — render only
  model/            ← hooks (state, effects, queries, handlers, forms), contexts, state types
  lib/              ← pure slice utilities, one folder per concern
  api/              ← the slice's requests, api/<resource>/ + api/mappers/<name>/ + index.ts
  config/           ← constants, one file per concern
```

**Components only render.** State, effects, queries, handlers and derived data live in
`model/hooks/`, pure helpers in `lib/<concern>/`, constants in `config/`. The same layout
holds in every slice of every layer (`entities`, `features`, `widgets`, `views`).

**Every thing is a folder.** A file that has companions — `x.ts` with `x.types.ts`,
`x.constants.ts`, `x.schemas.ts` or `_tests/` — lives in its own `x/` folder with an `index.ts`.
Nothing lies flat next to another concern: a folder holds its own concern's files and
subfolders, and a second concern gets a second folder. This holds in `shared/`, `ui-kit`
(a primitive's `Name.constants.ts` stays inside its own component folder), the server's
`common/`, `config/`, `core/` and every package's `src/`. The one flat exception is a
`config/` folder: one `<concern>.constants.ts` per concern until one grows a companion.
`shared/lib` is flat, one folder per concern — helpers `shared/lib/<concern>/`, hooks
`shared/lib/use-<x>/` — with no `hooks/` or `utils/` grouping folder, the same layout
GnomeVPN and Chatovo use.

Slices are grouped by business domain (`features/app`, `features/search`, `features/stats`,
`entities/player`, `entities/tank`) — a layer on top of canonical FSD, see
[`docs/architecture/fsd.md`](../../architecture/fsd.md) §2. Always import down to the slice level:
`@/features/search/command-palette`, not `@/features/search`.
