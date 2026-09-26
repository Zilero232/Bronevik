---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/mod/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — Vitest + Playwright + unittest

## Where they live

A unit test goes in a `_tests/` folder next to the file under test, named after it:

```text
packages/ratings/src/eff/
├── eff.ts
├── index.ts
└── _tests/eff.test.ts
```

Not `__tests__`, not a bare test file beside the source, not a separate `tests/` tree at the workspace root. E2E specs live only in the root [e2e/](../../e2e/) with a `.spec.ts` extension.

The one exception is the game mod: `apps/mod/tests/` is a Python `unittest` suite, because the mod's source tree is packed into the `.wotmod` as-is and must not carry tests.

## How it runs

`bun run test` from the repo root — **one** Vitest run across the whole monorepo, wired through `test.projects` in the root [vitest.config.ts](../../vitest.config.ts), which picks up every `apps/*/vitest.config.ts` and `packages/*/vitest.config.ts`. Workspaces carry their own configs (`name`, environment, env); they have no `test` script of their own and don't need one. Never `bun test` — that is Bun's own runner, not Vitest.

E2E — `bun run test:e2e`, two projects (`desktop` + `mobile`). Without `E2E_BASE_URL` the config starts the client dev server itself; CI builds the client and serves the standalone output instead. The client has no mocks and e2e runs without the server app or a database: the smoke aborts every API request and checks that pages render their shell and error states. On Windows, run Playwright through node (`node node_modules/@playwright/test/cli.js test`) if `bunx playwright` hangs.

The mod — `bun run test:mod` (`python -m unittest discover apps/mod/tests`), on Python 3; the pure code is 2/3 compatible.

CI ([.github/workflows/ci.yml](../../.github/workflows/ci.yml)) runs all three.

## Environment

- **client** — jsdom, `@testing-library/react`, setup in [apps/client/vitest.setup.ts](../../apps/client/vitest.setup.ts) (stubs `ResizeObserver`, `IntersectionObserver` and `matchMedia`, mocks `next/navigation` and `next/font/local`, cleans the DOM after each test). Client env is declared in the config — don't read `.env` from a test.
- **server** (API and worker) — node, with a dummy env in the config, legacy decorators with metadata enabled for Nest and `reflect-metadata` loaded by `vitest.setup.ts`. Without the env any import that pulls the Prisma chain fails Zod env validation; adding a required variable means adding it there too. Pure logic stays in `lib/` and tests without Nest; services and processors are tested with `vitest-mock-extended` (`mockDeep<PrismaService>()`, `mock<Queue>()`) — never an `as` cast to fake a collaborator.
- **packages** — node, no env.
- **server `lib/lesta`** — `ioredis-mock` stands in for the shared rate-limit bucket. Every `RedisMock` instance shares one in-memory store across files (`isolate: false`), so the server's `vitest.setup.ts` flushes it before every test; a test that needs Redis state sets it up inside the test, not in `beforeAll`.

## What to test

A test should catch a regression, not restate the implementation. Every bug fixed by hand is a test that was missing — write it while the failure is still understood.

**Always covered:**

| Kind                         | Why                                                                                   | Example in the repo                                  |
| ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Rating math                  | WN8, EFF, MoE projections are what players compare; a silent drift is a public bug    | `packages/ratings/src/**/_tests`                     |
| Parsers and codecs           | Silent data loss between Lesta, the replay format and our schema                      | `apps/server/src/lib/replay`, `apps/server/src/common/lib/json/_tests` |
| Fallback branches            | Lesta error codes, empty pages, a tripped circuit breaker — the paths hit on a bad day | `apps/server/src/lib/lesta/outcome/_tests`        |
| Fair-play guards             | The mod must never serialise other players' data                                      | `apps/mod/tests/test_payload.py`                     |
| Signatures and auth handshakes | A wrong HMAC or OpenID check is a security bug, not a cosmetic one                   | `apps/server/src/lib/auth/**/_tests`                    |
| Rules with a threshold       | Schedules, backoff, streaks and diff windows fire for the wrong reason unnoticed       | `apps/server/src/modules/collector/tracking/lib/poll-schedule/_tests`        |
| Contracts between layers     | A schema and its translations drifting apart ships a blank string                      | `apps/client/shared/i18n/_tests`                     |

**Distinguish carefully**, because these are where the bugs actually live: `null` vs `undefined` vs `0` vs `''`; the first render vs a real change (an effect firing on mount is not a user action); the empty collection; the value exactly on a boundary.

**A hook with real logic is worth testing** — `renderHook` from `@testing-library/react` plus `vi.useFakeTimers()` covers timers and counters that no pure function can. Mock the store it depends on, not the logic under test.

**Don't test**: thin wrappers over a library, getters, `index.ts` re-exports, markup with no logic, or that a mock was called with what you just passed it.

## Style

The no-comments rule for application code applies here too — the `it(...)` name describes behaviour, not mechanics. Write it as a claim about the system: `'returns null when the vehicle has no expected values'`, not `'test 3'` or `'checks the if branch'`.

One `describe` per exported function, one assertion idea per `it`. Shared fixtures go in a constant above `describe`, not in `beforeEach`, when they never mutate.
