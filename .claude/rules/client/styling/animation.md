---
paths:
  - "apps/web/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/styles.md; keep them in sync. -->

# Code style — client: animation

## Animation

`motion` is already a dependency and is the way to animate. Presets shared by
several components live in `shared/lib/motion` (`MOTION`, `MOTION_TRANSITION`,
`MOTION_VARIANTS`); one-off presets go in a sibling `<Component>.motion.ts`. Do not
hand-roll a CSS `transition` for something motion is already driving.

The app sits in `LazyMotion strict` (features load in their own chunk), so render
`m.div` / `m.li` with `import * as m from 'motion/react-m'`, never `motion.div` — strict
mode throws on it.
Animate `transform` and `opacity` only, and nothing on first paint: lists use
`AnimatePresence initial={false}`, and a block that reveals on scroll uses `Reveal`
(it hides only content that mounts below the fold). Page transitions are React
`<ViewTransition>` in the `(site)` layout, triggered by the `page` transition type
the locale `Link` adds; CSS for them lives in `app/globals.scss`.

**Never put `backdrop-filter` under an opaque background.** It composites and
blurs a layer nobody can see through, and a panel that also animates `scale`
then scales that rasterised layer — text arrives visibly soft for the first
frames. Menus, popovers and select lists all sit on `--color-surface-raised`
(`@include popup-surface`), which is opaque, so none of them carry one. The
overlays of `Dialog`, `Drawer` and the command palette, and the translucent
sticky header, are the exceptions and keep their blur: there the page behind
really does show through.

`will-change: transform` goes with that blur, not with the animation. Without a
filter to composite it only pins an extra layer, which is what rasterises the
text. Nothing in the client needs it today.
