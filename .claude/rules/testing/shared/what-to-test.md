---
paths:
  - "**/_tests/**/*.{ts,tsx}"
  - "e2e/**/*.spec.ts"
  - "**/vitest.config.*"
  - "playwright.config.ts"
  - "apps/modpack/**/tests/**"
---

<!-- Auto-loaded when editing tests or their configs. Full picture — the root CLAUDE.md. -->

# Tests — what to test

## What to test

A test should catch a regression, not restate the implementation. Every bug fixed by hand is a test that was missing — write it while the failure is still understood.

**Always covered:**

| Kind                         | Why                                                                                   | Example in the repo                                  |
| ---------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Rating math                  | WN8, EFF, MoE projections are what players compare; a silent drift is a public bug    | `packages/ratings/src/**/_tests`                     |
| Parsers and codecs           | Silent data loss between Lesta, the replay format and our schema                      | `apps/server/src/lib/replay`, `apps/server/src/common/lib/json/_tests` |
| Fallback branches            | Lesta error codes, empty pages, a tripped circuit breaker — the paths hit on a bad day | `apps/server/src/lib/lesta/outcome/_tests`        |
| Fair-play guards             | The mod must never serialise other players' data                                      | `apps/modpack/packages/companion/tests/test_payload.py` |
| Signatures and auth handshakes | A wrong HMAC or OpenID check is a security bug, not a cosmetic one                   | `apps/server/src/lib/auth/**/_tests`                    |
| Rules with a threshold       | Schedules, backoff, streaks and diff windows fire for the wrong reason unnoticed       | `apps/server/src/modules/collector/tracking/lib/poll-schedule/_tests`        |
| Contracts between layers     | A schema and its translations drifting apart ships a blank string                      | `apps/client/shared/i18n/messages/_tests`                     |

**Distinguish carefully**, because these are where the bugs actually live: `null` vs `undefined` vs `0` vs `''`; the first render vs a real change (an effect firing on mount is not a user action); the empty collection; the value exactly on a boundary.

**A hook with real logic is worth testing** — `renderHook` from `@testing-library/react` plus `vi.useFakeTimers()` covers timers and counters that no pure function can. Mock the store it depends on, not the logic under test.

**Don't test**: thin wrappers over a library, getters, `index.ts` re-exports, markup with no logic, or that a mock was called with what you just passed it.

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
