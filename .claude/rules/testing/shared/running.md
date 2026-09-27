---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/game/modpack/**/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — how they run

## How it runs

`bun run test` from the repo root — **one** Vitest run across the whole monorepo, wired through `test.projects` in the root [vitest.config.ts](../../../../vitest.config.ts), which picks up every `apps/web/*/vitest.config.ts`, `apps/game/*/vitest.config.ts` and `packages/*/vitest.config.ts`. Workspaces carry their own configs (`name`, environment, env); they have no `test` script of their own and don't need one. Never `bun test` — that is Bun's own runner, not Vitest.

E2E — `bun run test:e2e`, two projects (`desktop` + `mobile`). Without `E2E_BASE_URL` the config starts the client dev server itself; CI builds the client and serves the standalone output instead. The client has no mocks and e2e runs without the server app or a database: the smoke aborts every API request and checks that pages render their shell and error states. On Windows, run Playwright through node (`node node_modules/@playwright/test/cli.js test`) if `bunx playwright` hangs.

The manual deploy workflow ([.github/workflows/deploy.yml](../../../../.github/workflows/deploy.yml)) runs all three before it builds any image; there is no per-push CI.

The modpack suite (`bun run test:modpack`) is described in `modpack/tests.md`.

`isolate: false` lives in each project's own `vitest.config.ts`, never in the
root one — projects listed by file path do not inherit the root `test` block, so
a setting put there is silently ignored. It is safe because the client's
`vitest.setup.ts` calls `cleanup()` in `afterEach`; a suite that starts leaking
state between files fails under `--sequence.shuffle` before it fails in CI.
