# Design v3: data-rich, but alive (2026-09-26)

Status: spec for implementing agents. It supersedes the **visual** parts of `design-v2.md` §1, §4, §5 and §8: tokens, surfaces, page heads and page layouts. These parts of v2 still apply unchanged:
- the legal rules (§2 "Never" column, §3 API content table)
- the copy rules (§9)
- the slop deletion list (§10)
- the SSR "first paint complete" rule (§1.6)

The rules in `visual-language.md` §1–§4 and `lesta-api.md` also still apply.

**User feedback that triggered v3.** "The design (UX and UI) became sadder, everything is very monotonous. Look at Левша's site (lebwa.tv), it's prettier." The user then attached two lebwa.tv screenshots as the target look: "примерно так можно сделать и такие цвета" and "такие странички сборки танков".

**Inputs used**
- **Primary reference.** The user's two screenshots, copied to `…\scratchpad\shots\design-v3\refs\`:
  - `lebwa-blog.png`: the blog page (chrome, hero banner, card grid, sidebar)
  - `lebwa-build-champion.png`: «Как собрать танк» for the Champion
- **Secondary references** (tanks.gg, blitzkit.app, tomato.gg, op.gg, mobalytics.gg, dotabuff / Dota Plus, wotexpress, tanki.su). These come from domain knowledge **[K]**, not from fresh captures. The user asked for a quick delivery, so no crawl was done. Items that need a live look are marked **[verify]**.
- **Our site was audited from the source, not from screenshots.** The user asked not to run builds or servers. The first attempt at local captures failed anyway: pages blocked on `networkidle` for over 90 s, then the dev server died. All dev servers started for this pass were stopped. File references below are relative to `apps/web/client/`.
- **A data fact found along the way.** The local DB has 1028 vehicles, and every row has `vehicle.images = NULL`. Every tank render on the local site therefore falls back to a glyph, which makes the site look even emptier than it is. See WP-0.

---

## 0. Diagnosis: why ours feels monotonous

v2 stripped the fake-HUD decoration correctly. It then kept only **one** recipe for everything: one surface, one header, one panel, one type size. The result is correct but flat. These are the specific causes, from the code:

1. **Every page opens the same way.**
   - `ui-kit/organisms/PageHeader` is the head of home (`views/home/ui/components/HomeHead`) and of nearly every list page.
   - It is a left-aligned 28 px uppercase title (`--text-3xl`) plus a muted 13 px description.
   - It has no background, no image, no colour and no page identity.
   - The tank page (`views/tank/ui/components/TankGarage`) uses the same 28 px `heading` mixin for the tank name.
   - As a result, `/`, `/tanks`, `/marks`, `/top`, `/clans`, `/codes` and `/events` are indistinguishable at a glance.
2. **One surface recipe for every block.**
   - Every block uses `@mixin panel` (`shared/styles/_mixins.scss`): 1 px border, 2 px radius, the same `--panel-gradient`, and a `Card` header bar 36 px tall with an 11 px label.
   - The whole surface ramp spans `#121410 → #20231e`, about 4 % luminance, with an olive-grey tint that desaturates everything next to it.
   - There is no elevation, no band, no "hero" surface and no media surface.
3. **Layouts are grids of equal boxes.**
   - Home is `PageHeader`, then a strip, then **three equal tables** (`HomePage.module.scss` `.tables`), then **two equal panels**.
   - The tank page (`views/tank/ui/TankPage.tsx`) stacks 11 sections in the same panel style, in pairs of equal halves.
   - Nothing alternates: no full-bleed band, no asymmetric split, no media-left/text-right section. Every section has the same 32 px gap (`--gap-section`) inside the same 1360 px shell.
4. **The type scale is compressed.**
   - The largest text token is 28 px, and the largest number token is 40 px (`--num-xl`, rarely used).
   - Labels (11 px) and titles (28 px) are only 2.5× apart. lebwa's hero title is about 44 px against 12 px breadcrumbs (3.7×), and its tank name about 44 px against 11 px path.
   - With the whole site in uppercase condensed at small sizes, nothing leads the eye.
5. **Colour carries almost no meaning.**
   - The accent `#e8762d` is limited by v2 §1.4 to state: a 2 px underline, a focus ring, the active chip.
   - Class, tier and nation are not colour-coded, except a 22 % nation tint on `TankSlot`. Rating colours only appear in rating cells.
   - So 95 % of pixels are grey or olive, and the orange is so sparse it reads as a bug, not a brand.
6. **Imagery is tiny or absent.**
   - Tank renders appear only in `TankHeroImage` and `TankSlot`, and locally not at all (see "A data fact found along the way").
   - `entities/tank/build/ui/GameIcon` returns `null` when an image is missing, so equipment, skill and field-mod slots become empty squares.
   - There are no card images anywhere: codes, events, missions, streamers and plus are all text rows.
7. **Motion is almost nil.**
   - Everything uses `--duration-fast` 0.1 s border-colour changes.
   - `AnimatedNumber`, `ProgressRing`, `AnimatedMarkOfExcellence` and `AnimatedMastery` already exist (`ui-kit/atoms`, `@otmetki/icons`), but `ProgressRing` is used only on `/design`, and the others are barely used.
   - Nothing lifts, slides or counts.
8. **The site looks like a spreadsheet.**
   - `DataTable` is the main building block of most pages. Tables are right for data, but a page made of only tables reads as an admin panel.
   - Players expect showcase moments: a tank on a flag, a big win-rate number, a ring filling toward the third mark, a medal grid.

**In one sentence:** v2 was right to make the data the content. v3 has to **stage** that content. Staging means:
- a hero per page, built from game data
- two or three surface depths plus full-bleed bands
- a real type scale
- colour coding for class, tier, nation, rating and equipment category
- a bold orange brand accent
- cards with imagery
- small meaningful motion

---

## 1. Principles for v3

1. **Stage the data.** Each page has one showcase moment in its hero, a tank or a number or a medal. Below it comes the dense data. The pattern is dense but framed, the way lebwa frames stats around the tank.
2. **Three depths plus bands.** Page background → card → raised element, plus full-bleed **bands** (darker `--band`) that break the page into chapters. Every page alternates at least once between a shell section and a band section.
3. **The brand accent is loud and scarce.** Orange goes on:
   - primary buttons (solid)
   - the active nav item
   - label plates on cards
   - active tab underlines
   - the current selection outline
   - one key number per hero

   This replaces v2's "accent = state only" rule. It stays one accent: no second brand colour and no glows.
4. **Colour codes meaning.**
   - Class, tier, nation, rating and equipment category each get a fixed palette (§3.3).
   - Colour always comes with a glyph or text, never alone.
5. **Game art only from the API or our own drawings.**
   - API: tank renders, provision, skill and achievement images, clan emblems.
   - Ours: `@otmetki/icons` (nation flags, class glyphs, marks, mastery).
   - Never: Lesta textures, game-file art, lebwa assets, MTSans, or Lesta's cream `#F9F5E1` / amber `#FAB81B` / red-orange `#F25322`.
6. **Scale contrast.**
   - Heroes use 40–56 px condensed titles and 32–48 px key numbers.
   - Body text stays 14 px and labels 11–12 px.
   - Each screen has a clear largest item.
7. **Motion explains change.** Hover lift on clickable cards, a sliding tab indicator, number tweens on data change, ring fills on first view. Everything else is still. `prefers-reduced-motion` turns all of it into instant state changes.
8. **Still not AI slop.** None of these:
   - gradient text
   - glowing borders
   - animated background blobs
   - fake terminals, radars or tracers
   - "live" pulsing dots on static data
   - emoji
   - generic 3-column feature grids with lucide icons in circles
   - marketing slogans

   Richness comes from **real content**: tanks, flags, numbers, medals, emblems.

