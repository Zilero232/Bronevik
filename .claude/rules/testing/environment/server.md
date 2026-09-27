---
paths:
  - "apps/server/**/_tests/**/*.ts"
  - "apps/server/vitest.config.*"
  - "apps/server/vitest.setup.ts"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — server environment

## Environment

- **server** (API and worker) — node, with a dummy env in the config, legacy decorators with metadata enabled for Nest and `reflect-metadata` loaded by `vitest.setup.ts`. Without the env any import that pulls the Prisma chain fails Zod env validation; adding a required variable means adding it there too. Pure logic stays in `lib/` and tests without Nest; services and processors are tested with `vitest-mock-extended` (`mockDeep<PrismaService>()`, `mock<Queue>()`) — never an `as` cast to fake a collaborator. No `vi.mock` of an app module or package a service imports: the server runs with `isolate: false`, so the mock leaks into every file sharing the worker. Wrap the call in an injectable service (`PageCrawlerService`, `TwitchSdkService`, `HostLookupService`, `WebPushSenderService`, `HttpClientService` for plain `ky` calls) or an injectable client (`S3Storage` takes a `client`) and pass `mock<T>()` through the constructor. The same holds for globals and constants: no `vi.stubGlobal('fetch')`, no `vi.spyOn(SomeSdk.prototype, ...)`, no `Reflect.set` on an `as const` config — a flag a test must flip is injected (`SubscriptionService.isCheckoutEnabled`, a `NOTIFICATION_TOKENS` value).

- **server `lib/lesta`** — `ioredis-mock` stands in for the shared rate-limit bucket. Every `RedisMock` instance shares one in-memory store across files (`isolate: false`), so the server's `vitest.setup.ts` flushes it before every test; a test that needs Redis state sets it up inside the test, not in `beforeAll`.
