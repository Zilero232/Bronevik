# Checklist before a commit

Part of the [style guide](../../README.md).

## 20. Checklist before a commit

```bash
bun run fix        # every autofixer: eslint --fix, prettier, stylelint --fix, prisma format
bun run verify     # typecheck, eslint, prettier --check, stylelint
bun run test       # Vitest across every workspace
```

`bun run test`, never bare `bun test` — Bun's own runner claims that name,
collects the same files and then fails them all, because it is not Vitest.

Tests live in a `_tests/` folder beside what they test
(`shared/lib/rating-tone/_tests/rating-tone.test.ts`); the Playwright specs are in
`e2e/`, and the game modpack's Python suites are in the `tests/` folder of each package under `apps/modpack/` (`bun run test:modpack`).

A change that can break prerendering also needs `bun --filter @otmetki/client build` —
typecheck passes on code that throws during SSR.

`bun run fix` does not fix: hook order ([section 10.1](../client/react.md)) or FSD import boundaries
(→ [`docs/architecture/fsd.md`](../../architecture/fsd.md)).