---

## 2. Reference analysis: what makes them attractive

### 2.1 lebwa.tv (primary, from the user's screenshots)

**Chrome** (`lebwa-blog.png`):
- A thin **utility bar**, about 34 px on near-black `#111`. It holds small uppercase icon+text links (download modpack, build a tank, tanks for LBZ, marks, masters). One of them is highlighted in yellow (a sponsor).
- A **main header**, about 64 px on `#232326`:
  - wordmark on the left
  - bold condensed uppercase nav (16 px, white, active item orange, an "ОНЛАЙН⁶" counter as a superscript)
  - a burger
  - a solid orange «ВОЙТИ» button on the right
- A **page hero band**, about 220 px, full-bleed:
  - background: a blurred and darkened game illustration
  - a 44 px sentence-case bold title on the left
  - breadcrumbs under it, with the current crumb in orange
- A **social / actions strip**, about 76 px, on a band a bit lighter than the page:
  - 12 round coloured brand icons on the left
  - one orange CTA and two outline icon buttons on the right
- **Content** on a `#1f1f22`-ish page with a faint dark gradient at the top:
  - a 3-column card grid, each card with a big image (about 300×370)
  - an **orange label plate** anchored bottom-left on each image: bold white title plus a small secondary line with an icon
  - a right **sidebar**: a dark card holding an icon list (icon plus bold 14 px label), and under it a full-width solid orange button

**Why it works:**
- a big photo per card
- the orange plate repeats as a strong rhythm
- the hero title is large
- the dark bands separate chapters
- the nav is confident and heavy
- one colour does all the brand work

**Build page** (`lebwa-build-champion.png`):
- A **source toggle** at the top centre: «СОВЕТ ОТ LEBWA.TV» (orange, underlined) *или* «А ЧТО СТАВЯТ ИГРОКИ?» (white).
- The **centre stage**:
  - the tank render, large, over a huge faded national flag
  - a small uppercase eyebrow «КАК СОБРАТЬ ТАНК»
  - the tank name in 44 px bold condensed, cream-white
  - a breadcrumb: nation › class › tier (Roman)
