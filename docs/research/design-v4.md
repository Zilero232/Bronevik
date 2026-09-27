# Design v4: «Мир танков» colours, textures, iconography (2026-09-27)

Extends [design-v3.md](design-v3.md). The lebwa-like dark base, the type scale and the orange brand accent stay.
The problem v4 solves: orange was the only colour, so every tile, link and chart looked the same.
Orange stays the brand and call-to-action colour. The game palette carries meaning around it.

## 1. Palette extension (`shared/styles/_tokens.scss`, both themes)

Every text-capable token has a contrast of at least 4.5:1 against `--color-surface`, `--color-surface-raised`, `--color-bg` and `--color-band` in its theme. The worst measured pair is `--color-battle` on `--color-surface-hover` in dark: 4.54:1.

| Token | Dark | Light | Meaning |
| --- | --- | --- | --- |
| `--color-armor` / `-deep` / `-soft` | `#a9b56c` / `#3d4a2a` | `#4a5a1a` / `#dfe3c8` | Khaki/olive armour: missions, online, "alive" states, empty-state rings |
| `--color-gold` / `-soft` / `-contrast` | `#e8b84a` | `#855a00` | Premium, Plus, marks of excellence, premium tank names |
| `--gradient-premium(-hover)` | gold 3-stop | gold 3-stop | Plus button and the premium `Button` variant, text `--color-gold-contrast` (≥ 5.8:1) |
| `--color-steel-blue` / `-soft` | `#80a6cc` | `#2c5b85` | Info, versions, builds, the second chart series |
| `--color-battle` / `-soft` | `#f0654f` | `#b02a1c` | Tournaments, PvP, the "enemy" side |
| `--color-brass` | `#caa46c` | `#7a5418` | Codes, rewards, secondary gold |
| `--color-parchment` | `#e6d9b8` | `#6e5a34` | Lore and notes accents (sparingly) |
| `--color-row-hover` | accent 8% over surface | accent 7% over surface | Table row hover, opaque so it also works for sticky cells |
| `--chart-1…6` | accent, steel blue, armour, gold, battle, unicum | same roles | Chart series order |

Nation colours (`--nation-*`, `--nation-*-2`) and class colours (`--class-lt/mt/ht/td/spg/aspg`) from v3 are unchanged. v4 uses them more:
class colour on card edges and garage slots, nation colour in flag backdrops.

**Tones.** The `tone` mixin and `ProgressTone` gain `gold`, `olive`, `sky`, `battle` and `brass` next to `accent`, `steel` and the six rating tones.
Everything that already takes a `tone` picks them up: `KeyFigure`, `Sparkline`, `ProgressBar`, `ChartKit` series, `ActionStrip` links.
`seriesTone({ tone, index })` from `@/shared/lib` gives untoned chart series the game palette in order, so two lines are never both orange.

## 2. Textures (generated SVG, no Lesta art)

The textures are data-URI SVGs in tokens, one per theme: white strokes on dark, black on light, always below 7% opacity.
The `texture($kind)` mixin applies them.

- **Hex grid** (`--texture-hex`, 28×48 tile): tier hex language. Used on raised bands, card stages, KeyFigure tiles, PageHero, the tank garage and the clan header.
- **Camo** (`--texture-camo`, 240×240 tile of four olive blobs at 4.5%) + **metal noise** (`--texture-noise`, `feTurbulence`): used on deep bands, heroes and the ActionStrip tiles.
- **Rivet rule** (`rivet-rule($side)` mixin): a row of 1.5 px dots every 24 px. It marks the top edge of raised bands and the bottom edge of heroes.

`Band` takes `texture` (`hex` | `camo` | `noise` | `none`). The default is `camo` for deep bands and `hex` for raised ones.
`width='full'` lets a section that already has its own shell sit inside a band.
Home alternates the sections: plain, raised hex, plain, deep camo, raised noise, plain, deep camo.

## 3. Imagery

- Tank renders come only from the Lesta API through `TankImage`, at no more than 160 px wide. The showcase card now renders at the native 160 px instead of 240 px.
- Flags are `NationFlag` from `@otmetki/icons` behind renders (`NationBackdrop`), masked radially.
- Map and hangar imagery is limited to what the API returns. There are no stock or Lesta marketing images.
  Heroes get their depth from the canvas `BattleBackdrop` plus the textures above.

## 4. Iconography

- Class icons and silhouettes, crew roles, marks, mastery, modes and nation flags come from `@otmetki/icons`. Generic UI icons come from lucide.
- Tiers are shown as `TierNumeral variant='hex'`, and the hex outline is repeated by the texture and the empty-state art.
- An icon sits in a toned square (tone at 16–18% fill with a 40% inset ring), never bare on a coloured surface. This covers KeyFigure tiles and ActionStrip tiles.
- `EmptyState` (non-compact) draws `EmptyArt`: a hex frame, a dashed olive ring, a heavy-tank silhouette and the state icon in a badge. Compact states keep a single olive icon.
- Display section titles carry a skewed orange/gold bar, echoing the `///` of the logo.

## 5. Chrome

- **Header.** `Плюс` uses the premium gold surface (`premium-surface` mixin, also `Button variant='premium'`).
  `Войти` is a secondary button with an orange-tinted border and an orange icon. The two never look alike again.
- **Home hero.** Stats are `KeyFigure variant='tile'` with an icon and a tone: tracked players are orange with a sparkline, online is olive with a sparkline, the game version is steel blue with the release time.
- **Quick links.** `ActionStrip variant='tiles'` shows each link as a toned tile with an icon, label and hint. On mobile the tiles scroll horizontally with snap; from `3xl` they sit in equal columns.
- **Strong tanks.** The grid has fixed 2 / 3 / 6 columns (base / `xl` / `4xl`) for six cards, so a row never holds a single orphan card.
  The card name sits under the 112 px stage, clamped to two lines with a reserved height, and never overlaps the render.

## 6. Motion

- Only hover lifts (`lift-hover`, −3 px) and colour or border transitions at `--duration-fast`/`--duration-lift`. Textures never animate.
- The canvas `BattleBackdrop` and `TankShowcase3D` keep their own reduced-motion paths.
- Every transform on hover has a `prefers-reduced-motion: reduce` override (`reduced-motion` mixin). Colour changes stay.
