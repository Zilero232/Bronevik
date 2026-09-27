# Styles and SCSS

Part of the [style guide](../../README.md).

## 3. Styles: SCSS modules only

| Layer                      | Format                                                           |
| -------------------------- | ---------------------------------------------------------------- |
| `ui-kit/**`                | `*.module.scss` + CSS variables from `shared/styles/_tokens.scss` (values: `@otmetki/design-tokens`) |
| widgets / features / views | `*.module.scss`                                                  |

There is no CSS-in-JS in this project — no Tailwind, no `.styles.ts`. `class-variance-authority`
is allowed, but only as a map from variant props to **module classes** (`Button.variants.ts`);
the styles themselves stay in SCSS.

| Case                            | Where                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------- |
| Component styles in `ui-kit`    | `<Name>.module.scss`                                                                      |
| Styles for a slice subcomponent | `<Name>.module.scss` next to it                                                           |
| Conditional classes             | `clsx(s.root, s[tone], className)` or a `data-*` attribute styled in SCSS                 |
| Primitive variants/sizes        | a `cva` map in `<Name>.variants.ts` (`Button.variants.ts`)                                |
| Rating colour                   | `data-tone={ratingTone(...)}` + `@include tone` from `shared/styles/mixins` ([§12](styles.md))         |
| Animation                       | `motion` + presets in `<Name>.motion.ts`, shared ones in `shared/lib/motion`              |
| Media query                     | `@include below(md)` / `@include from(2xl)` from `shared/styles/mixins` — never raw pixels |

Joining module classes with an optional `className` prop is done with **`clsx`** (`import { clsx } from 'clsx'`).

The principle: the JSX reads, and `s.root`/`s.head` tell you the structure.

---

## 12. Global styles and SCSS

- **Design tokens** are CSS variables emitted by `shared/styles/_tokens.scss`, pulled in once by
  `app/globals.scss`. Their values — type scale, spacing, radii, durations, easings, colours,
  elevations, textures and the rating palettes — live in `@otmetki/design-tokens`
  (`packages/design-tokens`, also used by the modpack's Gameface window); z-index, safe-area
  insets, font stacks and the shell/header/row sizes are the site's own and stay in `_tokens.scss`. `shared/styles/` also
  holds `_animations.scss`, `_breakpoints.scss` and `_mixins.scss`.
- **Two themes, dark and light.** Theme-independent tokens sit on `:root`; the dark palette
  on `:root, [data-theme='dark']`; the light palette on `[data-theme='light']`. `next-themes`
  (`ThemeProvider` in `app/providers/AppProviders.tsx`) writes the `data-theme` attribute —
  dark by default, no system detection, persisted under `STORAGE_KEYS.theme`. A colour
  token added to one theme block is added to the other in the same change. Components read
  tokens (`var(--color-surface)`), never a hard-coded colour, so they follow the theme with
  no theme-specific code.
- **Fonts** are self-hosted through `next/font/local` in `shared/config/fonts`: **Tektur**
  for display and numbers (`--font-display`), **Onest** for body text (`--font-sans`),
  **IBM Plex Mono** for HUD labels (`--font-mono`).
- **Rating colours** come from one mapping. `@otmetki/ratings` defines nine canonical tiers
  (`very_bad` … `super_unicum`); `shared/lib/rating-tone` folds them into six colour tones —
  `bad`, `below`, `average`, `good`, `great`, `unicum` — through `ratingTone({ scale, value })`
  or `toneOfTier(tier)`. A component sets `data-tone={tone}` and its SCSS uses
  `@include tone`, which resolves `--tone` to `var(--rating-<tone>)` (`ProgressBar`,
  `ProgressRing`, `KeyFigure`, `Sparkline`, the charts). Reuse that mapping rather than re-deriving one.
- **Mixins** (`@use '@/shared/styles/mixins' as *`) carry the shared visual language:
  `panel` / `well` (bordered surfaces), `label`, `heading`, `numeric`, `field-box`,
  `popup-surface`, `popup-motion`, `tone`, `data-list-row`, `icon-button`,
  `focus-ring`, `reset-button`, `shell`. Reach for one before re-declaring its rules. The
  `@/` import works because `next.config.ts` sets `sassOptions.loadPaths` to the client
  root and aliases `@` for Turbopack.
- **Breakpoints** come from the scale in `_breakpoints.scss` — `xs` 420, `sm` 520, `md` 560,
  `lg` 640, `wide` 700, `xl` 760, `2xl` 900, `3xl` 1100, `4xl` 1280 — used as
  `@include below(md)` / `@include from(2xl)`, never a hand-written `@media (width <= 620px)`.
  An unknown name fails the Sass build.
- `clsx` joins a module class with an incoming `className` prop.

**Property order is enforced.** Stylelint runs
`stylelint-config-idiomatic-order`, so a declaration out of order is an error,
not a warning — `bun run lint:css:fix` sorts it.