- **Field modifications** arranged *around* the tank:
  - pairs of square tiles (about 120 px) with blueprint-style art (their assets, which we can't use)
  - a **hexagonal Roman tier badge** (II, IV, V, VI, VII, VIII) straddling the top edge of each pair
  - the chosen tile outlined in orange-gold
- **«Статистика за последние 30 дней»**: a two-column `label … value` list, 13 px, bold right-aligned values: Побед 49.84 %, Ср. урон, Мастер, Отметка, Ср. фрагов, Ср. обнаружил, Ср. блок. урон, Ср. пробитий.
- The **crew band**, a black full-bleed band with four columns:
  - a crew portrait plus an orange role label (КОМАНДИР, МЕХАНИК-ВОДИТЕЛЬ, НАВОДЧИК, ЗАРЯЖАЮЩИЙ)
  - a numbered list of 7 skills, each with a small skill icon
- **Equipment**, four columns:
  - ШТАТНОЕ / + ТРОФЕЙНОЕ / + БОНОВОЕ / + ЭКСПЕРИМЕНТАЛЬНОЕ
  - each column has «Основная комплектация» and «Альтернативная комплектация» rows: 3 tiles | 1 tile
  - tile backgrounds are colour-coded by category: neutral grey, magenta-crimson, violet, and dark green for the 4th slot, with small chevron badges top-left for upgraded items

**Why it works:**
- the tank is the hero
- the data is arranged spatially around it (a radial composition, not a list)
- colour-coded tiles make categories scannable
- the black crew band gives rhythm
- every item has an icon

### 2.2 Secondary references [K]

| Site | Attractive because | We take |
|---|---|---|
| **tanks.gg** | Tank page hero: render on a faded nation flag, class glyph + Roman tier; dense `stat-line` rows with bold highlighted rows; class colours as a community convention; tier tabs | Nation-flag stage, highlighted stat rows, class colour bar |
| **blitzkit.app** | Big render showcase; tank cards with a nation-colour gradient background and the render breaking the card edge; segmented filters made of **icons** (tier numerals, class glyphs, nation flags); smooth tab slides | `TankShowcaseCard`, `IconFilter` segmented control, tab slide |
| **tomato.gg** | Rating-coloured cells everywhere; KPI cards with a big number and a sparkline; chart cards with a soft area fill | `StatHighlight` with sparkline, area-chart styling |
| **op.gg** | Profile header on a blurred splash-art backdrop; a big rank emblem; match rows **tinted** blue/red by result; win-rate bars inside cells | Row tint by outcome (win / loss, above / below average), in-cell bars |
| **mobalytics.gg** | Strong card hierarchy: a gradient-bordered "hero" card, per-role colour, radar charts, progress to next rank | Radar for the tank profile, progress-to-next visuals |
| **dotabuff / Dota Plus** | Hero page banner with portrait; tier-coloured badges; tables with tiny inline bars; Plus hero levels as emblem tiers with progress | Inline bars, tier-badge ladder, marks progress rings |
| **wotexpress** | News portal: big cover images, category plates, a date ribbon | Image cards with category plate (news, events) |
| **tanki.su** | Hero carousels with big art and condensed uppercase titles | Don't copy anything visual; it's Lesta's own brand |

**Common denominators:**
- one strong hero per page
- colour-coded entities
- icon-driven filters
- cards with media
- full-bleed bands
- inline data-viz (bars, rings, sparklines)
- confident big numbers

---

## 3. Tokens (`shared/styles/_tokens.scss`)

### 3.1 Surfaces and elevation (dark, default)

Neutral graphite, no olive cast. This replaces the `#121410…#20231e` ramp.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#18181b` | Page |
| `--color-bg-deep` / new `--color-band` | `#0e0e10` | Full-bleed bands (crew band, utility bar, footer) |
| `--color-band-raised` (new) | `#202024` | Action strip under the hero, secondary bands |
| `--color-surface` | `#1f1f23` | Cards, panels |
| `--color-surface-raised` | `#27272c` | Card headers, raised tiles, popovers |
| `--color-surface-overlay` (new) | `#2f2f35` | Hover on raised items, selected rows |
| `--color-surface-sunken` | `#141417` | Inputs, wells, table header |
| `--color-surface-hover` | `#2a2a30` | Row hover |
| `--color-border` | `#2c2c32` | Hairlines |
| `--color-border-strong` | `#3a3a42` | Card outlines, tile outlines |
| `--color-text` | `#f2f2f3` | Primary text |
| `--color-text-muted` | `#a3a3ad` | Secondary text (7.3:1 on surface) |
| `--color-text-dim` | `#74747e` | Tertiary text and meta only (≥ 3.9:1; never for essential text) |
| `--elev-1` (new) | `0 1px 0 rgb(255 255 255 / 4%) inset, 0 1px 2px rgb(0 0 0 / 40%)` | Cards |
| `--elev-2` (new) | `0 1px 0 rgb(255 255 255 / 5%) inset, 0 6px 16px rgb(0 0 0 / 45%)` | Hovered cards, popovers |
| `--elev-3` (new) | `0 12px 32px rgb(0 0 0 / 55%)` | Dialogs, drawers |
| `--surface-sheen` (new) | `linear-gradient(180deg, rgb(255 255 255 / 3%), transparent 40%)` | Top "lighting" on cards; replaces `--panel-gradient` |
| `--page-glow` (new) | `radial-gradient(1200px 400px at 50% -120px, rgb(255 122 26 / 6%), transparent 70%)` | Once, at the page top under the header |

**Light theme.** The same structure, graphite on paper:

| Token | Value |
|---|---|
| bg | `#f1f1f3` |
| band | `#e4e4e8` |
| surface | `#ffffff` |
| raised | `#f7f7f9` |
| border | `#dcdce2` |
| text | `#17171a` |
| muted | `#55555f` |

The hero and crew bands **stay dark in the light theme too**: lebwa-style media bands are always dark. Mark them with `data-theme='dark'` scoping on the band element so every token inside flips.

### 3.2 Brand accent

This is our own orange. It is not lebwa's `#f15a24`-ish and not Lesta's `#F25322` or `#FAB81B`. It is yellower and brighter (hue about 25°).

| Token | Dark | Light |
|---|---|---|
| `--color-accent` | `#ff7a1a` | `#d85a00` |
| `--color-accent-hover` | `#ff8f3d` | `#bf4f00` |
| `--color-accent-pressed` (new) | `#e8650a` | `#a84500` |
| `--color-accent-soft` | `rgb(255 122 26 / 14%)` | `rgb(216 90 0 / 10%)` |
| `--color-accent-contrast` (ink on orange) | `#1a0b00` | `#ffffff` (on `#d85a00`, 4.6:1) |

Contrast:
- `#ff7a1a` on `#1f1f23` is about 6.5:1, fine for text and outlines.
- Dark ink on `#ff7a1a` is about 7.4:1.
- **White text on our dark-theme orange fails AA** (2.6:1), so solid-orange buttons and plates use the dark ink `--color-accent-contrast`. This is the one visible difference from lebwa's white-on-orange, and it also sets us apart.

Keep:
- `--color-premium: #e3ad4f` (premium names)
- `--color-elite: #c9a44f`
- mastery bronze / silver / gold

Premium gold must never sit next to the accent as a second "brand" colour.

### 3.3 Meaning palettes (new)

Every palette has a `-soft` companion: `color-mix(in srgb, <c> 16%, transparent)`, for tile backgrounds and row tints.

**Tank class**: a brightened version of the community convention, for dark backgrounds.

| Class | Token | Value |
|---|---|---|
| Light tank | `--class-lt` | `#7cc04b` |
| Medium tank | `--class-mt` | `#e0c341` |
| Heavy tank | `--class-ht` | `#e05a44` |
| Tank destroyer | `--class-td` | `#6f8cf0` |
| SPG | `--class-spg` | `#b774e0` |
| Assault SPG (штурм-САУ) | `--class-aspg` | `#e07fb8` |

Use:
- a 3 px left bar on tank rows and cards
- the class glyph fill in filters
- chart series per class
- **not** the tank name colour (that stays white, or gold for premium)

Add an `@mixin class-tint` like `nation-tint`, driven by `data-class='lightTank' | …`.

**Tier bands**: for tier badges (the hex plate) and tier filter chips.

| Tiers | Token | Value |
|---|---|---|
| I–V | `--tier-low` | `#8b8f99` |
| VI–VIII | `--tier-mid` | `#7fb0e0` |
| IX–X | `--tier-high` | `#e3ad4f` |
| XI | `--tier-top` | `#ff7a1a` (accent, outlined hex) |

**Nation**: keep `--nation-*` and add `--nation-*-2`, a secondary colour for the flag backdrop drawn by `NationFlag` (own SVG). Examples:
- ussr `#9c2f25`/`#d9a441`
- germany `#3b3d37`/`#b0a58a`
- usa `#3c5f8a`/`#b53a3a`
- uk `#2f4a8a`/`#b53a3a`
- france `#3f5f8f`/`#c0c0c8`
- china `#b0402c`/`#e0b64a`
- japan `#f0ece2`/`#c0392b`
- czech `#3f6fa8`/`#c84040`
- sweden `#2f6fa8`/`#e0b83a`
- poland `#f0ece2`/`#c83a3a`
- italy `#3f8a4b`/`#c83a3a`
- intunion `#6f7a86`/`#a8b2bd`

Flags render at 22–40 % opacity behind renders, so exact flag fidelity is not needed. Our emblem shapes are enough.

**Equipment category tiles**: our own hues, used as a tile background gradient from the top-left.

| Kind (`provisionOption.variant`) | Label | Token | Value |
|---|---|---|---|
| `standard` | Штатное | `--equip-standard` | `#3a3a42` |
| `trophy` | Трофейное | `--equip-trophy` | `#a3264f` |
| `deluxe` | Боновое | `--equip-bonds` | `#6a3fc0` |
| `modernized` / experimental | Экспериментальное **[verify the variant names against the current importer; the model has `'deluxe'|'modernized'|'standard'|'trophy'`]** | `--equip-experimental` | `#2f7a4a` |
| consumable | — | `--equip-consumable` | `#2b3b52` |
| directive | — | `--equip-directive` | `#4a3b24` |

Tile background: `linear-gradient(135deg, color-mix(in srgb, var(--equip-x) 70%, #000) 0%, #1a1a1e 85%)`, with the API icon centred on top.

**Rating**: unchanged (`--rating-*`, XVM and wot-life palettes). New uses:
- row tint (`-soft`) in top tables
- the stroke colour of a ring

### 3.4 Typography

Keep the Fira Sans / Fira Sans Condensed / JetBrains Mono self-hosted fonts. Never MTSans. The scale gains a display tier; the existing tokens stay.

| Token | Size / line | Font | Use |
|---|---|---|---|
| `--display-xl` (new) | 56/1.0 | Condensed 700, sentence case | Tank name on tank and build heroes |
| `--display-lg` (new) | 44/1.05 | Condensed 700, sentence case | Page hero titles («Отметки», «Топ игроков») |
| `--display-md` (new) | 32/1.1 | Condensed 700, UPPERCASE | Section titles in bands («Экипаж», «Оборудование») |
| `--text-2xl` | 24 | Condensed 700, UPPERCASE | Card group titles |
| `--nav` (new) | 15/1, 0.02em | Condensed 700, UPPERCASE | Main nav, tabs, buttons |
| `--num-hero` (new) | 48/1 | Condensed 700 tabular | One key number per hero |
| `--num-xl` | 40 | — | Key figures |
| `--num-lg` | 28 | — | Stat highlight cards |
| body `--text-md` | 14 | Fira Sans | — |
| label | 11–12, UPPERCASE, 0.06em | Condensed 600 | — |

Rules:
- Hero titles are **sentence case** ("Отметки", "Как собрать танк"), matching lebwa, and so they don't shout.
- Uppercase is for nav, labels, band titles and buttons.
- On mobile, display-xl → 36, display-lg → 32, num-hero → 36.

### 3.5 Radius, spacing, layout

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 3px | Buttons, chips, inputs |
| `--radius-md` | 4px | Cards, tiles |
| `--radius-lg` (new) | 8px | Media cards, hero stat panels |

- No radius on bands or the hero.
- `--gap-section`: 32 → **48 px**. Bands get `padding-block: 40px` (desktop) or 28 px (mobile).
- `--header-height` 64 px, `--utility-height` 32 px (new).
- `--shell-width` stays at 1360 px. Add `--shell-narrow: 1120px` for article-like pages (codes, events, plus).
- **Card grids**: `repeat(auto-fill, minmax(260px, 1fr))` for media cards and `minmax(220px, 1fr)` for tank showcase cards.

### 3.6 Gradients: where they are allowed

**Allowed:**
- The hero art layer (§4.3).
- The nation-flag stage behind renders.
- Equipment category tiles.
- `--surface-sheen` on cards.
- The single `--page-glow` at the top of the page.
- Chart area fills (vertical, 24 % → 0 %).
- The progress ring track.

**Never:**
- text
- buttons (solid only)
- borders, including gradient borders
- animated or moving gradients
- more than one coloured glow per viewport

---

## 4. Chrome (`widgets/site/*`, `ui-kit/organisms`)

### 4.1 Utility bar: new, `widgets/site/site-utility-bar`

- 32 px tall, `--color-band`, text 12 px condensed uppercase `--color-text-muted`, with a 14 px icon before each link.
- Links (our features, never sponsors): «Собрать танк» `/builds`, «Отметки» `/marks`, «ЛБЗ» `/missions`, «Коды» `/codes`, «Для стримеров» `/streamers`.
- On the right:
  - the `GameVersionBadge` («Обновление 1.45», read from the API)
  - the server status (`GameStatusSlot`, moved here from the header)
  - the theme toggle
- Hover changes the text to `--color-text`. The active page's link is accent.
- Hidden below `lg`; the links move into the mobile drawer.

### 4.2 Main header: `widgets/site/site-header`

- 64 px tall, background `--color-surface` with a 1 px `--color-border` bottom line. Sticky; when stuck it collapses to 52 px via `data-stuck`, with a 160 ms height transition.
- Wordmark on the left (`@otmetki/icons` `logo`, our own).
- Nav, `--nav` style:
  - Items: Танки, Игроки, Кланы, Топ, Отметки, Сборки, ЛБЗ, Ещё ▾.
  - Default colour `--color-text`, hover `--color-accent-hover`.
  - The active item is `--color-accent` with a 2 px accent bar that slides between items (§6).
- Right side:
  - the search trigger (a 240 px field with ⌘K, collapsing to an icon below `xl`)
  - the inbox bell
  - **a solid orange «Войти» button** (`Button variant='primary' size='md'`, 40 px, login icon + label). When signed in it becomes the avatar menu.
- Mobile: a 56 px header with logo, search icon and burger. The drawer shows the nav as big 20 px condensed items with icons.

### 4.3 Page hero: new `ui-kit/organisms/PageHero`

This replaces `PageHeader` on every top-level page. `PageHeader` stays for sub-pages and settings.

**Structure.** A full-bleed band, 200–260 px tall on desktop and 160 px on mobile, `data-theme='dark'`. Layers, bottom to top:
1. **Art layer** (`aria-hidden`), chosen by `art` prop. The options are listed below.
2. **Scrim**: `linear-gradient(90deg, rgb(14 14 16 / 92%) 0%, rgb(14 14 16 / 70%) 45%, rgb(14 14 16 / 20%) 100%)` plus a bottom fade to `--color-bg` (0 → 100 % over the last 48 px).
3. **Content** in the shell:
   - breadcrumbs: 12 px uppercase, the last crumb accent
   - the title in `--display-lg`, sentence case
   - an optional one-line lead, 15 px muted, max 60ch
   - an optional `figures` slot on the right: 2–3 `StatHighlight` compact items, or one `num-hero`

**Art options:**

| `art` value | What it draws |
|---|---|
| `tanks` | 3–5 `big_icon` renders of relevant tanks (for example the page's top entries), laid out on the right half at 1× and 1.5×, overlapping 20 %. Each sits on its own soft nation-colour radial (`--nation-*` at 35 %, radius 220 px), with the sharp render unchanged on top. **Never** blur, recolour or upscale renders beyond 2×. |
| `flag` | `NationFlag` (own SVG) scaled to cover the right 60 %, 28 % opacity, masked with a left-to-right fade. Used for nation-scoped pages. |
| `emblem` | One oversized own glyph from `@otmetki/icons` (marks glyph for `/marks`, mastery for `/top`, a code/gift glyph for `/codes`, a calendar for `/events`) at 480 px, 7 % opacity, rotated −8°, on the right. Plus a `--nation`-neutral mesh of two radials (accent at 10 %, steel `#3c5f8a` at 12 %). |
| `clan` | The clan emblem x195 at 1× on the right, with the clan `color` as the radial tint. |

Why not blurred art like lebwa? We have no hi-res art that we are allowed to use. The API renders are only 160×100, and blurring them to hide their size runs close to "altering images" (Policy 1.7). The compositions above get lebwa's "art band" feel from shapes we own plus sharp API renders.

**Action strip**: new `ui-kit/molecules/ActionStrip`, directly under the hero:
- 64 px tall, `--color-band-raised`, 1 px borders top and bottom.
- Left: contextual quick links as round 36 px icon buttons (our pages or tools; never sponsor or social spam). On the profile it shows share / follow / compare / signature; on `/tanks` it holds the class filter as icons.
- Right: one solid orange CTA plus up to two outline icon buttons.

### 4.4 Footer: `widgets/site/site-footer`

- A `--color-band` full-bleed footer with 4 link columns (Разделы, Инструменты, Для стримеров, Проект).
- A compact attribution line at the bottom, mandatory and kept as is.
- The wordmark and game version.

---

## 5. Components: additions and variants (`ui-kit`, `entities`)

| Component | Path | Spec |
|---|---|---|
| **PageHero** | `ui-kit/organisms/PageHero` | §4.3. Props: `title`, `breadcrumbs`, `lead?`, `art: {kind:'tanks',tanks}\|{kind:'flag',nation}\|{kind:'emblem',glyph}\|{kind:'clan',emblem,color}`, `figures?`, `actions?` |
| **ActionStrip** | `ui-kit/molecules/ActionStrip` | §4.3 |
| **Band** | `ui-kit/atoms/Band` | Full-bleed wrapper: `tone='deep'\|'raised'`, `data-theme='dark'`; its inner shell is 1360 or 1120 px |
| **SectionTitle** | `ui-kit/molecules/SectionHeader` (variant `display`) | `--display-md` uppercase, optional accent count chip (for example «Экипаж · 4»), optional right-side link «Все →» |
| **MediaCard** | `ui-kit/molecules/MediaCard` | lebwa-style card. A media area at aspect 4:5 or 16:10 holding a tank render stage, emblem, medal or flag; **never a stock photo**. An **orange label plate** anchored bottom-left: `--color-accent` background, dark ink, title 16 px condensed 700, sub-line 12 px with icon. Radius 4 px. Hover: lift −3 px, `--elev-2`, plate slides 4 px right |
| **TankShowcaseCard** | `entities/tank/tank/ui/TankShowcaseCard` | 220×180 card with a nation-flag stage (flag 30 % opacity) and the render at 1.5× (240×150) breaking the top edge by 12 px. Class bar 3 px on the left in `--class-*`. The `TierHex` badge top-left. Name 16 px (gold if premium). A footer row of 2–3 figures (for example WR 52.1 %, dmg 3 450, 3 отм 5 665). Hover lift, and the render scales to 1.04 |
| **TierHex** | `ui-kit/atoms/TierNumeral` (variant `hex`) | 30×26 flat-top hexagon, `--tier-*` 1.5 px stroke, fill `--color-surface-raised`, Roman numeral 12 px bold. Straddles the card edges on the build page |
| **ClassTag** | `ui-kit/atoms/ClassIcon` (variant `tag`) | Glyph plus class name on the `--class-*-soft` background |
| **StatHighlight** | `ui-kit/molecules/KeyFigure` (variant `highlight`) | A card: 11 px label, `--num-lg` value (animated), a delta chip (green/red on soft), an optional 80×24 sparkline and a rating-colour left bar when the metric is rated. Variants `compact` (for the hero) and `card` |
| **StatList** | `ui-kit/molecules/StatList` (new) | lebwa's «Статистика за 30 дней»: a two-column `label … value` grid, 13 px, value right-aligned and bold tabular, 28 px rows, optional row highlight (`--color-accent-soft` behind one key row) |
| **IconFilter** | `ui-kit/molecules/SegmentedControl` (variant `icons`) | Segments are glyphs: tier numerals I–XI, class glyphs, nation flags. The active segment gets `--color-surface-overlay` with a 2 px accent underline that **slides**. Class glyphs are tinted `--class-*` when active and muted otherwise. Multi-select variant built on `ToggleChips` |
| **DataTable** | `ui-kit/organisms/DataTable` | Adds these variants:<br>• `rowTint` (function → `'win'\|'loss'\|'good'\|'bad'\|'self'`), which tints the row with a `-soft` colour and a 2 px left bar<br>• `mediaFirst`: the first column shows `small_icon` 124×31 with the class bar<br>• `rank` column style: top 1/2/3 in gold / silver / bronze numerals<br>• inline `CellBar`: a 4 px bar under the value, relative to the column max<br>• sticky header on `--color-surface-sunken` with a 11 px uppercase label |
| **ProgressRing** | `ui-kit/atoms/ProgressRing` | Sizes 40/64/96. 6 px track `--color-border`; the arc uses `--color-accent`, or a mark colour (1 mark `--tier-mid`, 2 marks `--tier-high`, 3 marks `--color-accent`). Centre: % (`--num-md`) or the MoE glyph. Animates 0 → value once on first view |
| **MarkProgress** | `entities/player/marks/ui/MarkProgress` | A ProgressRing plus the MoE glyph with 0–3 stripes, the damage-to-next and a small projected-date line |
| **Ribbon / Badge** | `ui-kit/atoms/Badge` | Adds `ribbon` (a corner ribbon on cards: «НОВЫЙ», «ПРЕМ», «−30 %», «ИСТЕКАЕТ») and `plate` (the orange plate text). Tones: accent, premium, class-*, rating-*, equip-* |
| **Timeline** | `ui-kit/molecules/Timeline` (new) | A vertical 2 px `--color-border` line with 12 px nodes coloured by type (patch buff green, nerf red, event accent, code gold) and date labels on the left in 12 px condensed. Used on the tank patch history, `/events` and the profile history |
| **EquipTile** | `entities/tank/build/ui/EquipTile` | 64×64 (desktop) or 52×52 (mobile) tile on the category gradient (§3.3), with the API icon at 44 px. Top-left chevron badge for improved variants. Selected: 2 px accent outline. Tooltip with the effects. When the image is missing it shows a **category glyph** (own) instead of nothing (fixes `GameIcon` returning `null`) |
| **SkillRow** | `entities/tank/build/ui/SkillRow` | Number, 24 px skill icon (API `image`), name; an optional share bar when the source is "Что ставят игроки" |
| **ChartKit theme** | `ui-kit/organisms/ChartKit` | Series colours come from the meaning palettes: class or rating, otherwise the accent then steel `#7fb0e0` then premium gold. The area fill is a vertical gradient from 24 % to 0 %. 1 px `--color-border` grid, horizontal lines only. The tooltip is a `--color-surface-raised` card with `--elev-2`. The last point gets a 4 px dot with the value label |

Existing `Card` gains `variant='media'` (no border, `--elev-1`, radius 8) and `variant='band'` (for use inside bands). `@mixin panel` stays for tables and forms.

---

## 6. Motion (motion library + CSS; respect `prefers-reduced-motion`)

| Interaction | Spec |
|---|---|
| Card hover (MediaCard, TankShowcaseCard, links) | `translateY(-3px)` and `--elev-2`; the render scales to 1.04; the plate shifts 4 px. 180 ms `--ease-out`. Press: `translateY(-1px)` |
| Nav and tab indicator | A shared `layoutId` underline slides between items, 220 ms spring (stiffness 500, damping 40) |
| Tab panels | Content fades in and moves 8 px along the direction of the tab change, 160 ms. Never on the SSR first paint |
| Numbers | `AnimatedNumber` tweens from the previous value on data change (filters or period switch), 400 ms. **Not** on first paint: SSR shows the final value |
| Rings and bars | Fill from 0 when they first enter the viewport (IntersectionObserver, once), 600 ms ease-out. The SSR output is the full value for no-JS users, and the animation only replays for users who allow motion |
| Hero | No entry animation. The art layer may do one 8 px parallax drift on scroll, desktop only |
| Row hover | Background changes to `--color-surface-hover`, 100 ms |
| Toasts, drawers | Existing |

`@media (prefers-reduced-motion: reduce)`: every transform and tween becomes instant, and colour and opacity changes are kept. No idle or looping animation anywhere, except the stream overlay pages (out of scope).

---

## 7. The build page: «Как собрать танк» (`/builds/[tank]`, `views/build`)

This is the flagship lebwa-style page. Today `BuildWorkspace` is a constructor: panels on the left and a `StatsBoard` on the right. v3 splits the page:
- **Showcase (default, read-only)**: a recommended build staged around the tank.
- **«Конструктор» tab**: the current workspace, restyled with EquipTile and `IconFilter`.

### 7.1 Data mapping

| lebwa element | Our data |
|---|---|
| «Совет от нас» / «Что ставят игроки» toggle | `GET /tanks/:id/recommended-build`, where `loadout` is the most-picked option for the **top10** cohort (the default cohort, labelled «Совет: как собирают лучшие 10 %»), vs `usage` with `cohort=all` («Что ставят игроки»). `top1` is a Plus-gated third option with a lock badge. We have no editorial picks, so label the source honestly: "по данным N боёв за 30 дней" (`usage.battles`, `usage.windowDays`) |
| Tank render + title + breadcrumb | `vehicle.images.big`, name, nation › class › tier (links to `/tanks?nation=…&type=…&tier=…`) |
| Field-mod pairs with tier hexes | `buildOptions.fieldModifications[]` (`level`, `kind: 'modification'\|'pair'`, `options[]` with `image`) plus `usage.fieldModifications[].picks[]` for the chosen option and its share |
| «Статистика за последние 30 дней» | `tankServerStatsRow` with `period='30d'`: winRate, avgDamage, avgFrags, avgSpotted, avgBlocked, accuracy, survivalRate. Also the marks thresholds from the marks module (Мастер XP, 3rd-mark damage) **[verify endpoint]**. The Ср. пробитий column needs per-battle hits; show it only if the API has it, otherwise use Точность |
| Crew band, 4 columns | `buildOptions.crew[]` (roles and extra roles) + `usage.crew[].skills[]` ordered by `avgPosition`, top 7, with the skill `image`. Portraits: **none**. Draw our own role glyph (commander / driver / gunner / loader / radio) as 40 px line icons in `@otmetki/icons` (new `crew-roles.tsx`). Never use crew portraits from game files |
| Equipment by category | `usage.equipment[slot].picks[]` grouped by `option.variant` (standard / trophy / deluxe / modernized) → «Основная» = the top pick per slot and «Альтернативная» = the second pick. The directive / 4th-slot tile goes after a divider **[verify what lebwa's 4th tile is; our data has `slots.directives`]** |
| Consumables, shells | `usage.consumables`, `usage.shells` (an extra row, lebwa has none) |

### 7.2 Layout (desktop 1440)

```
[utility bar]
[header]
┌─────────────────────────── stage (min-height 560, data-theme=dark, bg --color-bg) ──────────────────────────┐
│              ( СОВЕТ: ЛУЧШИЕ 10% )  или  ( ЧТО СТАВЯТ ИГРОКИ )   · 12 480 боёв · 30 дней · 1.45           │
│                                                                                                            │
│  ⬡II [tile][tile]                  КАК СОБРАТЬ ТАНК                        ⬡VII [tile][tile]               │
│                                    Champion                (display-xl)                                    │
│  ⬡IV [tile][tile]          Великобритания › Тяжёлые танки › XI            ⬡VIII [tile][tile]               │
│                         ░░░░ flag backdrop (NationFlag, 30%, fades) ░░░░                                   │
│  ⬡V  [tile][tile]             [ tank render big_icon @2x = 320×200 ]      ┌ Статистика за 30 дней ─────┐   │
│                                                                           │ Побед  49.8%  Ср. фрагов 1.0│   │
│                            ⬡VI [tile][tile]                               │ Ср. урон 2750  Засвет 1.23 │   │
│                                                                           │ Мастер 1389 XP  Блок 1542  │   │
│                                                                           │ 3 отм. 5665    Точн. 78%   │   │
│                                                                           └────────────────────────────┘   │
│  [Открыть в конструкторе →] (primary)   [Скопировать сборку] [Поделиться]                                  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
┌──────── crew band (--color-band, full-bleed) ─────────────────────────────────────────────────────────────┐
│  ◯ КОМАНДИР          ◯ МЕХАНИК-ВОДИТЕЛЬ    ◯ НАВОДЧИК            ◯ ЗАРЯЖАЮЩИЙ                            │
│  1 [ic] Ремонт  64%  1 [ic] …              1 …                   1 …                                     │
│  … 7                 … 7                   … 7                   … 7                                     │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  ОБОРУДОВАНИЕ (display-md)
  ШТАТНОЕ            + ТРОФЕЙНОЕ          + БОНОВОЕ             + ЭКСПЕРИМЕНТАЛЬНОЕ
  Основная           Основная             Основная              Основная
  [t][t][t] | [d]    [t][t][t] | [d]      [t][t][t] | [d]       [t][t][t] | [d]
  Альтернативная     Альтернативная       …
  [t][t][t] | [d]    …
  РАСХОДНИКИ И СНАРЯДЫ: [c][c][c]   ББ 72% · БП 20% · ОФ 8%  (stacked bar)
  ИСТОРИЯ СБОРКИ ПО ПАТЧАМ → Timeline (recommended-build/history)
[footer]
```

**Stage details:**
- The field-mod pairs are laid out on a 12-column grid. Levels are placed clockwise: left column top→bottom, bottom centre, then the right column. On `< 2xl` they fall back to a 2-column list under the stage.
- Each pair is 2 × 112 px tiles with a 1 px `--color-border-strong` border. The `TierHex` straddles the top edge.
- The picked tile has a 2 px accent outline and a share % chip bottom-right when the source is "players". The other tile is dimmed to 55 %.
- Tile art is the API `image` at 72 px on `--color-surface-sunken`. When the image is missing, show a generic own "gear" glyph plus the short name.
- **Render size.** The API render is 160×100, so show it at 2× (320×200). Grow the stage with the flag, not the image. Add a soft floor ellipse under the tank (`radial-gradient(closest-side, rgb(0 0 0 / 55%), transparent)`) to ground it. That is our own drawing.
- **Toggle.** Two text tabs in `--nav` style, 18 px; the active one is accent with a 2 px underline that slides. It switches the data source for every block on the page with a number and tile crossfade (200 ms). The current `side` in `BuildProvider` is the natural home for this state.

**Mobile (390):**
- The stage stacks as: toggle (a segmented control spanning the full width) → title block → render on the flag (full width, 2× image max 320 px) → a stats list (2 columns) → field mods as a horizontal scroll of pairs with the hex on top.
- The crew band becomes a horizontal snap-scroller of 4 role cards, each 85 % wide.
- Equipment shows one category at a time behind an `IconFilter` of 4 coloured category chips.

**Components to create:**
- `views/build/ui/components/BuildShowcase/`, with the children:
  - `BuildStage`
  - `FieldModRing`
  - `FieldModPair`
  - `SourceToggle`
  - `CrewBand`
  - `EquipmentMatrix`
  - `ShellMix`
- Logic lives in `views/build/model/hooks/use-build-showcase/`: it picks and groups by variant and turns usage into primary/alternative sets. Layout constants go in `views/build/config/showcase.config.ts`, per the component-structure rule.

---

## 8. Page-by-page redesign notes

Each page lists its hero, then the body sections in order. "Band" means a full-bleed `--color-band` section.

### 8.1 Home `/` (`views/home`)

- **Hero** (`art: tanks` with this week's 5 strongest tanks):
  - «Статистика и инструменты для «Мир танков»» in display-lg
  - the big search field (the existing `CommandPaletteTrigger variant='hero'`, 56 px tall, 640 px wide) with recent searches as chips under it
  - on the right, 3 compact StatHighlights: players tracked today, battles processed, current patch
- **Action strip:** round icon links to Отметки / Сборки / ЛБЗ / Коды / Турниры; CTA «Установить мод».
- **Section «Сильные танки недели»:** a horizontal row of 6 `TankShowcaseCard` (replaces the StrongTanks table), with a «Все →» link and an `IconFilter` of classes above it.
- **Band «Движение отметок»:** a 2-column split.
  - Left: the table with `rowTint`.
  - Right: 3 `MarkProgress` cards for the biggest gains today.
- **Section «Лучшие игроки»:** a podium for the top 3 (large cards with the rank numeral in gold / silver / bronze and the WN8 ring) above rows 4–10 in a compact table.
- **Section «Новости и события»:** `MediaCard`s with the emblem art per category, plus the orange plate showing the date. The right column holds the clan activity list.
- **Band «Для стримеров и кланов»:** 2 wide MediaCards linking to `/streamers` and `/clans`.

### 8.2 Tanks `/tanks` (`views/tanks`)

- **Hero:**
  - `art: tanks` with the top tanks of the selected class
  - title «Танки»
  - figures: vehicles in the encyclopedia, the patch, battles analysed in 7 days
- **Action strip:** an `IconFilter` for class (tinted glyphs), tier (hex numerals I–XI) and nation (flags). This replaces the text chips in `StatsControls`.
- **View switch** (tabs with a sliding indicator): «Тир-лист», «Таблица», «Экономика».
  - **Tier list:** tier bands as rows, S/A/B/C/D, each band with a coloured 4 px left edge (rating palette). Tanks shown as 96×60 render chips with a class bar.
  - **Table:** `mediaFirst`, `CellBar` on WR and damage, `rowTint` on WR diff.

### 8.3 Tank `/t/[slug]` (`views/tank`)

- **Hero stage** (a smaller version of the build stage):
  - the flag backdrop and a 2× render centred on the left 60 %
  - on the right, the name (display-xl, gold if premium), breadcrumb nation › class › tier, `TraitBadges` as ribbons, and the key numbers (WR, damage, 3-mark threshold) as num-hero / num-lg
  - the `ParamsPanel` bars move under it as a full-width 3-column parameters grid
- **Sticky tabs** under the hero: Обзор · Сборка · Отметки · Статистика · Изменения.
- **Обзор:** `StatList` (30 days) plus a radar of 6 params vs the tier average (ChartKit), then a `TankShowcaseCard` row «Похожие».
- **Сборка:** a compact `BuildShowcase` preview (the field-mod ring hidden, equipment matrix only) and a «Открыть полную сборку →» link.
- **Отметки:** 3 `MarkProgress`-like threshold cards (1/2/3 marks, damage values) and the history chart.
- **Band «Топ игроков на танке»:** a podium plus a table.
- **Изменения:** a `Timeline` from `PatchHistory`.

### 8.4 Player `/p/[nick]` (`views/player-profile`)

- **Hero** (`art: flag` of the most-played nation, or `clan` when the player is in a clan):
  - nick in display-lg, clan tag chip in the clan colour, the badge from the API if available
  - on the right, 4 key numbers: WN8 (in a **ProgressRing** coloured by rating), WR, battles, average damage
- **Action strip:** Сравнить, Подписаться, Подпись, Поделиться; CTA «Сессия сейчас» when the mod is live.
- **Sticky tabs:** a sliding indicator, with the existing tab set.
- **Overview:**
  - a row of 4 `StatHighlight` cards with sparklines (30-day WN8, WR, damage, battles/day)
  - a «Любимые танки» row of `TankShowcaseCard` with the player's WR
  - a **band** «Отметки» with a big ring (total 3-mark count) plus the 4 closest MarkProgress cards
  - the activity heatmap
- **Achievements:** a medal grid of API images at 72 px with count badges; the rarest medals in a first row at 96 px.
- **History:** `Timeline`.

### 8.5 Marks `/marks` (`views/marks`)

- **Hero** (`art: emblem` MoE glyph):
  - title «Отметки»
  - lead «пороги по данным N игроков»
  - figures: tanks tracked, update time
- **Band «Ближе всего к отметке»** (the existing `ClosestMarks`, needs the player lookup): 4 `MarkProgress` cards with the rings.
- **Table:**
  - `mediaFirst`
  - threshold columns 1/2/3 marks coloured `--tier-mid` / `--tier-high` / accent
  - a `CellBar` for the "sweat" index
- **MoE drawer:** a ring header and the mastery ladder as 4 colour-coded steps.

### 8.6 Builds `/builds` (`views/builds-catalog`)

- **Hero:** `art: tanks` with the most-built tanks; title «Сборки».
- **Action strip:** `IconFilter` (class, tier, nation) and search.
- **Grid of `TankShowcaseCard`:**
  - the footer shows the top 3 equipment picks as 24 px `EquipTile`s instead of numbers
  - a «данных мало» ribbon when `isEnough` is false
- A table toggle for power users.

### 8.7 Missions `/missions` (ЛБЗ, `views/missions`)

- **Hero:** `art: emblem` with our own operation glyph; title «Личные боевые задачи».
- **Operation cards** (`OperationCard` → MediaCard):
  - the reward tank render on the flag stage
  - an orange plate with the operation name and «N/15 задач»
  - a ProgressRing for the user's completion when signed in
- **Operation detail:**
  - branches as columns, one per class, with the `--class-*` header colour
  - 15 mission nodes each, with a state colour (done / in progress / locked)
  - «Танки для ЛБЗ» as TankShowcaseCards

### 8.8 Top `/top` (`views/top`)

- **Hero:** `art: emblem` (mastery glyph); title «Топ игроков»; the period switch as tabs.
- A **podium** for the top 3: a big card each with a rank ring and the metric value in num-hero.
- **Table:** `rank` column style, rating-coloured metric cells, `rowTint='self'` for the signed-in player.
- Tier bands (IX–X, VII–VIII, I–VI) as `IconFilter` hex chips.

### 8.9 Clans `/clans` (`views/clans`)

- **Hero:** `art: tanks` or neutral emblem; title «Кланы»; search in the hero body.
- **Top-3 clans** as MediaCards: emblem x195 on a clan-colour radial, and a plate with the tag and rating.
- **Table:** 32 px emblems, clan-colour 3 px row bar, `CellBar` for activity.

### 8.10 Codes `/codes` (`views/codes`)

- **Hero:** `art: emblem` (gift glyph); title «Бонус-коды»; figures: active codes, expiring this week.
- **CodeCards become ticket-style cards:**
  - the code in 20 px mono with a big copy button (solid orange, dark ink)
  - reward icons as a row (API provision or booster images when known, otherwise an own glyph)
  - an «ИСТЕКАЕТ через 2 дня» ribbon in accent, «НОВЫЙ» in steel
  - expired codes dimmed to 50 % with a strike
- Narrow shell (1120).

### 8.11 Events `/events` (`views/events`)

- **Hero:** `art: emblem` (calendar); title «События»; the current event as a figure.
- **«Сейчас идёт» band:** 1–2 wide MediaCards with a countdown (`num-lg`, updates each minute, no ticking seconds).
- The **Timeline** of upcoming events grouped by week; each node is coloured by type (mode, sale, marathon, tournament).
- «Подписаться (.ics)» as the primary CTA in the action strip.

### 8.12 Streamers `/streamers` (`views/streamers`)

v2 already removed the `OnAirMonitor` gadget; keep it removed.
- **Hero:** `art: emblem` (overlay glyph); title «Для стримеров»; CTA «Открыть студию».
- **Alternating feature rows**, the only page with a marketing rhythm:
  - media left: a **real overlay preview** rendered from our overlay components with sample props, labelled «пример»
  - text right
  - the next row flips sides
  - 3 rows: overlay, chat bot, signatures
- **Band:** «Как подключить» as a 3-step horizontal timeline.

### 8.13 Plus `/plus` (`views/plus`)

- **Hero:** `art: emblem` (logo mark); title «Три отметки Плюс»; price as num-hero.
- **Benefit cards:** MediaCards with an own glyph per benefit and an orange plate. At most 6, each naming a concrete feature (for example «Когорта топ-1 % в сборках»).
- **Plan table:** 2–3 columns; the recommended column has an accent top border and a «ВЫГОДНО» ribbon.
- FAQ as an accordion.

---

## 9. Accessibility and legal guardrails

**Contrast:**
- all text ≥ 4.5:1, and large display text ≥ 3:1
- dark ink on orange; `--color-text-dim` never used for essential info
- class and rating colour always paired with a glyph or text; tints are never the only signal

**Hero:**
- the art layer is `aria-hidden`
- title and breadcrumbs are real text
- the scrim guarantees ≥ 4.5:1 for the title over any art

**Motion:** §6 reduced-motion rules. No autoplay carousels.

**Focus:** a 2 px accent ring with 2 px offset on every interactive element, including cards (the whole card is a link, with a focus-visible ring).

**Images:**
- API images only, proxied through `next/image` with a TTL, never altered to hide their origin
- no blur or recolour on renders; tints and flags go *behind* them
- the attribution footer on every page

**Lesta look-alike ban (Policy 1.6):**
- no MTSans, no cream + amber pairing, no Lesta textures or carousel chrome
- our orange `#ff7a1a` is distinct from `#F25322` / `#FAB81B`
- hexagon tier badges and category tile colours are generic conventions drawn by us

**lebwa:** we borrow composition only. None of their assets, logo, wordmark treatment, exact colours, crew portraits or text.

---

## 10. Implementation plan (work packages)

Order: tokens → primitives → chrome → the flagship build page → the other pages. Each WP ends with `bun run verify` and the targeted vitest runs. No `next build`.

**WP-0 · Data prerequisites** (server; can run in parallel)
- Make sure the `encyclopedia/vehicles` sync fills `vehicle.images` (it is `NULL` for all 1028 rows locally). Check `apps/web/server/src/modules/collector/reference/services/encyclopedia-sync.service.ts` and re-run the reference job.
- Confirm that the `image` fields for provisions, crew skills and field modifications are populated.
- Expose `period='30d'` tank stats for the build stage (it already exists in `serverPeriodSchema`).
- Expose the marks thresholds per tank.

**WP-1 · Tokens** (`shared/styles/_tokens.scss`, `_mixins.scss`, `app/globals.scss`)
- Apply §3:
  - new surface ramp, elevations, sheen, page glow
  - accent set
  - class, tier, nation-2 and equip palettes
  - display type tokens, radii, gaps
- Add the mixins `class-tint`, `tier-tint`, `equip-tint`, `band`, `media-card`, `lift-hover` (with reduced motion).
- Replace `--panel-gradient` with `--surface-sheen`.
- Update `views/design` (the `/design` page) to show the new tokens.

**WP-2 · Primitives** (`ui-kit/atoms`, `ui-kit/molecules`)
- Atoms: `Band`, `TierNumeral` hex variant, `ClassIcon` tag variant, `Badge` ribbon/plate, `ProgressRing` colours and on-view fill, `AnimatedNumber` policy (no animation on first paint).
- Molecules: `StatList`, `KeyFigure` highlight variant, `SegmentedControl` icons variant with a sliding indicator (motion `layoutId`), `SectionHeader` display variant, `Timeline`, `MediaCard`, `ActionStrip`.
- Tests: StatList formatting, ProgressRing clamping, Timeline ordering.

**WP-3 · Organisms and entities**
- `PageHero` (4 art kinds)
- `DataTable` variants (`rowTint`, `mediaFirst`, rank, `CellBar`)
- the ChartKit theme
- `entities/tank/tank/ui/TankShowcaseCard`
- `entities/tank/build/ui/EquipTile` + `SkillRow` (and `GameIcon` gets a fallback glyph)
- `entities/player/marks/ui/MarkProgress`
- `@otmetki/icons`: `crew-roles.tsx`, `equip-category.tsx`, and hero emblem glyphs (gift, calendar, operation, overlay)

**WP-4 · Chrome** (`widgets/site`)
- the new `site-utility-bar`
- `site-header` restyle (64 px, nav `--nav`, sliding active bar, orange «Войти»)
- `site-footer` band
- the mobile drawer

**WP-5 · Build showcase** (`views/build`), the flagship. §7.
- `BuildShowcase` and its children, and `use-build-showcase`
- a tab switch to the existing workspace, «Конструктор»
- restyle `SlotsPanel`, `CrewPanel` and `FieldModsPanel` with EquipTile and SkillRow

**WP-6 · Tank and player pages**
- `views/tank` hero stage, sticky tabs, sections as in §8.3
- `views/player-profile` as in §8.4

**WP-7 · List pages:**
- home
- `/tanks`
- `/marks`
- `/builds`
- `/top`
- `/clans`

Each list page switches to `PageHero` + `ActionStrip` + `IconFilter` + DataTable variants, with the showcase rows from §8.

**WP-8 · Content pages:** `/missions`, `/codes`, `/events`, `/streamers`, `/plus` (§8.7, §8.10–8.13).

**WP-9 · Sweep**
- Replace the remaining `PageHeader` heads on top-level pages.
- Remove the unused v2 panel-only styles.
- Run knip and jscpd.
- Refresh the e2e smoke selectors if headings changed.

**Parallelism:**
- WP-0 and WP-1 in parallel.
- WP-2 and WP-3 after WP-1.
- WP-4 and WP-5 after WP-3.
- WP-6, WP-7 and WP-8 in parallel after WP-4.

**i18n:** every new string goes into `shared/i18n/locales/{ru,en}/<namespace>.json` (new keys: `builds.showcase.*`, `nav.utility.*`, `common.hero.*`).

## 10a. Update 2026-09-26: motion showpieces

The user asked for 3D and animated backgrounds. These are now allowed as a deliberate exception to the bans in earlier sections: `TankShowcase3D` (collision-model hologram), `BattleBackdrop` (dust, smoke, tracers and contour lines at low contrast) in `PageHero`, `MarksRing`, `Reveal` (only below the fold), `Tilt` and `AnimatedLogoMark`. All of them respect reduced-motion and pause offscreen.

## 11. Navigation and information architecture (2026-09-26)

Problem: the header had 9 links plus a «Ещё» popover with 16 more, and the account area had 11 tabs. Several items duplicated each other: tournaments and competitions, pulse and the home status panel, developers and design in the main menu.

### Header (desktop)

`Logo · Игроки ▾ · Техника ▾ · Игра ▾ · Сообщество ▾ · Инструменты · [search ⌘K] · Плюс · Войти/аватар ▾`

Each ▾ item is a mega-menu panel. Every panel has 2 columns: links with a short one-line hint and an icon, plus one featured card (a tank render or a live number). The mobile drawer uses the same groups as accordions.

| Group | Items |
| --- | --- |
| Игроки | Поиск игроков `/players` · Топы `/top` · Кланы `/clans` · Сравнить игроков `/compare/players` |
| Техника | Статистика танков `/tanks` · Сборки `/builds` · Отметки и мастер `/marks` · Мета режимов `/modes` · Дерево `/tree` · Сравнить танки `/tanks/compare` |
| Игра | ЛБЗ `/missions` · События и календарь `/events` · Бонус-коды `/codes` · Магазин и возвраты `/shop` · Новости `/news` · Карты `/maps` |
| Сообщество | Стримеры `/streamers` · Реплеи `/replays` · Гайды `/guides` · Тактика `/tactics` · Взводы `/platoons` · Кланы ищут `/recruiting` · Тренеры `/coaching` · Турниры `/tournaments` |
| Инструменты | a single link to `/tools` (calculators, Front Line, «Угадай танк» as tools inside) |

What changes:

- **Merged:** `/competitions` becomes a tab of `/tournaments` («С сеткой» / «По очкам»); the old URL redirects. `/play` is listed inside `/tools`.
- **Removed from menus:**
  - `/pulse` is linked from the home status panel only.
  - `/developers`, `/design` and «Стримерам» (`/for-streamers`) move to the footer.
- **Utility strip** above the header, small and optional: game version badge, server status, «Скачать мод», RU/EN. It has no page links, so nothing duplicates the menu.
- **Plus** gets a distinct accent button in the header, not a text link.

### Account menu (avatar ▾) and account shell

Replace the 11 flat tabs with 3 groups. The same groups appear in the avatar dropdown and as a sidebar in `/me`.

| Group | Items |
| --- | --- |
| Мой профиль | Обзор `/me` · Аналитика `/me/analytics` · Бои `/me/battles` · Прогресс и сезон `/me/progress` · Косметика `/me/cosmetics` |
| Подписки и связь | Слежка `/me/watchlist` · Уведомления `/me/notifications` · Telegram `/me/telegram` |
| Аккаунт | Подписка `/me/billing` · Студия стримера `/me/streamer` · API `/me/developer` · Выйти |

`/me/battles` gets a list page, so its link is not dead.

### Rules

- The header holds at most 5 top-level items.
- Every route appears exactly once in the menu system.
- The footer repeats groups only as plain text links, and lists the legal and project pages.
