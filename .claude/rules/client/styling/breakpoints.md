---
paths:
  - "apps/client/**/*.scss"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/client/styles.md; keep them in sync. -->

# Code style — client: breakpoints

## Breakpoints

Nine steps in `shared/styles/_breakpoints.scss` — `xs` 420, `sm` 520, `md` 560,
`lg` 640, `wide` 700, `xl` 760, `2xl` 900, `3xl` 1100, `4xl` 1280 — used as
`@include below(md)` / `@include from(2xl)` and forwarded by
`shared/styles/mixins`. Never write a raw `@media (width <= 620px)`: add a step to
the map instead.

Rounding a `below()` up degrades early and is safe; rounding a `from()` up takes
a layout away from every viewport in between. `wide` exists for exactly that.
