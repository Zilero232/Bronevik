---
paths:
  - "apps/web/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/styles.md; keep them in sync. -->

# Code style — client: theming and tokens

## Theming and tokens

Token values live in `@otmetki/design-tokens` (`packages/design-tokens/scss`, SCSS maps per
concern: colours per theme, scale, motion, palette, surfaces, textures, rating palettes) and are
emitted as CSS variables by `shared/styles/_tokens.scss`: theme-independent ones on `:root`, the
dark palette on `:root, [data-theme='dark']`, the light one on `[data-theme='light']`. Layout
tokens that only the site has (shell, header, rows, z-index, safe areas, font stacks) stay in
`_tokens.scss`. `next-themes` sets `data-theme` (dark by default, no
system detection). A colour token goes into both theme maps (`colors.$dark` and `$light`) in the same change;
components read tokens and carry no theme-specific code. No literal colour in a
component's SCSS: a translucent variant is `color-mix(in srgb, var(--token) N%, transparent)`,
a scrim over imagery uses `--color-shade`, text on imagery `--color-on-media` (both
theme-independent), and a surface tint follows the theme through `--color-bg-deep` /
`--color-bg`. `#000` inside a `mask-image` gradient is an alpha mask, not a colour.

Rating colours: `ratingTone({ scale, value })` / `toneOfTier(tier)` from
`@/shared/lib` fold the nine `@otmetki/ratings` tiers into six tones (`bad`,
`below`, `average`, `good`, `great`, `unicum`). The component sets
`data-tone={tone}`; its SCSS uses `@include tone`, which resolves to
`--rating-<tone>`. Reuse that mapping rather than re-deriving one.

Fonts: Fira Sans Condensed (`--font-display`, headings and numbers), Fira Sans
(`--font-sans`), JetBrains Mono (`--font-mono`, HUD labels), loaded through
`next/font/google` in `shared/config/fonts`.
Before re-declaring a look, check `shared/styles/_mixins.scss` — `panel`,
`well`, `label`, `heading`, `numeric`, `popup-surface`, `tone`, `field-box`.
