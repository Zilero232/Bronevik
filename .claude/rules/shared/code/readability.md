---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs,py}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS/Python file is edited. -->
<!-- The full reasoning is docs/guides/shared/readability.md; keep them in sync. -->

# Readability

- One idea per line. Split chained conditions/calls into named steps; no clever one-liners.
- A function is steps separated by blank lines (setup, work, result); ≈ 30 lines max, one level of abstraction.
- Guard clauses and early returns; at most three indentation levels inside a function.
- Many branches → a lookup table constant or `ts-pattern`, not an `if` ladder.
- Full-word domain names; booleans as questions (`is_visible`, `canDrag`); no private abbreviations.
- Python lines ≤ 120 characters (translated strings excepted); TS lines follow Prettier.
- Tests: one behaviour each, Arrange – Act – Assert separated by blank lines, one condition per `assert`/`expect` (never `assert a and b`), literal expected values, only through the public interface.
- Delete dead code; prefer a package, the platform or the client API to custom code.
