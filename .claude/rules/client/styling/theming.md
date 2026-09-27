---
paths:
  - "apps/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/styles.md; keep them in sync. -->

# Code style — client: theming and tokens

## Theming and tokens

Tokens are CSS variables in `shared/styles/_tokens.scss`: theme-independent ones
on `:root`, the dark palette on `:root, [data-theme='dark']`, the light one on
`[data-theme='light']`. `next-themes` sets `data-theme` (dark by default, no
system detection). A colour token goes into both theme blocks in the same change;
components read tokens and carry no theme-specific code.

Rating colours: `ratingTone({ scale, value })` / `toneOfTier(tier)` from
`@/shared/lib` fold the nine `@otmetki/ratings` tiers into six tones (`bad`,
`below`, `average`, `good`, `great`, `unicum`). The component sets
`data-tone={tone}`; its SCSS uses `@include tone`, which resolves to
`--rating-<tone>`. Reuse that mapping rather than re-deriving one.

Fonts: Tektur (`--font-display`, headings and numbers), Onest (`--font-sans`),
IBM Plex Mono (`--font-mono`, HUD labels), self-hosted via `shared/config/fonts`.
Before re-declaring a look, check `shared/styles/_mixins.scss` — `panel`,
`well`, `label`, `heading`, `numeric`, `popup-surface`, `tone`, `field-box`.
