# Server routes — NestJS

Part of the [style guide](../../README.md).

## 18. Server routes — NestJS

The server app is NestJS 11 on Bun, not a route-definition framework. What matters from
the client's side:

```text
src/modules/search/
  search.module.ts
  search.controller.ts    ← thin: validate, delegate, return
  search.types.ts
  services/               ← the business logic, one service per domain of work
  dto/                    ← createZodDto(...) wrappers
  mappers/<name>/         ← DB row / Prisma payload / Lesta payload → DTO (every to*View)
  selects/<name>/         ← Prisma select / include constants and their payload types
  queries/<name>/         ← standalone raw-SQL builders (Prisma.sql)
  lib/<concern>/          ← pure domain logic only
  guards/ decorators/ interceptors/ processors/ schedules/  ← Nest kinds, one folder each
  config/                 ← constants, timeouts, lookup tables
  index.ts                ← the module's public API
```

- DTOs wrap a shared schema: `export class SearchQueryDto extends createZodDto(searchQuerySchema) {}`
  (`nestjs-zod`). The schema itself lives in `@otmetki/schemas`, so client and server
  validate against one definition.
- Domain errors are thrown as the app exceptions from `common/exceptions` with a
  code from `@otmetki/schemas` — `` throw new AppNotFoundException('CLAN_NOT_FOUND', `No clan with id ${clanId}`) ``.
  The client matches on the code, so the message is free text but the code is a
  contract.
- Import from a module's barrel across module boundaries, never into its files.
