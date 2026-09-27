---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full reasoning is docs/guides/shared/functions.md; keep them in sync. -->

# Code style — TypeScript: arrow bodies and braces

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
