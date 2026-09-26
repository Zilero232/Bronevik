---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full guide is docs/guides/style.md; the root CLAUDE.md carries the key rules. Keep them in sync. -->

# Code style — TypeScript

## No comments

The code is expected to read on its own. Application code in `apps/` and
`packages/` has zero comments and stays that way; the reasoning belongs in
CLAUDE.md or the commit message. The exceptions: an `eslint-disable-next-line`
carries its reason after `--`, and tool configs (`eslint.config.mjs`,
`stylelint.config.mjs`) and `.github/**` YAML explain why a rule is bent.

## Two or more parameters → one object

The shape lives in a sibling `*.types.ts` as `<Fn>Input`, so a call site never has
to guess argument order. One-argument functions stay positional.

```ts
search({ query, signal });

// no
search(query, signal);
```

NestJS constructors are not this: injecting collaborators positionally is the
framework's own convention and is used throughout the server app and the collector.

## Arrow bodies and braces — ESLint decides

`arrow-body-style: as-needed`: a function whose body is a single `return` uses an
expression body; a block body only when there are statements. `curly: all`: every
`if`/`else` body goes in `{}`, even a one-liner. `bun lint:fix` rewrites both.

```ts
export const toneOfTier = (tier: RatingTier): RatingTone => TIER_TONE[tier];

if (!context) {
  throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
}
```

## Let the code breathe

A function body reads as paragraphs. Prettier only preserves blank lines and
never inserts them, so `padding-line-between-statements` does it and
`bun lint:fix` applies it.

Blank line between the `const`/`let` setup block and the logic acting on it;
before every `return`/`throw`/`continue`/`break`; around every block (`if`, `for`,
`try`, `switch`) and every **multiline** call. Consecutive one-line statements
stay grouped on purpose. Never two blank lines in a row.

```ts
const trimmed = query.trim();

if (trimmed.length < SEARCH.minLength) {
  return { query: trimmed, correctedQuery: null, results: [] };
}

const { data } = await api.get('/search', { params: { q: trimmed, limit: SEARCH_REQUEST.limit }, signal });

return searchResponseSchema.parse(data);
```

## Reuse over reinvention

Before writing a helper, check whether an installed library covers it:
`@siberiacancode/reactuse` (React hooks), `remeda` (arrays/objects), `ts-pattern`
(typed branching), `date-fns`, `zod`, `motion` (animation), `p-retry`,
`@base-ui/react` (unstyled primitives), `class-variance-authority` (variant maps),
`cmdk`, visx (charts), `@tanstack/react-table` + `@tanstack/react-virtual`,
`lucide-react` + `@otmetki/icons`, `sonner`, `@otmetki/logger` (pino). Within the
monorepo: `@otmetki/ratings` for any rating math, the server's `lib/lesta` for any
Lesta call, `@otmetki/schemas` for any contract.

Only libraries **already declared** in the workspace's `package.json` count. A
transitive dependency used directly is a phantom dependency — it passes locally
through hoisting and fails on a clean CI install.

## Import order

external types → external/builtin values → internal (`@/`) types → internal values →
relative types → relative values → styles → side-effects, a blank line between
groups. `perfectionist/sort-imports` enforces it; `bun lint:fix` sorts.

## Shared versions live in the catalog

A dependency used by more than one workspace is pinned once in
`workspaces.catalog` and referenced as `"remeda": "catalog:"`. Bumping means
editing the catalog, not the packages.

## Folders are one concern, not one function

**Every thing is a folder.** A file that has companions (`x.ts` + `x.types.ts`,
`x.constants.ts`, `x.schemas.ts`, `_tests/`) lives in its own `x/` folder with an
`index.ts`. Nothing lies flat next to another concern: a folder holds its own
concern's files and subfolders, and a second concern gets a second folder. Only
`config/` stays flat — one `<concern>.constants.ts` per concern until one grows a
companion. Shared helper folders are flat, one per concern, hooks prefixed `use-`
(`shared/lib/<concern>/`, `shared/lib/use-<x>/`) — no `hooks/` or `utils/` grouping.

A `lib/<concern>/` or `model/hooks/use-<x>/` folder gets its own `index.ts`,
`<name>.ts`, `<name>.types.ts` where needed and `_tests/`. Related helpers share
one concern folder rather than one folder per function.

Never a `*.helpers.ts`, `*.utils.ts` or `*.constants.ts` beside a component:
helpers go to `lib/<concern>/` (project-agnostic ones to `shared/lib/<concern>/`),
constants to `config/<concern>.constants.ts`. The client's component-folder rules
are in `code-style-client.md`.

## Constants group into objects, and config splits by concern

Values that are read together live in one frozen object rather than side by side
as loose exports. `SEARCH_REQUEST.debounceMs` says which request it belongs to;
`SEARCH_DEBOUNCE_MS` next to eight other flat constants says only that somebody
had a number.

```ts
// no — a file of unrelated exports, and the reader has to hold the prefixes
export const SEARCH_LIMIT = 15;
export const SEARCH_PER_KIND = 5;
export const SEARCH_DEBOUNCE_MS = 180;

// yes
export const SEARCH_REQUEST = {
  limit: 15,
  perKind: 5,
  debounceMs: 180
} as const;
```

A `config/` folder holds one file per concern — `player-lookup.constants.ts`,
`player-stats.constants.ts` in the client (the server keeps `*.config.ts`) — not one `<module>.config.ts` that accumulates
everything the module ever needed. The barrel re-exports them, so a call site
still imports from `../config` and never learns the file names.

Two things stay flat: a single value with no siblings, and a name that is part
of a package's public API, where grouping would rename it for every consumer.

## Tests sit next to what they test

A Vitest suite lives in a `_tests/` folder beside the source, named after it:
`shared/i18n/locale-path/_tests/locale-path.test.ts`. Playwright specs live in
`e2e/`. Only pure logic and components with behaviour are covered — anything
needing a database, Redis or the live Lesta API is verified by running it.

**Assert the relationship, not the business value.** A test that spells out a
WN8 threshold or a piece of copy breaks every time somebody retunes it, and
catches nothing when the logic breaks. Import the constant and compute against
it, or assert the property: `rating-tone.test.ts` walks `RATING_SCALES` and
`RATING_TIERS` from `@otmetki/ratings` and checks that every tier gets a tone,
every tone is used, and a better tier never lands in a lower tone — none of it
changes when a threshold moves.

A test whose two sides both come from the code under test cannot fail. Comparing
a component's default render to the same component rendered with the default
value proves nothing.

`isolate: false` lives in each project's own `vitest.config.ts`, never in the
root one — projects listed by file path do not inherit the root `test` block, so
a setting put there is silently ignored. It is safe because the client's
`vitest.setup.ts` calls `cleanup()` in `afterEach`; a suite that starts leaking
state between files fails under `--sequence.shuffle` before it fails in CI.

## Verify before claiming anything works

`bun run verify` — typecheck, ESLint, Prettier, Stylelint. `bun run test` is
separate; bare `bun test` is Bun's own runner and fails the suite. CI
(`.github/workflows/ci.yml`) runs both on every push and pull request.

Neither catches SSR breakage. `bun --filter @otmetki/client build` is the only
check that does — it is where a page that typechecks but throws during prerender
fails, and where a missing translation key surfaces as `MISSING_MESSAGE`.
