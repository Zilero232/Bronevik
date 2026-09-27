---
paths:
  - "apps/server/**/*.ts"
---

<!-- Compressed editing rules for the server app (API and worker), loaded automatically on edit. -->
<!-- Server specifics in apps/server/CLAUDE.md; module shape in docs/guides/server/nestjs.md. Keep them in sync. -->

# Code style — server: what goes beside a service

## Nothing but the class in a service or controller file

| What                               | Where                                                       |
| ---------------------------------- | ----------------------------------------------------------- |
| Constants, timeouts, lookup tables | `config/<concern>.constants.ts`; a lib's own tunables in `lib/<name>/<name>.constants.ts` |
| Pure domain logic                  | `lib/<name>/` — one folder per **concern**, tested there    |
| Row / payload → DTO converters     | `mappers/<name>/` — every `to*View` / `to*Dto`               |
| Prisma `select` / `include`        | `selects/<name>/` with its `GetPayload` type                 |
| Standalone raw-SQL builders        | `queries/<name>/` (`Prisma.sql` fragments)                    |
| Guards, decorators, interceptors   | `guards/`, `decorators/`, `interceptors/`, one folder each    |
| Custom providers, queue handles    | `providers/<name>.provider.ts`                              |
| Types                              | `x.types.ts` next to the file that owns them                |

Every item is its own folder (`<name>.ts` + `.types.ts` + `index.ts` + `_tests/`) and every
segment has an `index.ts` barrel. A file that mixes a mapper with domain logic is split:
`tanks/lib/vehicle-sources` keeps `rewardMissions`, `tanks/mappers/vehicle-source-view`
takes `toVehicleSourceView`. The same folder rule holds in `common/`, `config/` and
`core/` (`config/cors/`, `config/env/`, `config/lesta-mock/`, `core/prisma/lib/advisory-lock/`).

Import from a module's barrel across boundaries, never reach into its files.
Inside a module, relative paths are fine.

Nest resolves providers from decorator metadata, so **no `import type` for
injected classes** — the `otmetki/server` ESLint block turns
`ts/consistent-type-imports` off for the server app.
