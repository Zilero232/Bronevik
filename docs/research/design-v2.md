# Design v2: from "tactical-HUD cosplay" to a real «Мир танков» stats hub (2026-09-25)

Status: spec for implementing agents. Supersedes the visual parts of `docs/research/visual-language.md` §6. The legal rules in `visual-language.md` §1–§4 and `lesta-api.md` ("Terms of use") still apply unchanged.

Screenshots of the current site (dev, API down): `C:\Users\React\AppData\Local\Temp\claude\d--Project-personal\d134a282-f230-4678-9d70-c193950e87cf\scratchpad\shots\design-audit\` (`tools|tanks|marks|top|streamers|developers-desktop.png`). `/`, `/t/*`, `/p/*` and `/clans` never rendered: they block on server data during SSR, and the dev server kept restarting. The mobile shots are missing for the same reason. §8 is based on the source for those pages.

The game-UI observations in §2 come from the verified facts in `visual-language.md`, a web-research pass (API docs, tanki.su and community CSS, Lesta patch notes and support pages; raw downloads in the session scratchpad folder `r`) and general knowledge of the client. See §2.1. Items marked **[verify]** need a live check.

---

## 0. Diagnosis in one paragraph

The site doesn't read as a «Мир танков» tool. It reads as a generic AI landing template with a military skin on top. Every page opens with the same marketing hero:
- an eyebrow with a pulsing "live" dot
- a 6.5rem uppercase title with a gradient "hot" word
- a lead paragraph
- a decorative gadget: a radar scope, a "telemetry console" or an "on-air monitor"

Content then sits in chamfered, riveted, brushed plates with camo dividers, corner brackets, `// 01` indexes, orange glows and scanner skeletons. Meanwhile the one thing that actually says "this is Мир танков" is **the game data itself**:
- tank renders from the API
- tier numerals, class glyphs, nations
- patch numbers, marks, WN8 colours
- real map and medal images

That data is tiny or missing. Tank renders show at 160×100 inside a bracket frame under a 100 px title, or only as a 60×23 contour in tables. The fix is subtraction plus data:
- remove the decoration
- make tank images, medals and numbers the visual content
- lay out pages like the game's own information screens (garage carousel, service record, post-battle report, tech tree): dense panels, 1 px hairlines, condensed uppercase labels, big tabular numbers

---

## 1. Principles

1. **Data is the decoration.** If a pixel isn't a tank, a number, a medal, a map, a flag or a label, it needs a reason to exist. No decorative SVG gadgets, grids, tracers, radar sweeps or noise.
2. **Game vocabulary, our own brand.**
   - Use the game's conventions: Roman tiers, rhombus class glyphs, gold premium names, mastery badges, MoE, "ДПМ / альфа / пробитие / ОО / засвет / блок", "Укрепрайон", "Клановые войны / ГК", "Натиск", "Линия фронта", patch numbers.
   - Never use Lesta's logo, the MTSans font, the exact cream `#F9F5E1` + amber `#FAB81B` pairing, game textures or screenshots.
   - Policy 1.6 also bans UI that "can be confused with Lesta services". So we echo the **structure** of the client screens (carousel, service record, results tables), never their **look** (textures, buttons, fonts, colours).
3. **Density like the client, not like a SaaS landing.**
   - 14 px body, 32–36 px table rows, 1 px separators.
   - Panels touch each other with 1–8 px gaps.
   - Section spacing is at most 32 px. The first screen shows data, not a slogan.
4. **One accent, used for state.** Orange means "active / primary / selected", and nothing else. Gold means premium or elite. Rating colours are only for rating values. No glows.
5. **Square, flat, hairline.**
   - Radius 0–2 px.
   - No clip-path chamfers on surfaces, no rivets, no brushed stripes, no camo.
   - Depth comes from surface steps (bg → panel → raised) and a single 1 px top highlight, not from drop shadows.
6. **Content first paints complete.** Nothing important may be `opacity:0` in SSR HTML. Kill enter animations on above-the-fold content (see §7). Today every hero is blank until hydration: see `tools-desktop.png`, `streamers-desktop.png` and `marks-desktop.png`, where 400–1100 px of empty page sits above the fold.
7. **Say what we are, plainly.**
   - Name the game in the first screen of every page: «Статистика и инструменты для игроков «Мир танков»».
   - Show the data source ("Данные: API Леста Игры · обновлено 5 мин назад") and the current game version badge ("Обновление 1.45").
   - No slogans ("Вся броня сервера — в одном прицеле", "Отметки вспыхивают", "Лоб в лоб", "Кто сейчас держит фронт").

---

## 2. What the game UI actually does (and what we borrow)

Borrow the **pattern** in the left column. Never reproduce the thing in the right column.

| Game / community pattern | Borrow as | Never |
|---|---|---|
| Garage carousel: a strip of slots, each with the tank's small render, Roman tier top-left, class glyph, name bottom, a nation tint behind it | `TankStrip` / `TankSlot`: 160×100 `big_icon` (or 124×31 `small_icon` for compact) on a subtle nation-colour gradient (our own colour, not the flag texture), tier + class glyph top-left, name bottom, gold name when premium | Lesta's slot frame art, their flag textures, their carousel chrome |
| Service record ("Статистика" tab): two columns of `label …… value` rows grouped under small caps headers ("Общее", "Рекорды", "Средние за бой"), a few huge numbers at top (Боёв, Побед %, Средний опыт) | `StatSheet` + `KeyFigures` components: grouped definition lists with dotted leaders or a right-aligned value, 28 px rows | Their exact layout or icons per row |
| Post-battle results: two team columns, dense rows (tank icon, nick, damage, frags), a personal summary header (result, map, mode, credits/XP table) | Session and battle views; top tables | Their result banner art |
| Tech tree: nodes = contour/small render + name + tier, connected by thin orthogonal lines, researched = lit, elite = gold | `/tree` nodes use `small_icon`; 1 px orthogonal edges; no glowing animated edges | Their node frames and background art |
| Vehicle comparison: columns of tanks, parameter rows, best value highlighted | `/tanks/compare`: already the right idea; make it table-dense | — |
| Tank parameters: label + value + a thin horizontal bar relative to the tier | `ParamBar` in the tank hero (DPM, alpha, penetration, view range, speed, HP) | — |
| Marks of excellence: 0–3 stripes on the barrel, % to next | Our own MoE glyph (`packages/icons` `marks.tsx`), plus the % and damage-to-next as big numbers | Game barrel textures |
| Mastery: class badges 3rd/2nd/1st/Master | Our own `MasteryIcon` tinted bronze/silver/gold, **and** the real API achievement images where the API provides them (see §3) | Tracing the medals |
| tomato.gg / tanks.gg / kttc / wotinspector: dense dark tables, WN8/XVM colour cells, small tank image in the first column, sticky header, zebra-free rows with hairlines | `DataTable` restyle (§5.4) | Their logos and brand colours |
| XVM rating colours | Already in `--rating-*` with `data-rating-palette='xvm'` | — |

What makes the client "feel like the game" (checklist for every screen):
- dark desaturated graphite/olive surfaces
- hairline separators
- uppercase condensed labels with small tracking
- huge tabular numerals next to tiny labels
- Roman tiers
- class glyphs
- gold premium names
- tank renders as the main imagery
- tab strips across the top of a panel
- almost no radius
- short state-change animations only (hover lighten, tab underline), no idle animation

### 2.1 Research facts (verified [V] or from domain knowledge [K])

**Мир танков specifics (don't design for WG's WoT):**
- **Classes.** Patch 1.32 «Альфа» added tier XI, a new **штурм-САУ** class and flamethrower tanks [V]. tanki.su icon classes also encode **roles**: HT assault/break/support/universal, MT assault/sniper/support/universal, LT universal/wheeled, TD sniper/support/universal, SPG, SPG-assault, SPG-flame [V]. So:
  - `TANK_CLASS_ICONS` needs an assault-SPG glyph.
  - Tier types must allow 11.
  - Add a small role glyph set for the tank page and filters (our own drawings).
- **Patch numbering.** Current patches are 1.4x (1.45 at the time of writing) [V]. WG's "WoT 2.0" hangar is a different fork, so don't reference it. Show the version from `encyclopedia/info.game_version` and never hard-code it.
- **Carousel** (Lesta support article 15020) [V]:
  - Grouped by nation, then by tier low→high within each nation.
  - One or two rows.
  - The filter sits bottom-left, with quick toggles for unused daily bonus, «основные», elite and premium.
  - Our `TankStrip` filters should mirror that vocabulary: «Прем», «Элитные», «Основные».
- **Carousel slot** [K]:
  - A dark tile with the render centred.
  - Class glyph + Roman tier top-left, short name bottom.
  - Premium name in gold/orange.
  - Status text over a dimmed render.
  - Small badges (x2 bonus, mastery, «основной» star).
- **Service record** [K]: a header of big numbers (battles, win %, average damage/XP, mastery count, marks count), then grouped `label … value` blocks, then a medal grid with counters, then a per-vehicle table.
- **Post-battle report** [K]:
  - Tabs: Личный / Командный / Детальный отчёт.
  - The team tab is two columns of 15 rows (platoon, nick + clan, contour icon + tier, damage, frags, XP, medals, dead greyed).
  - The detailed report is a two-column ledger (без премиума | с премиумом).
  - Our session and battle views should copy this *structure*.
- **Parameters panel** [K]: label, value and a thin bar per row, with green/red delta segments on hover. Compare view: tanks as columns, best value highlighted.
- **Tech tree** [K]: tiers as columns with thin orthogonal connectors. Node = icon + class glyph + tier + name + XP cost. States: locked (dim), researchable, researched, elite (gold class icon).

**Community sites:**
- **tanks.gg** [V], the site players most often call "like the game":
  - radius about 0
  - `.stat-line` rows: label 10rem wide, value right-aligned, 1 px separators, highlighted rows at 1.125rem bold
  - carousel-slot replica: 16rem×75px, gradient from grey to black, render 120×75
  - tech-tree nodes 96×46 px, name strip at 0.75rem
  - community **class colours**: LT `#234610`, MT `#9d9204`, HT `#7e2110`, TD `#414b90`, SPG `#793896`
  - We may use tinted versions of these as a class accent (e.g. a 2 px left bar in tree nodes). They are a community convention, not Lesta brand.
- **tomato.gg** [V] uses Radix Themes with Inter, and its accent is gold `#fab81b`, which is exactly Lesta's amber. That's one more reason we don't use `#FAB81B`.
- **blitzkit** [V] is also Radix. Radix and shadcn sites read as "SaaS dashboard", not "game".
- **wotinspector** [V]: shadcn, dark teal-navy `#070d12`.
- **kttc.ru** [V]: Roboto, light theme, 64 px clan emblems, tops split by tier bands (IX–X, VII–VIII, I–VI). This is a good pattern for our `/top`.
- **wot-life** [V] has the classic 9-step WN8 badge scale (`#000`, `#cd3333`, `#d77900`, `#d7b600`, `#6d9521`, `#4c762e`, `#4a92b7`, `#83579d`, `#5a3175`; bands <300/300/600/900/1250/1600/1900/2350/2900+). Worth adding as a third `data-rating-palette='wotlife'` option.
- **tanki.su portal** [V], for contrast (do NOT copy):
  - MTSans, cream `#f9f5e1`, orange-red `#f25322`, gold `#fab81b`
  - radius 3–5 px on controls, 10 px on news cards
  - uppercase condensed news titles at 20 px
  - Our palette in §4 avoids all of these values.

---

## 3. Legal "real game" content we must show (Lesta API, with attribution)

All of the items below come **from the API itself**. Showing them counts as using API content under the agreement, provided:
- the footer credit stays visible on every page
- images are not altered to hide their origin
- we don't store them indefinitely: proxy through `next/image` with a TTL; store the API URL, not the file

| Content | Source (server already syncs it) | Where it must appear |
|---|---|---|
| Tank renders `big_icon` 160×100, `small_icon` 124×31, `contour_icon` ~60×23 | `encyclopedia/vehicles` `images.*`; client `entities/tank/tank/ui/TankImage.tsx` | **Tables**: `small_icon` in the first column of every tank row (tanks, marks, top-by-tank, profile tanks, sessions). `contour` only where the row is under 32 px. **Cards / carousel / compare heads / profile favourites**: `big_icon`. **Tank page hero**: `big_icon` at 2× CSS scale (320×200) with `image-rendering:auto`, on a nation-tinted gradient, as the dominant element |
| Achievement / medal images (`image`, `image_big` 180×180, `options[].image(_big)`, `options.nation_images.x180/x85/x71`). URL pattern `…/static/<ver>/wot/encyclopedia/achievement/{,big/}<name>.png` (verified: `medalKolobanov`, `markOfMastery1`). Read marks-on-gun and mastery file names from the API; don't guess them | `encyclopedia/achievements`; `apps/server/src/modules/collector/reference/services/encyclopedia-sync.service.ts:329` stores `image_big ?? image` | Profile "Достижения" tab (grid of medals with counts); mastery badges beside tanks where available; home "Мастера за сутки" |
| Crew skill icons (`image_url.*`) | `encyclopedia/crewskills` (`crewSkillSchema.image_url`) | `/builds/[tank]` crew panel (replaces lucide icons in `views/build/config/build-icons.config.ts`) |
| Equipment / consumables / directives (`provisions.image`) | `encyclopedia/provisions` | `/builds/[tank]` slots, tank page "Популярные сборки" |
| Module images (`modules.image`) | `encyclopedia/modules` | Tank page configuration table |
| Map images | **None in the API.** `encyclopedia/arenas` returns only `arena_id`, `camouflage_type`, `description` and `name_i18n` (so `arenaSchema.image` is always empty) | `/maps` and map chips use text: map name + camouflage type (summer/winter/desert) as a small coloured tag. Never use game screenshots or minimaps |
| Badges (нашивки) `images.big_icon` 80×80 / `medium_icon` 48 / `small_icon` 24 | `encyclopedia/badges` | Player hero next to the nick when the API exposes the player's badge **[verify]** |
| Personal reserves `images.large/small` | `encyclopedia/boosters` | `/tools` economy calculator |
| Clan emblems (`emblems.x24/x32/x64/x195/x256`, each a map of URLs by usage) + the clan `color` (#RRGGBB) | `clans/info` (`clans.schemas.ts:31`) | Clan rows (x32), clan hero (x195), player hero next to the clan tag |
| Game version (`game_version`) | `encyclopedia/info`; `GameVersion` table (`encyclopedia-sync.service.ts:44`) | Header badge "Обновление X.Y" everywhere; tank page "Изменения по патчам" |
| News headlines | tanki.su RSS (`apps/server/src/config/sources.constants.ts:4`, `modules/collector/news`, served by `GET /shop/news`?) **[verify route]** | Home "Новости игры": headline + date + link out. Don't rehost article images unless the RSS enclosure licence allows it; use headline-only rows by default |
| Server online | `/wgn/servers/info/` isn't in Lesta's docs, but the endpoint exists on api.tanki.su: it answers with an app-id error, not METHOD_NOT_FOUND. The response shape `data.wot[{server, players_online}]` is assumed from the WG API **[verify with a real key]** | If it works: a header status «RU · N онлайн» per server. If not: show **our** measured activity («Активных игроков за час», from `pulse`) labelled as our estimate, never «онлайн сервера» |

Mandatory attribution (already in `widgets/site/site-footer/ui/SiteFooter.tsx`): keep it, but make it one compact line.

Also add a **source line under every data table**: "Данные: API Леста Игры · обновлено {relative time}". Small, `--color-text-dim`.

---

## 4. Tokens: exact changes (`apps/client/shared/styles/_tokens.scss`)

### 4.1 Fonts (all from Google Fonts, Cyrillic subsets, self-hosted through `next/font/google`)

| Role | Family | Weights | Why |
|---|---|---|---|
| Labels, nav, headings, table headers, **all numbers** | **Fira Sans Condensed** | 500, 600, 700 | Full Cyrillic, excellent tabular figures (`tnum`), neutral military-technical feel close to game UI condensed grotesks without being MTSans. Replaces Tektur, which is a sci-fi display face and the main source of "gamer template" feel |
| Body, descriptions, form text | **Fira Sans** | 400, 500 | Same family and metrics, so one voice. Replaces Onest |
| Code only (`/developers`, `CodeBlock`) | **JetBrains Mono** | 400 | Replaces IBM Plex Mono. **Mono is no longer used for labels** |

Replace `apps/client/shared/config/fonts/*.ts` (currently `localFont` Tektur/Onest/Plex) with:

```ts
import { Fira_Sans, Fira_Sans_Condensed, JetBrains_Mono } from 'next/font/google';
export const fontCondensed = Fira_Sans_Condensed({ subsets: ['latin', 'cyrillic'], weight: ['500', '600', '700'], variable: '--font-condensed', display: 'swap' });
export const fontSans = Fira_Sans({ subsets: ['latin', 'cyrillic'], weight: ['400', '500'], variable: '--font-body', display: 'swap' });
export const fontMono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], weight: ['400'], variable: '--font-code', display: 'swap' });
```

Tokens:

```scss
--font-display: var(--font-condensed), 'Arial Narrow', sans-serif;  // headings, labels, numbers
--font-sans: var(--font-body), system-ui, sans-serif;
--font-mono: var(--font-code), ui-monospace, monospace;               // code blocks only
```

Delete `--stretch-condensed` and every `font-stretch` declaration: the condensed family replaces them.

### 4.2 Type scale (fixed px, no fluid clamps for UI text)

```scss
--text-2xs: 0.6875rem; // 11 — table headers, labels
--text-xs: 0.75rem;    // 12 — meta, source lines, badges
--text-sm: 0.8125rem;  // 13 — table cells, secondary
--text-md: 0.875rem;   // 14 — body default
--text-lg: 1rem;       // 16 — panel titles
--text-xl: 1.25rem;    // 20 — section titles
--text-2xl: 1.5rem;    // 24 — page H1 (mobile)
--text-3xl: 1.75rem;   // 28 — page H1 (desktop), tank name
--num-md: 1.5rem;      // 24 — stat tile value
--num-lg: 2rem;        // 32 — key figures (service record)
--num-xl: 2.5rem;      // 40 — hero rating value (WN8 on profile, WR on tank)
--tracking-label: 0.06em;   // was 0.14em
--tracking-display: 0.02em;
--leading-tight: 1.15;
--leading-body: 1.45;
```

Delete `--text-4xl` (6.5rem). No H1 is larger than 28 px. Numbers get the big sizes, not titles.

Numerals: `font-variant-numeric: tabular-nums lining-nums;` on every number. Thousands separator is a thin no-break space (the `ru` Intl default). Percent is written `54,21 %` with a no-break space.

### 4.3 Colours: dark (default)

These are warm graphite with an olive cast, not blue-black. They are chosen to stay clear of tanki.su's `#1C1C1E / #151515 / #0F0F0F` and cream text.

```scss
--color-bg: #121410;
--color-bg-deep: #0c0d0b;
--color-surface: #191b17;          // panel
--color-surface-raised: #20231e;   // panel header, table header, popover
--color-surface-sunken: #0f110e;   // inputs, wells
--color-surface-hover: #262a23;
--color-border: #2b2f27;           // hairlines between rows
--color-border-strong: #3b4036;    // panel outlines, input borders
--color-text: #dcdfd3;             // grey-olive, NOT cream
--color-text-muted: #9ba090;
--color-text-dim: #6b7063;
--color-accent: #e8762d;           // signal orange (state only)
--color-accent-hover: #f08a45;
--color-accent-soft: rgb(232 118 45 / 12%);
--color-accent-contrast: #140a03;
--color-steel: #8ea4b5;            // info / links in text
--color-success: #6fb544;
--color-warning: #d9b23c;
--color-danger: #d4452f;
--color-premium: #e0a94a;          // premium tank names & glyph (not #FFC363)
--color-elite: #c8a24e;
--color-ally: #6fb544;
--color-enemy: #d4452f;
--color-enemy-cb: #8379fe;
--color-overlay: rgb(8 9 7 / 72%);
--panel-highlight: inset 0 1px 0 rgb(255 255 255 / 4%);
--panel-gradient: linear-gradient(180deg, #1c1f1a 0%, #191b17 48px);  // the only "metal" allowed
--shadow-popover: 0 8px 24px rgb(0 0 0 / 55%);
```

### 4.4 Colours: light

```scss
--color-bg: #e4e5dd;
--color-bg-deep: #d8d9cf;
--color-surface: #f1f2ec;
--color-surface-raised: #f8f8f4;
--color-surface-sunken: #e9eae3;
--color-surface-hover: #e6e7df;
--color-border: #d2d4c8;
--color-border-strong: #b5b8aa;
--color-text: #1b1d18;
--color-text-muted: #545949;
--color-text-dim: #848a7a;
--color-accent: #c45a17;
--color-accent-hover: #a94c12;
--color-accent-soft: rgb(196 90 23 / 10%);
--color-accent-contrast: #fff8f1;
--color-steel: #2f5f80;
--color-success: #3e8a1c;
--color-warning: #9a7a00;
--color-danger: #b8321f;
--color-premium: #9a6a12;
--color-elite: #8f7020;
--panel-highlight: inset 0 1px 0 rgb(255 255 255 / 70%);
--panel-gradient: linear-gradient(180deg, #f6f6f1 0%, #f1f2ec 48px);
--shadow-popover: 0 8px 24px rgb(40 40 20 / 18%);
```

Keep `--rating-*` (both palettes), `--color-mastery-*`, `--color-ally/enemy*`, `--contour-filter` and `--flag-opacity` as they are.

### 4.5 Radii, borders, shadows, spacing, layout

```scss
--radius-xs: 1px;
--radius-sm: 2px;   // buttons, inputs, badges, panels
--radius-md: 2px;
--radius-full: 999px; // ONLY avatars and status dots
```

Delete `--radius-lg`, `--radius-xl`, `--chamfer-*`, `--elevation-1/2/3`, `--glow-accent`, `--bevel`, `--brushed`, `--dusk`, `--noise`, `--noise-opacity`, `--grid-line`, `--camo`, `--rivet-*`, `--shine-*` (except where the overlay widgets for OBS need them; move those into `entities/streamer/overlay` locally).

Borders: always `1px solid var(--color-border)` between rows and `1px solid var(--color-border-strong)` around panels. There are no 2 px borders except the active-tab underline and the table row accent.

Shadows: none on panels or cards. Only `--shadow-popover` on popovers, menus, dialogs and the command palette.

Spacing (dense 4-based):

```scss
--space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
--space-6: 20px; --space-7: 24px; --space-8: 32px; --space-9: 48px;
```

This is a **renumbering**. Implementers must either keep the old names and change values, which silently densifies everything (the preferred first pass), or grep-replace. Remove `--space-10`/`--space-11` usages: nothing on a page needs 72–96 px.

Layout:

```scss
--shell-width: min(100% - 32px, 1360px);  // was 1240; data wants width
--header-height: 48px;                    // was 64
--subnav-height: 40px;
--row-h: 36px; --row-h-compact: 30px; --row-h-media: 44px; // media = row with small_icon 124×31
--gap-panel: 8px;     // gap between adjacent panels in a grid
--gap-section: 32px;  // between page sections (24px on mobile)
```

Motion:

```scss
--duration-fast: 0.1s; --duration-base: 0.16s;  // delete --duration-slow
--ease-out: cubic-bezier(0.2, 0, 0, 1);
```

### 4.6 `app/globals.scss`

- `body { background: var(--color-bg); }`. Delete `var(--dusk), var(--brushed)`, `background-attachment: fixed` and the whole `body:after` noise overlay.
- Delete `.otmetki-toaster [data-sonner-toast]:before` (the 3 px glowing bar). Tone the toast with a 2 px left border instead. Radius 2 px.

### 4.7 `shared/styles/_mixins.scss`

Delete:
- `plate`, `riveted-plate`, `rivets`, `chamfer-path`
- `stencil`, `camo-divider`, `corner-brackets`
- `accent-outline-hover`, `tile-grid` (4-up uniform tile grid)

Replace with:

```scss
@mixin panel { background: var(--panel-gradient); border: 1px solid var(--color-border-strong); border-radius: var(--radius-sm); box-shadow: var(--panel-highlight); }
@mixin label { color: var(--color-text-muted); font-family: var(--font-display); font-size: var(--text-2xs); font-weight: 600; letter-spacing: var(--tracking-label); text-transform: uppercase; }
@mixin heading($size: var(--text-xl)) { font-family: var(--font-display); font-size: $size; font-weight: 700; letter-spacing: var(--tracking-display); line-height: var(--leading-tight); text-transform: uppercase; }
@mixin numeric($size: var(--num-md)) { font-family: var(--font-display); font-size: $size; font-weight: 600; font-variant-numeric: tabular-nums lining-nums; line-height: 1; }
```

`hud-label` becomes an alias of `label` (so it's no longer mono). `display()` becomes `heading()`. `popup-motion` is reduced to opacity only, 100 ms.

`_animations.scss`: delete `scanner` and `otmetki-scan`. Keep `spin` (only for button loading).

---

## 5. Component rules (`apps/client/ui-kit`)

### 5.1 Button (`atoms/Button/Button.module.scss`)

- Heights: sm 28, md 32, lg 40. Padding 0 12 / 0 14 / 0 18. Font: condensed 600, 13 px (lg 14), uppercase, tracking 0.04em.
- Remove `chamfer-path`, the shine sweep `.primary:after`, the glow hover, the `translateY(1px)` press, and the gradient fill.
- **primary**: flat `--color-accent` fill, `--color-accent-contrast` text, radius 2. Hover `--color-accent-hover`.
- **secondary**: `--color-surface-raised` fill, 1 px `--color-border-strong`, text `--color-text`. Hover: border `--color-text-dim`, bg `--color-surface-hover`.
- **ghost**: transparent, muted text. Hover bg `--color-surface-hover`.
- **danger**: flat `--color-danger`.
- Only one primary per view region.
- Icons inside buttons are 14 px, and only when the icon carries meaning (search, external link, download). No arrow icons after every CTA.

### 5.2 Tabs (`molecules/Tabs/Tabs.module.scss`)

- Tab strip height 36 px, label style (condensed 600, 12 px, uppercase). Active: `--color-text` + 2 px `--color-accent` underline. Inactive: muted.
- Remove the gradient indicator, its glow, the slide animation (`translate` 0.45 s) and the panel enter transform. The indicator snaps in 100 ms or less.
- No icons in tabs by default (drop `PROFILE_TAB_ICONS` in `views/player-profile/config/profile-tabs.config.ts`).
- Count badge: plain muted number in parentheses: `Танки 214`.
- **Panel-top tabs**: when tabs switch a panel's content, the strip sits *inside* the panel header (the game's tab-strip-on-panel pattern), not floating above the panel.

### 5.3 SegmentedControl / ToggleChips (filters)

Filters are the core of every data page. They should look like one row of compact toggles, not like orange pills.

- Height 28. Items separated by 1 px `--color-border`. Container has a 1 px `--color-border-strong` border, radius 2.
- Active item: `--color-surface-hover` bg + `--color-text` + a 2 px accent **bottom** bar. **No solid orange fill** (today `/tanks` and `/top` show three solid orange blocks at once).
- Tier toggles show Roman numerals. Class toggles show the glyph only, with a tooltip. Nation toggles show the nation emblem 16 px.
- Filter bar = one horizontal row (wraps on mobile into a horizontally scrollable row). No enclosing card, no labels like "УРОВЕНЬ / КЛАСС / НАЦИЯ" stacked vertically: use `aria-label` plus the group's inline glyphs.

### 5.4 DataTable (`organisms/DataTable/DataTable.module.scss`): the most important component

- Container: `@include panel`. No `--brushed`. Radius 2.
- Header row: height 32, `--color-surface-raised`, label style 11 px, bottom 1 px `--color-border-strong`. Sorted column: text `--color-text` + a small ▲/▼ glyph. Unsorted columns show **no** sort icon (today every header shows ⇅).
- Body rows: height `--row-h` (36), or `--row-h-media` (44) when the first column has a `small_icon`. 1 px `--color-border` between rows. No zebra.
- Hover: bg `--color-surface-hover` + 2 px accent inset on the left (keep), 0 ms transition.
- Numeric cells: condensed 600, 14 px, tabular, right-aligned. Units in muted 11 px after a thin space.
- **Rating cells** (WR, WN8, BI): colour the **text** with `--rating-*`. Don't wrap it in a pill. `RatingBadge` stays for hero/stat usage only. Optional colour-blind mode keeps the pattern swatch as a 3 px left bar.
- **Tank column** is always `TankIdentity` with `image='small'` (124×31 at 100 %, or 93×23 at 75 % on mobile), then class glyph, Roman tier, then name (gold if premium), with the nation shown as a faint 2 px left border in the nation colour (see §6).
- Rank column: `#` right-aligned, dim; top-3 ranks in `--color-premium`.
- Caption row ("0 танков · клик по строке — страница танка"): replace with a toolbar line above the table: count on the left ("214 танков"), source line and "обновлено" on the right. Delete the "клик по строке…" hint.
- Mobile: horizontal scroll with the tank column sticky-left. Don't turn tables into card stacks.
- Footer: pagination 28 px buttons, and "Данные: API Леста Игры · {time}".

### 5.5 Panel / Card (`molecules/Card/Card.module.scss`)

- Variants reduce to **`panel`** (default: `@include panel`) and **`well`** (sunken, for nested groups). Delete `plate`, `riveted`, `flat`.
- Delete `.interactive:after` corner brackets, the scale transform and the gradient border on hover. Interactive panels: border-color `--color-text-dim` on hover, nothing else.
- Panel header (`CardHeader`): height 36, bottom hairline, `label`-style title on the left (condensed 600, 12 px uppercase, `--color-text`), optional tab strip or actions on the right. Delete the eyebrow with the orange 14 px dash.
- Padding: sm 8, md 12, lg 16. Nothing larger.
- Panels in a grid sit with a gap of `--gap-panel` (8 px), like the client's joined info panels.

### 5.6 StatTile → `KeyFigure` (`molecules/StatTile`)

- Layout: label (11 px, uppercase, muted) above the value (`numeric(--num-md)`), then an optional delta (12 px, green/red, `+0,42 %`) and an optional hint in dim 12 px on one line.
- Remove: the plate/chamfer, the glowing 28×2 tone bar on top, the icon slot (lucide icons on stats are slop), and `AnimatedNumber` count-ups.
- Group tiles in a **`KeyFigures` strip**: one panel split by vertical 1 px separators (like the service-record header). Don't use 3–4 separate floating cards.
- Sparkline is allowed inside the tile, 1 px line, no area fill, no dot.

### 5.7 Badge (`atoms/Badge`)

- 18 px high, radius 2, condensed 600, 11 px, uppercase, tracking 0.04em. No mono.
- Use it only for: "Прем", "Элита", "Новинка патча", status ("Активен", "Бан"), plan tier. **At most one badge per row or card.**
- Remove `solid` orange badges from lists.

### 5.8 Inputs / Select / NumberField / Search

- Height 32 (lg 40 for the home search). `--color-surface-sunken` fill, 1 px `--color-border-strong`, radius 2. Focus: border `--color-accent`, no ring glow.
- The search placeholder is concrete: «Ник игрока, танк или тег клана». The keyboard hint `Ctrl K` stays, as 11 px condensed muted text inside the input.
- NumberField: stepper buttons flush inside the input, 1 px separators. Value condensed 600 tabular.

### 5.9 Tooltip / Popover / Dialog / Drawer

- `--color-surface-raised`, 1 px `--color-border-strong`, radius 2, `--shadow-popover`.
- Tooltip text is 12 px. Stat tooltips use the game pattern `Название — значение` + a one-line explanation.
- Motion: opacity only, 100 ms (edit `popup-motion`).

### 5.10 EmptyState / ErrorState (`molecules/EmptyState`)

- Inline, left-aligned, inside the panel where data would be: a 16 px icon (or class glyph) + one line of text + an optional small secondary button. Height at most 120 px.
- Delete the 104 px "scope" rings, the radial accent glow, the `code` eyebrow and the centred display title.
- Copy is short and factual: «Нет боёв за период», «Сервер статистики не отвечает · Повторить». Don't write two sentences.

### 5.11 Skeleton (`atoms/Skeleton`)

- Flat `--color-surface-hover` blocks shaped like the final rows (36 px rows, real column widths). Static, or a 1.2 s opacity pulse 0.6→1.
- Delete the orange/steel scanner gradient (`/tanks` and `/top` currently show orange-streaked bars, and `/top` shows a single 560 px orange-edged block).

### 5.12 Header / nav (`widgets/site/site-header`)

- 48 px, solid `--color-bg-deep` with a bottom 1 px `--color-border`. No `backdrop-filter`, no transparency change on scroll.
- Left: logo glyph (static; delete the drop-shadow glow and `AnimatedLogo` use in `SiteBrand.tsx`) + wordmark «Три отметки» in condensed 700, 16 px. The sub-line «Мир танков · статистика» at 9 px/0.22em goes away; the positioning goes into the home page instead.
- Nav: condensed 600, 13 px, uppercase. Active = text + 2 px accent underline flush with the header bottom.
- **Reorder the nav around the game**: `Игроки · Танки · Отметки · Топы · Кланы · Карты · Инструменты`. Move `Стримерам` and `Разработчикам` into the footer and a "Ещё" menu. They are secondary audiences and dilute the "game stats" reading.
- Right: search input (240 px), then **game version badge** `Обновление 1.45` (from `GameVersion`), then a status dot for "API Лесты: работает/задержка" (from the server health endpoint), then theme and settings. Remove the RU/EN toggle from the header (move it to settings or the footer).

### 5.13 Footer (`widgets/site/site-footer`)

- Compact: 1–2 rows, max ~120 px desktop. Row 1: the three legal lines on one line separated by `·` («© Леста Игры. Все права защищены · Данные: API Леста Игры — tanki.su · Центр поддержки»). Row 2: our © + version + links (API, Стримерам, Дизайн-система).
- Delete the brand block with the tagline and the 8-link "Разделы" column: it duplicates the header.

### 5.14 SectionHeader / PageHero (`molecules/SectionHeader`, `organisms/PageHero`)

- **SectionHeader** = one line: title (`heading(--text-lg)`) on the left, then an optional one-line muted description inline or below at 13 px, and a right-aligned action link ("Все →" is fine as text). Delete the `camo-divider` `:before`, the `// 01` `index` box, the `ticks` ruler and the `eyebrow`.
- **PageHero** is replaced by **`PageHead`**: breadcrumbs (12 px) → H1 (28 px) → one muted line of factual description → a `KeyFigures` strip or filters. Max height ~160 px desktop. Delete the `watermark` outline text, the `.grid` background, the stencil `index` and the `line` gradient.

### 5.15 Charts (`organisms/ChartKit`, `molecules/Sparkline`, `organisms/CalendarHeatmap`)

- 1 px gridlines in `--color-border`, axis labels 11 px condensed muted, series lines 1.5 px.
- Colours: accent for the primary series, steel for the comparison, rating colours only for rating-scaled data.
- No area gradients, no glow, no draw-on animations (remove `whileInView` from `ChartCanvas.tsx`, `Sparkline.tsx`, `CalendarHeatmap.tsx`, `ProgressBar.tsx`, `ProgressRing.tsx`).
- Tooltips follow §5.9.
- `ProgressRing`: don't use it for ratings. The profile BI ring (156 px) becomes a key figure. Use a ring at most for MoE % (48 px, 3 px stroke).

### 5.16 Delete from ui-kit

- `atoms/Burst` (particle burst)
- `atoms/AnimatedNumber`: replace with a static formatted number. Keep a `useCountUp` only for the streamer OBS overlay (`entities/streamer/overlay`)
- `mixins.tile-grid` users

---

## 6. Iconography

- **Game glyphs from `@otmetki/icons` are primary**:
  - `TANK_CLASS_ICONS` (rhombus convention, done)
  - `toRoman`
  - `NATION_ICONS`
  - `MasteryIcon`
  - MoE marks
  - shell types (`ShellApIcon` …)
  - `ArmorIcon`, `SpottingIcon`, `RadioIcon`, `CrosshairIcon`
- **lucide-react is only for UI chrome**: search, chevrons, external link, close, settings, theme, copy, download, sort. Remove lucide from:
  - `shared/constants/site-nav-icons.ts` (`Users`, `Trophy`, `Wrench`, `Radio`, `Code2`): the nav doesn't need icons at all
  - `views/player-profile/config/profile-tabs.config.ts` (`CalendarDays`, `ChartSpline`, `History`, `LayoutDashboard`, `Lightbulb`)
  - `views/home/ui/components/FeatureGrid/FeatureGrid.tsx` (`ArrowUpRight`)
  - `views/home/ui/components/LiveCounters/LiveCounters.tsx` (`Users`, `Clock`)
  - `views/build/config/build-icons.config.ts` (`Cog`, `Cpu`, `Flame`, `Gauge` …): use API provision and crew-skill images instead (§3)
  - `views/plus/config/plus-benefits.config.ts`, `views/streamers/config/landing.config.ts`: plain text lists
  - tab icons in `/top` (`Игроки / Кланы / Восходящие звёзды / Отметки / Стримеры`)
- **Nation identity**: 16 px emblem in filters. In rows, a 2 px left border in the nation tint (`--nation-ussr: #9c2f25`, `--nation-germany: #6d6f63`, `--nation-usa: #4b6a8a`, `--nation-uk: #7c6a44`, `--nation-france: #3f5f8f`, `--nation-china: #b0402c`, `--nation-japan: #c9c2b0`, `--nation-czech: #4f7aa8`, `--nation-sweden: #d0a52a`, `--nation-poland: #b83a3a`, `--nation-italy: #4f8a4b`, `--nation-intunion: #6f7a86`). Behind `big_icon` renders, a 135° gradient from the nation tint at 22 % to transparent. That's our own colour language replacing the flag textures. Keep `NationFlag` backdrops only on the tank page hero at `--flag-opacity`.
- **Tier**: Roman numeral in condensed 700. In tables it's muted. Top-tier (X/XI) in `--color-text`.
- **Premium**: name in `--color-premium`, glyph variant `premium` (no glow filter: set `--otmetki-class-glow: transparent`). Elite: laurel variant.
- **Emoji**: none anywhere, including i18n strings.
- Icon sizes: 14 (inline), 16 (rows/filters), 20 (panel headers). Nothing between 24 and 72 except tank images and medals.

---

## 7. Motion rules

Allowed:
- hover colour and background changes: 0–100 ms
- tab underline snap
- popover opacity: 100 ms
- drawer slide: 160 ms
- skeleton opacity pulse
- button loading spinner
- chart tooltip follow
- OBS overlays (`entities/streamer/overlay`): these keep their animations; they're a different product surface

Cut (all of it):
- `HEAD_REVEAL` (blur + 20 px rise), `STAGGER`, `STAGGER_ITEM`, `SCALE_IN`, `SLIDE_UP`, `ROW_ITEM` and `REVEAL_VIEWPORT` usage in pages. **72 files** use `HEAD_REVEAL/STAGGER/SCALE_IN`, and 30+ use `whileInView`. Replace `motion.*` elements with plain elements. Delete the presets from `shared/lib/motion/motion.ts` once no view imports them. This also fixes the blank-until-hydration heroes.
- idle infinite animations:
  - `HomeHero` tracers and `live-pulse`
  - `HeroScope` rotating ring and blip pulses
  - `TankHero .pulse` `dossier-blink`
  - `DevelopersHero .live`
  - `LiveLamp` pulse on the landing (keep a static red dot)
  - `SiteHeader` keyframes
  - `CommandPalette` keyframes
  - `BranchEdge` animated edges in `/tree`
  - `MapCard`, `PushCard`, `CalcKit`, `MysteryTank` keyframes (except its reveal)
- `AnimatedNumber` count-ups (16 view files), `AnimatedLogo`, `AnimatedMarkOfExcellence` on home
- button shine sweep and press translate; card corner-bracket scale-in; tab indicator slide; panel enter transform
- `transition` of 0.45 s anywhere

---

## 8. Page layouts

General page skeleton (all data pages):

```
[header 48]
[PageHead: breadcrumbs · H1 · 1 line · KeyFigures strip]        ≤160px
[filter row 28–32]
[main panel(s): table / grid]   [optional right rail 320px: related, context]
[source line]
[footer ≤120]
```

### 8.1 Home `/` (`views/home`): rebuild as a stats hub

Remove:
- `HomeHero` (slogan, gradient text, tracers, grid, chips)
- `HeroScope` (fake radar with «Цель захвачена», «Дальность 445 м»)
- `FeatureGrid` (8 uniform cards with lucide icons, `01–08` indexes and marketing blurbs)
- `MarksShowcase` (three animated MoE icons plus a CTA card that holds no data)
- all `// 0x` SectionHeaders
- the copy keys `home.hero.*`, `home.scope.*`, `home.features.*`, `home.marks.title` ("Отметки вспыхивают"), `home.topPlayers.title` ("Кто сейчас держит фронт")

New structure (desktop, 1360 shell):

1. **Top band** (~140 px, no hero):
   - Left: H1 «Статистика «Мир танков»» (28 px) plus one line «Игроки, танки, отметки и кланы по данным API Леста Игры». Under it, the **big search** (40 px, 640 px wide) with the placeholder «Ник игрока, танк или тег клана». Under the search, "Недавно искали" as a plain text list, max 6 items.
   - Right: a **server status panel** (320 px):
     - `Обновление 1.45` + date
     - «Активных игроков за час ≈ N» (our estimate, with an ⓘ tooltip)
     - «Боёв за сутки»
     - «Данные обновлены 4 мин назад»
     - a 1 px sparkline of activity over 24 h

   Data comes from `use-live-counters` and `GameVersion`.
2. **Garage strip: «Популярная техника за неделю»**. A horizontal row of `TankSlot`s: `big_icon` 160×100 on a nation-tint gradient, tier + class glyph top-left, name bottom (gold for premium), WR % bottom-right in the rating colour. 8–10 visible, scrollable. This is the single most "it's the game" element and must be the first thing below the fold line on desktop (above it on 1440×900).
3. **Three-column row** (each a panel with a 36 px header and a tab strip):
   - **«Сильнейшие танки патча»**: tabs `X · IX · VIII`. A table of 10 rows: small_icon, name, WR, Δ WR vs the previous patch, battles. The footer link "Все танки".
   - **«Лучшие игроки недели»**: tabs `WN8 · Броня-Индекс · Урон`. 10 rows: rank, nick, [clan tag], battles, value in rating colour.
   - **«Отметки: пороги за сутки»**: 10 rows of tanks whose 3-MoE threshold moved most: small_icon, name, the threshold for 3 marks, Δ (green when it got easier).
4. **Two-column row**:
   - **«Новости игры»**: 6 headline rows from the tanki.su RSS (date · headline · ↗ tanki.su)
   - **«Кланы: активность за неделю»**: emblem x32, [TAG], name, battles in Укрепрайон / ГК
5. Footer.

Mobile 390:
- search → status panel (collapsed into one line: «Обновление 1.45 · ≈ N игроков в час»)
- garage strip (scroll-snap, 2.3 slots visible)
- the three tables become stacked panels, each limited to 5 rows plus a "Все" link
- news

No section needs a description paragraph.

### 8.2 Tanks `/tanks` (`views/tanks`)

- Remove `TanksHero` (hero title «Сила танков по данным», AnimatedNumber tiles, blank space above the filters in `tanks-desktop.png`).
- PageHead: «Статистика танков» + one line «Процент побед, урон и популярность техники в случайных боях · {period}» + a KeyFigures strip (Танков в выборке · Боёв за период · Лидер по WR diff with small_icon).
- One filter row: period segmented (24 ч · 7 дн · 14 дн · 30 дн · 60 дн) | skill cohort | tiers I–XI | class glyphs | nation emblems | Все/Прокачиваемые/Премиум | view switch (Таблица/Тир-лист, icon-less). Delete the enclosing filter card and the vertical label column.
- Table per §5.4, with `small_icon` rows 44 px. Columns: `#`, Танк, Ур., Победы, WR diff, Урон, ДПМ? (if available), Фраги, Засвет, Выжил, Бои. The popularity cell becomes the plain battles number + rank `#12` dim.
- Tier list view: rows S/A/B/C/D, each a horizontal wrap of `TankSlot` compact tiles (124×31 small_icon + name). Delete the `TierCard` glow hover (`views/tanks/ui/components/TierCard/TierCard.module.scss` `box-shadow: 0 0 16px`).

### 8.3 Tank `/t/[slug]` (`views/tank`)

- Hero becomes a **garage view**. Remove the 6.5rem gradient title, the `.pulse` blink, the corner-bracket `.photo` frame and `text-shadow`. Structure:
  - Left 60 %:
    - tank render `big_icon` at 2× (320×200) on a nation-tint gradient plus a faded `NationFlag`
    - above the render, a line: class glyph · Roman tier · nation name · «Прем»/«Прокачиваемый» · «В игре с обновления 1.x»
    - the tank name at 28 px (gold if premium)
  - Right 40 %: the **parameters panel** (game-like):
    - rows of `label · value · thin bar vs. the tier average`: Прочность, Урон (альфа), Пробитие, ДПМ, Перезарядка, Сведение, Разброс, Обзор, Скорость, Бронирование лба
    - a tab strip on top: `Сток / Топ`
- Below: a KeyFigures strip «Сервер за 7 дн»: WR (rating colour, `--num-xl`), Средний урон, Бои, Игроков, WR diff.
- Sections (as panels, no `RevealSection` animation):
  - «Отметки»: the MoE thresholds 65/85/95/100 as a 4-column number strip + a threshold history chart
  - «Мастер»: thresholds with mastery badges (API achievement images)
  - «Популярные сборки»: provision and crew-skill images from the API
  - «Лучшие игроки на танке»: a table
  - «Изменения по патчам»: a list with the patch number in a badge
- Use `NationFlag` only here.

### 8.4 Player `/p/[nick]` (`views/player-profile`): "service record"

- ProfileHero becomes a **service-record header** in one panel:
  - Left: nick (28 px), clan emblem x32 + [TAG], «Аккаунт с 2013 · последний бой 2 ч назад», and actions (Сравнить, Подписаться) as secondary sm buttons.
  - Right: KeyFigures strip `WN8 | Броня-Индекс | Победы | Бои | Средний урон | Средний опыт`. Values `--num-lg`, WN8 and WR in rating colours.
  - Delete the 156 px `ProgressRing`, the `AnimatedNumber`s, the `.grid` bg and the staggered motion.
- The period switch (Всё время · 1000 боёв · 30 дн · 7 дн · 24 ч) is a segmented control in the header's bottom row.
- Tabs become a panel-top strip without icons: `Обзор · Техника · Сессии · Отметки · Достижения · Графики · История`. Add **«Достижения»**: a grid of API medal images (48 px) with counts, grouped by `section` (Эпические, Герои битвы, Памятные…).
- Overview: a 2-column grid of panels:
  - «Любимая техника»: a garage strip of the top 6 by battles using `big_icon`, with per-tank WR/WN8/marks
  - «Отметки»: counts of 1/2/3 marks with MoE glyphs + the nearest-to-next list
  - «Рейтинг по периодам»: a table, not cards
  - «Активность»: the calendar heatmap, flat
- Techника tab: the table per §5.4 with `small_icon`, mastery badge, marks glyph + %, battles, WR, WN8, damage.

### 8.5 Marks `/marks` (`views/marks`)

- Remove the MarksHero gradient title («Сколько урона нужно на три отметки»), the explanatory lead (collapse it into an ⓘ «Как считаются отметки» disclosure) and the camo dividers.
- PageHead: «Отметки на стволе» + «Пороги 65/85/95/100 % по всем танкам · обновлено {date}» + KeyFigures (Танков в базе · Обновлено · Окно расчёта).
- Main: the thresholds table (small_icon, Ур., 1 отм., 2 отм., 3 отм., 100 %, Δ за 30 дн). Right rail (320): «Ближе всего к отметке» nick lookup (compact input + result list) and «Прогноз» calculator link.
- Delete the "Введите ник" empty-state card with rings. Show an inline hint row in the rail instead.

### 8.6 Top `/top` (`views/top`)

- PageHead «Топы» + one line. The tabs `Игроки · Кланы · Восходящие · Отметки · Стримеры` go into the panel-top strip, without lucide icons and without the solid orange active fill.
- The filter row is inline (Показатель · Период · Уровень · Класс · Танк), each 28–32 px. Delete the filter card.
- `TopPodium`: remove it (a podium is landing-page decoration). The top-3 rows get gold/silver/bronze rank numbers.
- Rows 36 px: #, nick, [clan], battles, value (rating colour), and for tank-specific tops the small_icon.

### 8.7 Clans `/clans` and `/c/[tag]` (`views/clans`, `views/clan`)

- Delete the ClansHero grid bg and the «// Штаб · Кланы» eyebrow.
- The list is a table: emblem x32, [TAG] (condensed 700), name, members, avg WN8, WR, battles in «Укрепрайон», ГК provinces.
- Clan page:
  - Header: emblem x195 at 96 px, [TAG] name, motto, a KeyFigures strip.
  - Tabs: `Состав · Укрепрайон · Глобальная карта · История`.
  - Роstер table with roles in game vocabulary (Командующий, Заместитель, Офицер штаба…).
- Unify the tone: "ты" vs "вы" is mixed in `clans.*` strings. Pick **вы**.

### 8.8 Tools `/tools` (`views/tools`)

- Remove ToolsHero. Today it's a ~700 px blank area above the calculator (`tools-desktop.png`).
- Layout: a left rail list of calculators (Опыт и кредиты до танка · Отметки · Экипаж · Боевой пропуск · Золото · Экономика · Цель), 220 px, plain text rows with an active accent bar. On the right, the active calculator as a two-panel layout: inputs panel | result panel (big numbers `--num-lg`: «Осталось боёв ≈ 124», «Не хватает опыта 86 400»).
- The tank picker shows `small_icon` in options.
- Delete the crosshair empty-state rings.

### 8.9 Streamers `/streamers` (`views/streamers`)

- Keep this a product page for a secondary audience, but de-slop it:
  - one PageHead
  - a real screenshot/preview of *our* overlay rendered with the live component (not an `OnAirMonitor` mock with a fake chat)
  - a 3-step list
  - one CTA
- Delete `FlowSection`/`ToolsSection` card grids with lucide icons, the gradient title, the camo dividers and the scroll-reveal.
- Remove it from the main nav (§5.12).

### 8.10 Developers `/developers` (`views/developers`)

- Delete `TelemetryConsole`, the gradient title and `.live` pulse, the macOS window "lamps" in `CodeBlock` (`ui-kit/molecules/CodeBlock/CodeBlock.module.scss` `.lamps`), and the camo dividers.
- Layout like a docs page: PageHead + limits as a KeyFigures strip (запросов в день · RPS · версия), then Quickstart (code), the endpoint explorer table, webhooks, and plans as a comparison **table** rather than 3 cards.
- Keep the legal note about Lesta's commercial ban, styled as a bordered note, not a yellow accent bar.

### 8.11 Other heroes to convert to `PageHead` (same rules)

- `views/players/ui/components/PlayersHero`
- `views/compare-tanks/ui/components/CompareHero` (drop «Лоб в лоб»)
- `views/tree/ui/components/TreeHero`
- `views/maps/ui/components/MapsHero`
- `views/play/ui/components/GuessHero`
- `views/plus/ui/components/PlusHero`
- `views/notifications/ui/components/NotificationsHero`
- `views/telegram-link/ui/components/LinkHero`
- `views/login/ui/LoginPage.module.scss`
- `views/clan/ui/components/ClanHero`
- `views/streamer/ui/components/StreamerHero`
- `views/build/ui/components/BuildHero`

---

## 9. Copy rules (i18n: `apps/client/shared/i18n/locales/{ru,en}/<namespace>.json`)

- H1 = the noun of the page («Статистика танков», «Отметки на стволе», «Топы», «Кланы»). No metaphors.
- Descriptions: max 1 line, factual, with the period or source.
- Delete every `eyebrow` key starting with `// ` (9 strings) and all `index='// 0x'` props (31 usages in `views/`).
- Delete: `home.hero.*`, `home.scope.*`, `home.features.*`, `home.marks.levels/threshold/ctaBody`, `tanks.compare.hero.title` «Лоб в лоб», `home.topPlayers.title`, `home.marks.title`, «Быстро, красиво и без лишнего шума».
- Use game terms: ДПМ, альфа, пробитие, ОО (обзор), засвет, блок, «Урон по засвету/гусле», «ЛБЗ», «Натиск», «Стальной охотник», «Линия фронта», «Укрепрайон», «ГК», «Мастер / 1-я / 2-я / 3-я степень».
- Always «вы».
- Every page's first screen shows «Мир танков» at least once (H1 or subline).

---

## 10. Slop deletion checklist (file by file)

Tokens and global:
- [ ] `apps/client/shared/styles/_tokens.scss`: apply §4, delete `--noise`, `--camo`, `--dusk`, `--brushed`, `--grid-line`, `--glow-accent`, `--elevation-*`, `--chamfer-*`, `--rivet-*`, `--shine-*`, `--text-4xl`, `--radius-lg/xl`, `--stretch-condensed`, `--duration-slow`
- [ ] `apps/client/app/globals.scss`: body bg, the `body:after` noise, the toast `:before` bar
- [ ] `apps/client/shared/styles/_mixins.scss`: delete `plate`, `riveted-plate`, `rivets`, `chamfer-path`, `stencil`, `camo-divider`, `corner-brackets`, `tile-grid`, `accent-outline-hover`; add `panel`, `label`, `heading`, `numeric(size)`
- [ ] `apps/client/shared/styles/_animations.scss`: delete `scanner`, `otmetki-scan`, `otmetki-pop-in`
- [ ] `apps/client/shared/config/fonts/*`: Tektur/Onest/Plex → Fira Sans Condensed / Fira Sans / JetBrains Mono (Google, cyrillic); delete `files/*.woff2`
- [ ] `apps/client/shared/lib/motion/motion.ts`: remove `HEAD_REVEAL`, `STAGGER*`, `SCALE_IN`, `SLIDE_UP`, `ROW_ITEM` after the views are migrated

ui-kit:
- [ ] `ui-kit/atoms/Button/Button.module.scss`: chamfer, shine sweep, glow, gradient
- [ ] `ui-kit/molecules/Card/Card.module.scss`: plate/riveted/flat variants, corner brackets, gradient hover
- [ ] `ui-kit/molecules/StatTile/*`: plate, glow bar, icon slot, AnimatedNumber
- [ ] `ui-kit/molecules/Tabs/Tabs.module.scss`: gradient/glow indicator, slide, panel transform
- [ ] `ui-kit/molecules/SectionHeader/*`: camo divider, `// index` box, ticks ruler, eyebrow
- [ ] `ui-kit/organisms/PageHero/*`: replace with `PageHead` (watermark, grid, stencil index)
- [ ] `ui-kit/organisms/DataTable/DataTable.module.scss`: brushed bg, 48 px rows, idle sort icons, caption hint
- [ ] `ui-kit/molecules/EmptyState/EmptyState.module.scss`: scope rings, radial glow, display title
- [ ] `ui-kit/atoms/Skeleton/Skeleton.module.scss`: orange scanner
- [ ] `ui-kit/atoms/Badge/Badge.module.scss`: mono font, `solid` variant usage in lists
- [ ] `ui-kit/atoms/RatingBadge/*`: keep for heroes. In tables, use coloured text
- [ ] `ui-kit/molecules/CodeBlock/CodeBlock.module.scss`: `.lamps` window dots, plate
- [ ] `ui-kit/atoms/Burst/*`, `ui-kit/atoms/AnimatedNumber/*`: delete (move count-up into the streamer overlay only)
- [ ] `ui-kit/atoms/ProgressRing/*`: not for ratings. Max 48 px
- [ ] `ui-kit/molecules/Tooltip`, `Popover`, `Dialog`, `Drawer`, `Select`: radius 2, `--shadow-popover`, opacity-only motion
- [ ] `ui-kit/organisms/ChartKit/components/ChartCanvas/ChartCanvas.tsx`, `ui-kit/molecules/Sparkline/Sparkline.tsx`, `ui-kit/organisms/CalendarHeatmap/CalendarHeatmap.tsx`, `ui-kit/atoms/ProgressBar/ProgressBar.tsx`: remove `whileInView`

widgets:
- [ ] `widgets/site/site-header/ui/SiteHeader.module.scss`: blur/transparent header → solid 48 px; add the version badge and API status
- [ ] `widgets/site/site-header/ui/components/SiteBrand/*`: `AnimatedLogo`, drop-shadow glow, 9 px tagline
- [ ] `widgets/site/site-footer/ui/*`: compact 2-row footer
- [ ] `shared/constants/site-nav.ts` + `site-nav-icons.ts`: reorder the nav, drop the lucide icons, move Стримерам/Разработчикам

views (gradient text `background-clip: text`; delete in all 12):
- [ ] `views/home/ui/components/HomeHero/HomeHero.module.scss`
- [ ] `views/developers/ui/components/DevelopersHero/DevelopersHero.module.scss`
- [ ] `views/login/ui/LoginPage.module.scss`
- [ ] `views/marks/ui/components/MarksHero/MarksHero.module.scss`
- [ ] `views/play/ui/components/GuessHero/GuessHero.module.scss`
- [ ] `views/players/ui/components/PlayersHero/PlayersHero.module.scss`
- [ ] `views/plus/ui/components/PlusHero/PlusHero.module.scss`
- [ ] `views/streamers/ui/components/StreamersHero/StreamersHero.module.scss`
- [ ] `views/tank/ui/components/TankHero/TankHero.module.scss`
- [ ] `views/telegram-link/ui/components/LinkHero/LinkHero.module.scss`
- [ ] `views/tools/ui/components/ToolsHero/ToolsHero.module.scss`
- [ ] `views/tree/ui/components/TreeHero/TreeHero.module.scss`

views (decorative grid backgrounds via `--grid-line`; delete in all):
- ClanHero, ClansHero, TelemetryConsole, DevelopersHero, HomeHero, MapsHero, MarksHero, GuessHero, ProfileHero, PlusHero, StreamerHero, OnAirMonitor, StreamersHero, the tank `HeroBackdrop`, MiniAppCard, CalcKit, ToolsHero, TreeHero

views (fake gadgets and idle animation):
- [ ] `views/home/ui/components/HeroScope/*`: delete the component
- [ ] `views/home/ui/components/HomeHero/HomeHero.constants.ts` (`HERO_TRACERS`): delete
- [ ] `views/home/ui/components/FeatureGrid/*`, `views/home/config/features.ts`: delete
- [ ] `views/home/ui/components/MarksShowcase/*`: delete (replaced by the marks-movement table)
- [ ] `views/developers/ui/components/DevelopersHero/components/TelemetryConsole/*`: delete
- [ ] `views/streamers/ui/components/OnAirMonitor/*`, `ChatPreview/*`: replace with a live overlay preview
- [ ] `views/tank/ui/components/TankHero/TankHero.module.scss`: `.pulse`, `dossier-blink`, `.photo` corner brackets, `text-shadow`
- [ ] `views/tank/ui/components/RevealSection/*`: remove the reveal animation (keep as a plain section wrapper or delete)
- [ ] `views/tanks/ui/components/TierCard/TierCard.module.scss`: glow hover
- [ ] `views/tree/ui/components/BranchEdge/BranchEdge.module.scss`: animated edges
- [ ] `views/player-profile/ui/components/ProfileHero/*`: ring, AnimatedNumber, grid, stagger
- [ ] `views/player-profile/config/profile-tabs.config.ts`: lucide tab icons
- [ ] `views/build/config/build-icons.config.ts`: lucide → API images
- [ ] `views/top/ui/components/TopPodium/*`: delete
- [ ] all 72 files importing `HEAD_REVEAL|STAGGER|SCALE_IN` (`rg -l "HEAD_REVEAL|STAGGER|SCALE_IN" apps/client/views apps/client/widgets`)
- [ ] all 31 `index='// 0x'` props (`rg "index='// " apps/client/views`)
- [ ] the 114 SCSS files using `plate|riveted|corner-brackets|camo-divider|stencil|chamfer|clip-path` (`rg -l "@include (plate|riveted-plate|corner-brackets|camo-divider|stencil|chamfer-path)|clip-path" apps/client --glob "*.scss"`)
- [ ] the 74 `box-shadow: 0 0 …` / `drop-shadow(0 0 …)` glows (`rg "box-shadow: 0 0|drop-shadow\(0 0" apps/client --glob "*.scss"`)

---

## 11. Implementation order (for parallel agents)

1. Tokens + globals + mixins + fonts (§4). One agent. Everything else depends on it.
2. ui-kit restyle (§5): Button, Tabs, SegmentedControl/ToggleChips, DataTable, Card, StatTile→KeyFigure, Badge, Inputs, Popups, EmptyState, Skeleton, SectionHeader, PageHead. One agent, in the order listed.
3. Header/footer/nav (§5.12–5.13) + version badge + API status. One agent. Needs a small server endpoint if `GameVersion` isn't exposed yet **[verify]**.
4. Entities: `TankIdentity` default `image='small'` in tables, `TankSlot` (garage slot), nation tint tokens, premium colour, `AchievementImage`, `ClanEmblem`. One agent.
5. Pages in this order: home → tank → player → tanks → marks → top → clans → tools → developers → streamers → the remaining heroes. Each page agent also removes motion presets and `// index` props in its own view folder.
6. Copy cleanup (§9) alongside each page.
7. Final sweep with the §10 greps. Each should return zero hits outside `entities/streamer/overlay`.

Definition of done for each page:
- First paint (JS disabled) shows the H1 and data skeletons
- No element larger than 28 px except numbers and tank images
- At least one API image (tank/medal/emblem/map) is visible above the fold on data pages
- «Мир танков» appears in the first screen
- Source line present
- Zero grep hits from §10 in the page folder
