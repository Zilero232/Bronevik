# HUD visual redesign: battle and hangar panels

The first live test showed plain text: equipment, consumables and the damage log as words, no icons, panels floating in odd places. The popular packs (Jove, Lefty's tools, Near_You / Battle Observer, XVM) look different for three reasons: icons carry the meaning and numbers carry the value, each panel sits where the stock UI already puts that kind of information, and several of them **replace** a stock element instead of adding a second copy of it. This spec defines that look for our Gameface HUD page and says, component by component, whether we replace, extend or overlay the stock HUD.

Scope: design only. The renderer protocol change (§2.3) and the stock-visibility hook (§3) are new code for the HUD pipeline owner. GUIFlash stays the text fallback.

Checked against the RU 1.45 client: assets in `unicum-gg/wot.assets` branch `Lesta` (`.version_name` = `1.45.0.5231`), decompiled sources in `izeberg/wot-src` branch `RU` (commit `b3896b5`, "v.1.45.0.0 #2284"). Every icon path in this document exists in that asset tree; sizes were read from the PNG headers.

---

## 1. What the reference packs do

| Pack / mod | What it looks like | What we take |
|---|---|---|
| **Jove, «Панель повреждений» / damage log** ([tankist.net/modpacks/jove](https://tankist.net/modpacks/jove), [mirtankov.su: panel like Jove](https://mirtankov.su/mody/panel-povrezhdenij/panel-povrezhdenij-kak-u-jove-0811-s-tajmerom-remonta), [cyber.sports.ru review](https://cyber.sports.ru/wotblitz/blogs/3385579.html)) | An alternative damage panel with repair timers on the modules. The last hit on you flashes brightly for a few seconds. The damage log sits right of the damage panel: totals as icon + number, then one line per hit. | Last-hit flash (our `last_hit`), log rows with icon + number, placement at the stock damage-log spot. |
| **Battle Observer** (Armagomen; [github.com/Armagomen/battle_observer](https://github.com/Armagomen/battle_observer), [wotspeak.org/mods/260](https://wotspeak.org/mods/260-battle-observer-wot.html)); the RU packs bundle it or clones of it (Near_You's pack among them) | **Team HP** replaces the stock score strip (`fragCorrelationBar`): two coloured bars, a frag score in the middle, a row of vehicle icons. **Sixth sense** is a large custom lamp with a radial timer (default colour `#FD7D1A`, radius 38, icon 70 px). **Damage totals** are a row of `<img>` 16×16 plus a number (`vspace=-4`): damage, blocked, assist, spotted, stun. The extended log has columns `index · damage · shell · reason icon · class icon + tank`, `$TitleFont` 15 px, tab stops 20/55/80/100. | Replacing the stock strip, icon + number rows, the column layout, 16 px icons at 1080p, a radial timer on the lamp. |
| **Lefty («Левша»), «Калькулятор отметок»** (from the pack's public description and screenshots; no source code was checked) | A small plate with the current MoE percent, a big number coloured by change, and the damage needed for the next threshold. It sits near the damage panel or top centre. | The marks plate (§5.4). |
| **«Оборудование в бою», «Таймер перезарядки»** (catalogued on wotspeak, tankist, wotsite) | Equipment as game icons in a strip next to the consumables bar. The reload timer is a bar with seconds near the reticle. | battle_loadout strip, reload bar. |
| **XVM** (still allowed on Lesta for the permitted parts) | Tables in `$TitleFont`/`$FieldFont`, `<img>` icons inline in text, class colours and rating colours. | Number formatting, class icon colours as an option. |

Visual patterns common to all of them, which we adopt:

1. **Icon + number, never a word + number.** Words appear only in headers or tooltips. 16 px icon, 4 px gap, bold number.
2. **Class icon in front of every vehicle name**, coloured green for an ally and red (or purple for colour-blind players) for an enemy.
3. **Shell icon, not «ББ/БП/ОФ» text**, with gold premium shells tinted gold.
4. **Semi-transparent dark plates** at 55–75 % opacity with a 1 px light top edge. Text keeps a 1 px dark outline so it reads on sky and on snow.
5. **Stock positions:** team HP at top centre, the damage log right of the damage panel, the lamp above the reticle, equipment beside the consumables bar.
6. **Short motion:** new rows fade and slide in over 150–200 ms, a new value flashes once. No constant blinking, except the lamp pulse while it is lit.

---

## 2. Imagery we may use at runtime

### 2.1 Rule

We reference the client's own files by path at runtime. We never copy, extract, recolour or ship them. The player's client already has them, so nothing is redistributed. Where the client has no suitable image, we use our own art (§2.4). This matches the asset rules in [apps/game/modpack/assets/README.md](../../apps/game/modpack/assets/README.md): reference only, original art, visual only.

### 2.2 How a Gameface page reaches an image

- **Scheme:** the client registers every plain image as `"path": "img://gui/maps/icons/..."` in `gui/unbound/res_map.json` (for example key `f783` → `img://gui/maps/icons/artefact/rammer.png`). OpenWG Gameface's README documents the same schemes: `img://` for images and `coui://` for page files (`coui://gui/gameface/mods/<mod>/…`) ([gitlab.com/openwg/wot.gameface](https://gitlab.com/openwg/wot.gameface)). Our page uses `<img src="img://gui/maps/icons/...">`, or `background-image: url(img://…)` for plates. Our own PNGs ship at `res/gui/maps/icons/otmetki/...` and use the same scheme.
- **The client's own pages** write `url('R.images.<dotted path>')` in CSS, which the engine resolves (`PortalHudWidgetView.css`: `url('R.images.portal.gui.maps.icons.hud_widget.portal_hp.hit')`). That lookup only works for ids in the client's `R` tree, so we don't use it in markup.
- **Python resolves names; the page never guesses.** The stock consumables panel computes its icons like this (`gui/Scaleform/daapi/view/battle/shared/consumables_panel.py`, RU 1.45):
  - shell: `backport.image(R.images.gui.maps.icons.ammopanel.battle_ammo.dyn(descriptor.icon[0].split('.png')[0])())`, and the empty-stock variant `NO_<name>`;
  - equipment and consumables: `backport.image(R.images.gui.maps.icons.artefact.dyn(descriptor.icon[0])())`.

  `backport.image` returns the `img://…` string. Our features call the same code and send the resulting string in the widget data (§2.3). Before battle start they check it once with `ResMgr.isFile(path[len('img://'):])`; a missing file falls back to our glyph.
- **Atlas sprites** (`gui/flash/atlases/battleAtlas.dds`, with names such as `damageLog_fire_16x16` and `damageLog_assist_16x16`) are registered as `Image` resources with `textureName/x/y/width/height` (2 265 entries in `res_map.json`). A Gameface `<img>` cannot address them by file path. They are usable only if `wulf.getImagePath(resId)` for such an id returns something Coherent can draw. That is **unverified**, so the default set below avoids atlas sprites. Live check: log `wulf.getImagePath(R.images.gui.maps.icons.battle... )` for one atlas id.

### 2.3 Protocol change (proposal for the HUD pipeline)

Today a panel is `{id, text, …}` in GUIFlash HTML. Keep `text` as the fallback and add an optional structured payload:

```jsonc
{ "id": "damage_log", "text": "<GUIFlash html>", "widget": { "kind": "damage_log", "v": 1, "data": { … } }, … }
```

The page renders `widget.kind` with a dedicated component and falls back to `text` when the kind is unknown or the data fails its zod schema. Bump `HUD_PROTOCOL.version` to 3. Each widget's zod schema lives in `ui-web/src/entities/hud-widgets/<kind>/model/…`, and the Python side writes a fixture for it next to the existing `hud-state.sample.json`. Icon fields are always full `img://` strings. The page holds only the static icon table (§2.4) as constants.

### 2.4 Icon inventory

**Client icons (RU 1.45, verified to exist; size in px):**

| Need | Path | Size | Notes |
|---|---|---|---|
| Vehicle class, neutral | `gui/maps/icons/vehicleTypes/white/{lightTank,mediumTank,heavyTank,AT-SPG,SPG}.png` | 16×16 | Default in rows. |
| Vehicle class, large | `gui/maps/icons/vehicleTypes/white/36x36/<cls>.png`, `vehicleTypes/24x24/<cls>.png` (+`_elite`) | 36, 24 | Death card, lamp-free cards. |
| Vehicle class, ally/enemy tint | `gui/maps/icons/vehicleTypes/green/<cls>.png`, `…/red/<cls>.png` | 17×21 | **Lower-case** `at-spg.png` and `spg.png` in these two folders. |
| Vehicle class, gold | `gui/maps/icons/vehicleTypes/gold/<cls>.png` | — | Own vehicle. |
| Vehicle contour | `gui/maps/icons/vehicle/contour/<nation>-<tag>.png` (for example `ussr-R04_T-34.png`) | 59×23 | Name from `vehicleType.name` `ussr:R04_T-34` → `ussr-R04_T-34`. Hit log, received hits, death card. |
| Vehicle small picture | `gui/maps/icons/vehicle/small/<nation>-<tag>.png` | 124×31 | Hangar labels, death card detailed. |
| Shell, battle | `gui/maps/icons/ammopanel/battle_ammo/<ICON>.png`, empty: `NO_<ICON>.png` | 43×43 | `<ICON>` from `descriptor.icon[0]` as above (for example `ARMOR_PIERCING`, `ARMOR_PIERCING_CR_PREMIUM`, `HIGH_EXPLOSIVE_SPG_STUN`, `HOLLOW_CHARGE_PREMIUM`). |
| Shell, flat | `gui/maps/icons/shell/small/<ICON>.png` (55×55), `shell/medium/…` (80×80) | | Logs and death card at 16–20 px. |
| Consumables, equipment, directives | `gui/maps/icons/artefact/<name>.png`, for example `largeRepairkit`, `smallRepairkit`, `largeMedkit`, `smallMedkit`, `handExtinguishers`, `autoExtinguishers`, `gasoline100/105`, `ration*`, `rammer`, `turbocharger`, `improvedVentilation`, `aimingStabilizer`, `brotherhood`, `coatedOptics`, `camouflageNet`, `stereoscope` | 48×48 | Name from the descriptor. Overlays: `equipmentPlus_overlay.png`, `equipmentTrophyBasic_overlay.png`, `equipmentTrophyUpgraded_overlay.png`, `battleBooster_overlay.png`. |
| Sixth sense skill | `gui/maps/icons/artefact/commander_sixthSense.png` (48), `artefact/24x24/commander_sixthSense.png` (24) | | Lamp option «как в игре». |
| Efficiency kinds | `gui/maps/icons/library/efficiency/48x48/{damage,armor,help,stun,detection,destruction,fire,ram,module,immobilized,capture,defence}.png` | 48×48 | The post-battle efficiency icons. The damage-log totals use them at 16–18 px. |
| Efficiency, small | `gui/maps/icons/battle/eventStats/icons/28x20/{damage,blocked,assist,kills,vehicle}.png` | 28×20 | A crisper small size for totals. |
| Hit outcome | `gui/maps/icons/library/critical_damage/{hit_critical,hit_blocked,hit_ricochet,hit_miss_armor,hit_spaced_armor_blocked,hit_critical_track,hit_track_blocked,hit_wheel_blocked}.png` | 36×36 | Hit log and received hits. |
| Kill / ram | `gui/maps/icons/battle/messages/icons/{kill,ram,assist}.png` | 30×30 | |
| Modules | `gui/maps/icons/modules/{engine,gun,chassis,…}.png` | 48×48 | Death card: damaged modules. |
| Crew roles | `gui/maps/icons/tankmen/roles/14x14/{commander,driver,gunner,loader,radioman}.png` (also `18x18`) | 14 | Death card: injured crew. |
| Nation flag | `gui/maps/icons/flags/25x17/<nation>.png` | 25×17 | Hangar labels. |
| MoE marks | `gui/maps/icons/library/marksOnGun/mark_{1,2,3}.png` (24×24); nation-specific `marksOnGun/67x71/<nation>_<n>_mark(s).png` | | Marks panel, hangar marks. |
| Tier | `gui/maps/icons/levels/tank_level_small_<n>.png` | 16×16 | Hangar labels. |
| Ping | `gui/maps/icons/pingStatus/stairs_indicator_{0..3}.png` | 14×14 | hangar_info. |
| Clock | `gui/maps/icons/library/clock_icon_s.png`, `clock_icon_s_32.png` | | battle_clock. |

**Our own glyphs (already in the repo, `apps/game/modpack/assets/otmetki/`):**

- `damage_log/src/`: `damage.svg`, `radio.svg`, `track.svg`, `stun.svg`, `blocked.svg`, `received.svg`, `class_light.svg`, `class_medium.svg`, `class_heavy.svg`, `class_td.svg`, `class_spg.svg`. They render to PNG 32 at `gui/maps/icons/otmetki/damage_log/icons/<name>_32.png`. They are the fallback when a client icon is missing, and the default for `radio` and `track`: the client has no separate radio or track assist icon, only `help` and `immobilized`.
- `sixth_sense/src/`: `lamp.svg`, `eye.svg`, `badge.svg`, `marks.svg` (64/128 plus `_dim` pulse frames).
- `crosshair/…`: not part of the HUD panels.
- `packages/icons` (site package; its shapes are reusable for new PNG renders): `CLASS_GLYPHS`, `MARK_SHAPES`, `RING_SHAPES`, `MASTERY`, `NATION_FLAGS`, `LOGO_SHAPES` (the «///» mark), crew roles, equipment categories.

**New glyphs to draw** (our art, `assets/otmetki/hud/src/*.svg` → PNG 32 and 64, set `otmetki_hud_icons`): `fire` (flame, for received fire damage, so the client's 48 px efficiency icon is not shown at 14 px), `fall` (world/fall damage), `ammo_rack`, `record` (a cup, for personal_best), `target` (a threshold flag, for main_gun and marks), `wn8` (a spark), `session` (stacked bars), `traverse` (an arc with limits, for gun_arc), `bush` (for bush_circle), `mission` (a clipboard, for personal_missions). Size 32×32 on a 2 px grid, 2 px stroke at 32, white `#F2F2F3` fill with a `#0E0E10` 1.5 px outline, the same way as the existing glyphs.

---

## 3. Replacing stock HUD elements: mechanism and rules

### 3.1 Stock component ids (RU 1.45)

`gui/Scaleform/genConsts/BATTLE_VIEW_ALIASES.py`:

| Alias | Stock element | Stock placement (`BattlePage.as` / `BaseBattlePage.as`, design px) |
|---|---|---|
| `fragCorrelationBar` | Score strip: frags, vehicle icons, optional team HP | top centre, `x = W/2` |
| `battleDamageLogPanel` | Damage log (totals + detailed log) | `x = 229`, `y = damagePanel.y + 3`, right of the damage panel |
| `damagePanel` | Own HP, modules, crew | `x = 0`, `y = H − initedHeight`, `PANEL_WIDTH = 230` |
| `consumablesPanel` | Shells, consumables, equipment slots (interactive) | bottom centre, `CONSUMABLES_PANEL_Y_OFFSET = 58`, slot pitch 57 |
| `sixthSense` | Lamp | `x = W/2 − 109`, `y = H/2 − 225`; at `H ≥ 1600` and scale 1: `−150 / −275`; `HALF_HEIGHT = 43` |
| `battleTimer` | Timer | top right, `x = W − initedWidth`, `y = 0` |
| `ribbonsPanel` | Ribbons | centre, below the reticle |
| `minimap` | Minimap | bottom right |
| `debugPanel` | FPS and ping | top left |
| `playersPanel` | Team lists | left and right edges |

### 3.2 How to hide a stock element cleanly

The stock page calls `_setComponentsVisibility(visible=…, hidden=…)` again and again, for example on every control-mode change (`ClassicPage._changeCtrlMode` re-shows `damagePanel`, `battleDamageLogPanel` and `consumablesPanel`), on full-stats (Tab) toggling and in postmortem. A one-off hide therefore gets undone. The rule:

1. **A suppression set in core:** `core/client/hud/stock` (new) keeps `suppressed = {alias: owner_feature}`. It wraps `gui.Scaleform.daapi.view.battle.shared.page.SharedPage._setComponentsVisibility` (the original always runs, with the filtered sets): suppressed aliases are removed from `visible` and added to `hidden`. At the battle page's `_populate` and whenever the set changes, it calls `page.as_setComponentsVisibilityS(set(), suppressed)` once.
2. **Replace only when our replacement is actually drawn.** A feature asks for suppression only while its Gameface widget renders (the backend is `gameface` and the page answered `ready`). On GUIFlash or no renderer the stock element stays: the text fallback is an extra panel, never a replacement.
3. **Switching off restores stock at once:** removing the alias calls `as_setComponentsVisibilityS({alias}, set())`, so the stock element is back mid-battle.
4. **Our window follows the stock GUI toggles.** Listen to `GameEvent.GUI_VISIBILITY` (the V key hides everything, `SharedPage._toggleGuiVisible`), full stats (Tab; the page hides components through `_fsToggling`) and postmortem, and hide the matching panels. Otherwise the replacement shows while the stock UI is hidden.
5. **Other modes:** only `ClassicPage` (random, training, comp7 where it inherits it) is supported. Epic, story mode, event and Battle Royale pages never get suppression, and our panels there are overlays only.
6. **Fair play and МОСТ:** hiding a stock element is allowed only when our replacement shows the **same or strictly own** information (Lesta's rules forbid added information about enemies, not restyling). Battle Observer ships this same replacement of the score strip, lamp, timer and team bases in its Lesta build. The catalog text of each replacing component must say «заменяет стандартную …».

Stock settings we read but never write: `ScorePanelStorageKeys.SHOW_HP_BAR/SHOW_HP_VALUES/SHOW_HP_DIFFERENCE` (the stock strip can already show team HP), `DAMAGE_LOG.*` (`damageLogTotalDamage`, `…ShowDetails`, `…EventsPosition`), `SIXTH_SENSE.INDICATOR_SIZE/INDICATOR_ALPHA`, `GAME.SHOW_MARKS_ON_GUN`. Where the player turned the stock element off in the game's own settings, our replacement is still allowed (it is their chosen feature). We still write nothing to those settings.

### 3.3 Decision table

| Component | Mode | Stock element | Hidden via | Switched off → |
|---|---|---|---|---|
| team_hp | **replace** (style `bar`/`icons`) · overlay (`numbers`) | `fragCorrelationBar` | suppression | stock score strip back |
| damage_log | **replace** (default) · extend (option «оставить стандартный») | `battleDamageLogPanel` | suppression | stock log back |
| damage_log `last_hit` | overlay | — | — | — |
| hit_log | overlay | — (stock only has ribbons and markers) | — | — |
| received_hits | extend (docks above the damage log) | — | — | — |
| marks_panel | overlay, docked | top edge of `damagePanel` | — | — |
| sixth_sense | **replace** | `sixthSense` | suppression | stock lamp back |
| battle_clock | extend (docks under the stock timer) · replace option | `battleTimer` (option only) | suppression when `replace_timer` | stock timer back |
| consumables | extend, **never** replace | `consumablesPanel` stays (interactive: keys, clicks, shell switching) | — | — |
| reload_timer | overlay near the reticle | — | — | — |
| battle_loadout | extend (strip left of the consumables bar) | — | — | — |
| gun_arc | overlay near the reticle | — | — | — |
| main_gun, battle_efficiency, personal_best | extend (dock into the team HP block) | — | — | — |
| death_card | overlay (postmortem) | — | — | — |
| session_goals, personal_missions (battle lines) | overlay (dock under the marks panel) | — | — | — |
| bush_circle | 3D, unchanged | — | — | — |
| hangar labels, «///» | overlay | — | — | — |

---

## 4. Global HUD style guide

All values are design px at 1080p and interface scale 1. The page works in rem (1 rem = 1 design px, Gameface scales rem by the interface scale), so 2× scale doubles everything. The CSS obeys the Gameface ban list in [README «Gameface CSS»](../../apps/game/modpack/README.md): no `gap`, `grid`, `var()`, `calc()`, combinators or `#rrggbbaa`. Spacing uses margins, and `token()` inlines the values.

### 4.1 Plate

- Background: `linear-gradient(180deg, rgba(20,20,23,0.78) 0%, rgba(14,14,16,0.62) 100%)`, based on `color-surface-sunken` #141417 and `color-bg-deep` #0e0e10. Proposed token `hud-plate` (add to `@otmetki/design-tokens` `$game`).
- Top edge: `border-top: 1px solid rgba(255,255,255,0.06)` (= `shine-8` lowered). Other edges have no border; `border-radius: 3px` (`radius-sm`).
- Accent rail (optional per panel): 2 px left border in the panel's role colour (§4.4) at 80 % opacity. Used by the damage log (orange), received hits (red) and marks (gold).
- No `backdrop-filter`: blur is unverified in the client's Coherent build. The darker top of the gradient stands in for it.
- Padding: 4 px vertical, 8 px horizontal (`space-2` / `space-3`). Rows 20 px tall (compact 18). Row spacing 2 px (`space-1`).
- Text readability on every plate and plate-less label: `text-shadow: 0 0 2px rgba(0,0,0,0.9), 1px 1px 1px rgba(0,0,0,0.9)`. Icons get the same dark rim from their PNG outline, or `filter: drop-shadow(…)` when Gameface supports it (unverified; otherwise nothing).
- Plate-less mode (`plate: false` option on every panel): text and icons only, with the shadow above. Some players want the XVM look.

### 4.2 Type

- Family: `warhelios` (the client ships `gui/gameface/fonts/Warhelios-Regular.ttf` and `Warhelios-Bold.ttf`). Fallback `'Arial Narrow', arial`.
- Sizes (1080p): header caps 11 px bold, `letter-spacing: 1px` (`caps()` mixin); body 13 px; number 15 px bold; big number (lamp timer, marks percent, death card damage) 22–28 px bold; secondary 11 px `color-text-muted`.
- Numbers never jitter: every changing number sits in a box with `min-width` for its widest expected value (Gameface has no `font-variant-numeric`), right-aligned inside the row.

### 4.3 Number formatting

- Thousands separated by a thin no-break space U+202F: `6 812`. No abbreviations under 100 000, then `128 k`.
- Signed deltas always carry a sign: `+238`, `−1 200` (U+2212 minus), `+0,42 %` (Russian decimal comma, U+202F before `%`).
- Percent with 2 decimals for MoE (`87,34 %`), 0 decimals elsewhere.
- Seconds: `12` under a minute, `1:05` from a minute; reload `3.2` with one decimal (dot, as the client's own reload), `0.0` hidden.
- Degrees `12°`; distance is not shown anywhere.

### 4.4 Colour roles (dark theme tokens)

| Role | Token | Hex |
|---|---|---|
| Text | `color-text` | #F2F2F3 |
| Secondary text | `color-text-muted` | #A3A3AD |
| Ally | `color-ally` | #6FB544 |
| Enemy | `color-enemy` | #E07A6A |
| Enemy, colour-blind | `color-enemy-cb` | #9188FE (switch follows the client's colour-blind option `App.colorSchemeMgr` / settings `isColorBlind`) |
| Own / record / gold shell | `color-gold` | #E8B84A |
| Damage dealt | `color-accent` | #FF7A1A |
| Assist radio | `color-steel-blue` | #80A6CC |
| Assist track | `color-armor` | #A9B56C |
| Assist stun | `class-spg` | #B774E0 |
| Blocked | `color-steel` | #8EA4B5 |
| Received | `color-danger` | #F1705B |
| Penetration (own shot) | `color-success` | #6FB544 |
| Crit without damage | `color-warning` | #D9B23C |
| No pen / ricochet | `color-steel` | #8EA4B5 |
| Positive delta | `rating-good` | #4CC36B |
| Negative delta | `rating-bad` | #EB7276 |
| Class accents (optional tint of class icons) | `class-lt/mt/ht/td/spg` | #7CC04B / #E0C341 / #E05A44 / #6F8CF0 / #B774E0 |

The palette choice in `damage_log`/`hit_log` (`graphite`, `classic`, `contrast`, `colorblind`) keeps working. `graphite` is the table above.

### 4.5 Sizes of imagery (1080p)

| Use | Display size |
|---|---|
| Inline icon in a row | 16×16 (class 16, efficiency 16, shell 18) |
| Contour | 46×18 (the 59×23 file scaled 0.78), right-aligned before the name |
| Slot icon (loadout, consumables strip) | 28×28 on a 32×32 slot |
| Lamp | 72 px default (stock lamp is about 86 px tall, `HALF_HEIGHT = 43`) |
| Death card hero | contour 59×23 at 1:1, class 24×24 |

### 4.6 Motion

- Show/hide: `opacity` 160 ms (`duration-base`) with `ease-out` `cubic-bezier(0.2,0,0,1)`.
- New log row: fades in from `opacity 0` and `translateY(-4px)` over 180 ms (`duration-lift`). Only the newest row animates.
- Value change highlight: the number turns its role colour at full brightness for 400 ms, then back (a class toggled by the model hook, CSS `transition: color 400ms`).
- Lamp: while lit, a pulse between opacity 1 and 0.55 every 500 ms, driven by a JS-toggled class. Keyframe support is not assumed.
- Radial cooldown / lamp timer: a CSS `conic-gradient` is banned. Use an SVG `<circle>` with `stroke-dasharray` set by the hook (Coherent's SVG table supports stroke-dasharray), or 2 half-disc masks.
- `prefers-reduced-motion` is not reported by Gameface. A global `motion: off` option in the HUD card disables all of the above.

### 4.7 Z-order and layering

1. The stock Scaleform battle page is at the bottom. Our Gameface window (`WindowLayer.WINDOW`) sits above it, so our panels never go under the stock ones.
2. Inside our page, in `z-index` order: plates (1) < logs (2) < docked strips (3) < transient cards (`last_hit`, death card, record card) (5) < lamp (6) < edit-mode frames (9) < «///» button (10).
3. Transient cards never cover the reticle area: a centre box of 360×240 is a no-go zone, and cards sit above or below it.
4. When the stock radial menu, full stats (Tab) or the pause menu is open, our window hides all panels except the clock.

### 4.8 Edit mode (Alt held with a cursor)

- Every panel shows a 1 px dashed-looking frame. Dashes are banned, so the frame is solid `color-text-dim` at 60 %, `color-accent` while dragging. A caption tab above the top-left corner shows the panel name (11 px caps on `color-accent`, 16 px tall).
- Handles: the whole plate drags. The wheel scales it 50–300 % (as now). A small «⟲» button at the top-right of the caption resets that panel to its default. A docked panel shows a chain icon: dragging it undocks it, and double-clicking re-docks it.
- Snap: while dragging, edges snap within 6 px to screen thirds, to other panels' edges and to the stock anchors of §3.1 (damage panel top, stock damage-log x = 229, lamp position, the consumables bar top).
- Previews: in edit mode every panel shows its preview data at full style, so the layout is judged with real density.

### 4.9 Safe placement

- Anchors are the stock elements' positions (§3.1), computed from the screen in design px, never absolute 1920×1080 numbers.
- **21:9 and 32:9:** top-centre and bottom-centre panels stay centred. Edge panels (logs) follow the stock damage panel, which is at the left edge on every aspect, so nothing drifts into the corners of an ultrawide.
- Every panel is clamped fully on screen (`placeRect`, already tested at 1280×720…3840×2160, scale 1–2). The smallest design screen is 1280×720 / 2 = 640×360 at scale 2. Panels must fit that: max default width 320, and logs collapse to compact below 900 px design height.

---

## 5. Main battle panels

Layout sketches use `[icon]` for images; widths are 1080p design px.

### 5.1 team_hp: team HP and score (replaces `fragCorrelationBar`)

```
            ┌──────────────────────── 560 ────────────────────────┐
            │ 14 820 ███████████████░░░  7 : 5  ░░░░██████████ 9 310 │  bar 10 px, numbers 15 bold
            │ [cls][cls][cls]…(15)           …(15)[cls][cls][cls]    │  class icons 16, dead = 35 % alpha, grey
            └────────────────────────────────────────────────────────┘
                     Δ +5 510         (optional diff under the score, 11 px)
```

- **Mode:** replace. Suppress `fragCorrelationBar` only in styles `bar` and `icons`. The `numbers` style is an overlay under the stock strip (y = 64) and keeps it.
- **Anchor:** top centre, `y = 4`, the same spot as the stock strip; width 560 (compact 420). The strip's stock vehicle-marker row is replaced by our row of class icons: `vehicleTypes/green/<cls>.png` for allies, `…/red/<cls>.png` for enemies (lower-case `at-spg`/`spg`), in arena order. Dead vehicles show the icon at 35 % opacity with `filter: grayscale(1)`, or, if filters are unsupported, the neutral `vehicleTypes/white/<cls>.png` at 30 %.
- **Per-vehicle mini-bars (style `icons`):** under each class icon a 16×3 bar in ally or enemy colour, filled by HP ratio (Battle Observer's «League» look).
- **Colours:** ally bar `color-ally`, enemy `color-enemy`/`-cb`. Bar track `rgba(255,255,255,0.08)`. The score in `color-text` 22 px bold, the separator colon `color-text-muted`.
- **Docked extensions:** main_gun and battle_efficiency render as a thin second line inside the same plate (§6).
- **Fair play:** the stock strip already shows class icons, alive state and (with `showHPBar`) team HP. Unseen enemies keep their last known HP, as on their markers.
- **GUIFlash fallback:** `Союзники 14 820 · 7 : 5 · 9 310 Противники`. The stock strip is not hidden.
- **Compact:** bars and score only, no icon row.

### 5.2 damage_log: damage log (replaces `battleDamageLogPanel`)

```
┌────────── 250 ──────────┐          x = 229 (stock), bottom = damage panel bottom − 3
│[dmg] 2 150 [blk] 1 240  │  totals row: efficiency icons 16 + number 15 bold, role colours
│[ast] 870   [stn] 310    │  assist = radio+track (+stun on SPG); stun row only on SPG
├─────────────────────────┤
│ 390 [shell][cls] Pz.IV  │  entries, newest on top: amount (role colour) · shell 18 · class 16 · name 13
│ 240 [blk ][cls] KV-1    │  blocked entries in color-steel
│−320 [fire]      пожар   │  received entries: leading minus, red, source glyph
│−390 [shell][cls] T-34 [ammo_rack] │
└─────────────────────────┘
```

- **Mode:** replace by default: suppress `battleDamageLogPanel` while the widget renders, and take its place, so there is no double log. Option `keep_stock: true` switches to **extend**: stock kept, our panel docks above it (`bottom = damagePanel.y − 4`).
- **Anchor:** docked to the stock log spot `x = 229, y = damagePanel.y + 3`. It grows upward from the damage panel's bottom edge, width 250, max `log_lines` rows.
- **Icons:** totals `library/efficiency/48x48/damage.png`, `…/armor.png` (blocked), `…/help.png` (assist), `…/stun.png`, all at 16 px. Or `battle/eventStats/icons/28x20/{damage,blocked,assist}.png` at 22×16 (option `icon_style: event`). Radio and track split: our `otmetki/damage_log/icons/radio_32.png` and `track_32.png`. Shell `shell/small/<ICON>.png` at 18. Class `vehicleTypes/white/<cls>.png` at 16. Received sources: `efficiency/48x48/fire.png` / `ram.png`, our `fall`, our `ammo_rack` glyph.
- **Colours:** §4.4 roles. Gold premium shell → shell icon unchanged, amount keeps its role colour, and a 2 px `color-gold` underline under the shell icon.
- **Motion:** the newest row slides in; totals flash on change.
- **Compact:** the totals row only, as one line `[dmg] 2 150 [blk] 1 240 [ast] 870`, 26 px tall.
- **Detailed:** adds the attacker/target contour (`vehicle/contour/…` at 46×18) instead of the name, with the name on hover (edit mode only).
- **last_hit** (same package, overlay): a card centred horizontally, `bottom = H/2 − 150` (above the reticle no-go box), 280×56:
  `[contour 59×23] [cls 24] Pz. IV   −390   [shell 20] ББ` in `color-danger` 22 px. Flash: plate background `rgba(241,112,91,0.25)` for the first 300 ms, then the normal plate, fading out after `timeout_s`.
- **GUIFlash fallback:** the current HTML with `<img>` glyphs and the stock log kept.

### 5.3 hit_log: own hits (overlay)

```
┌──────── 260 ────────┐   bottom right, above the minimap: right = 8, bottom = minimap top + 8
│ 7 попад. · 5 проб. · 2 150  │ header: 11 px caps muted + numbers
│[pen] 390 [cls] Pz.IV  ▮▮▮░ 410 │ outcome icon 16 · damage · class · name · HP bar 40×4 + HP
│[ric]     [cls] KV-1   ▮▮▮▮ 900 │
│[crit]    [cls] T-34   ▮▮░░ 380 │
└─────────────────────┘
```

- **Mode:** overlay. The stock has no own-hit log, only ribbons and markers.
- **Anchor:** bottom right, docked to the minimap's top edge (`minimap.y − 8`) and following its size (the minimap resizes with its +/- keys, so re-read `minimap.currentHeight` on `onMinimapSize` or poll every second).
- **Icons:** `library/critical_damage/hit_critical.png` (pen with crit), `hit_blocked.png` (no pen), `hit_ricochet.png`, `hit_spaced_armor_blocked.png`, `hit_track_blocked.png`/`hit_wheel_blocked.png`, `hit_miss_armor.png`, all at 16. A plain penetration has no client icon: use our `damage_32.png` tinted `color-success`. Class `vehicleTypes/red/<cls>.png`.
- **HP bar:** 40×4, `color-enemy`, track 8 % white. The HP number is what the marker shows after the own shot.
- **Group by target:** one row per vehicle, `×3` hit count before the name.
- **GUIFlash fallback:** the current text.

### 5.4 marks_panel: MoE in battle (overlay, docked to the damage panel)

```
compact (default):                       ┌────── 230 ──────┐  sits on the damage panel's top edge, x = 0
                                         │[★★☆] 87,34 % ▲ +0,42│  marks icon 24 · percent 18 bold (colour by mark) · delta 13
                                         └─────────────────┘
detailed (grows upward):
┌────── 230 ──────┐
│ 65 % ✓   85 % 1 240  95 % 3 900 │  thresholds row, 11 px: reached = green check, else damage needed
│ +0,5 %: 610 · боёв до 3★: ~14   │  secondary 11 px muted
│[★★☆] 87,34 % ▲ +0,42│
└─────────────────┘
```

- **Mode:** overlay, docked to the stock `damagePanel`: `x = 0`, `bottom = damagePanel.y`, width = `PANEL_WIDTH` 230, the width of the stock panel, so it reads as its header (Jove-style). Accent rail `color-gold`.
- **Chat conflict:** the stock battle messenger sits directly above the damage panel (`battleMessenger.y = damagePanel.y − height + 2`). Our compact strip is 22 px tall and covers the bottom chat line. Live-check item: if it is unreadable, the default moves to the right of the stock log column (`x = 229 + 250 + 8`, bottom-aligned with the damage panel), and the dock option stays.
- **Icons:** `library/marksOnGun/mark_{n}.png` (24) for the current marks count, or the nation's `marksOnGun/67x71/<nation>_<n>_mark(s).png` scaled to 28 (option). Our `MARK_SHAPES` stars as the fallback.
- **Colours:** percent by `color_mode`: `delta` (green up, red down) or `mark` (the mark tier colours: 0 → `color-text`, 1 → `color-mastery-bronze`, 2 → `color-mastery-silver`, 3 → `color-mastery-gold`).
- **Custom template:** stays text in the same plate (macros unchanged).
- **GUIFlash fallback:** the current text at the old default position.

### 5.5 Consumables, reload, equipment around the stock bar (extend)

The stock `consumablesPanel` is interactive (hotkeys 1–7, clicks, shell switching, tooltips) and already shows the shell and consumable icons with cooldowns. **It is never hidden.** Our three components add what it lacks and dock to it.

**consumables** (shell counts, consumable timers and shell stats):

```
        ┌ shell stats (only if show_shell_stats) ──────────────┐
        │ [AP 18] 258 мм · 390 · 1 000 м/с                      │  one line, loaded shell highlighted gold
        └───────────────────────────────────────────────────────┘
   [stock consumables bar …… unchanged ……]
```

- The consumables line («Аптечка ✓ · Ремкомплект 12 с») duplicates the stock bar. The `show_consumables` default becomes `false`, and when shown it renders as a slot strip: `[artefact/<name>.png 28]` with a radial cooldown ring (SVG, `color-accent`), seconds 13 bold centred, and a grey (`opacity .35`) icon when spent.
- **Anchor:** bottom centre, `bottom = H − 58 − 8` (above the stock bar's `CONSUMABLES_PANEL_Y_OFFSET` = 58), centred on `W/2`.
- Shell icons `ammopanel/battle_ammo/<ICON>.png` (43 → 20 inline), and `NO_<ICON>.png` when the count is 0.

**reload_timer** (overlay near the reticle):

```
        ▕██████████░░░░░▏ 3.2        bar 120×4, seconds 15 bold, under the reticle no-go box
          [AP] 3/4                    clip: shell icon 16 + remaining/size (magazine guns)
```

- **Anchor:** centre, `top = H/2 + 130`: tight under the reticle and just above the stock ribbons, which start around `H/2 + 150` (`RIBBONS_CENTER_SCREEN_OFFSET_Y`; live-check the overlap). It follows the reticle when the server reticle moves: reuse the crosshair feature's `onCrosshairPositionChanged` offset.
- **Colours:** bar `color-accent` while reloading, `color-success` at ready («Готово» 11 px caps for 1 s, then fade).
- **GUIFlash fallback:** «Перезарядка 3.2 с».

**battle_loadout** (equipment strip, extend):

```
[rammer★][vent][optics] │ [field mod ×2] │ [directive]      28 px icons, 4 px apart, groups split by 1 px divider
```

- **Anchor:** docked to the left end of the stock consumables bar, at the same bottom as the bar (`bottom = H − 12`), right edge = the stock bar's left edge − 12. The bar's width is `slots × 57`; read the slot count from `consumablesPanel` Python (`self._slotsByIdx` length or the ammo controller) or fall back to `W/2 − 360`.
- **Icons:** `artefact/<name>.png` with `equipmentPlus_overlay.png`/`equipmentTrophy*_overlay.png` stacked for trophy and bonus items. A ★ in the matching-slot case is a 10 px `color-gold` corner badge (our glyph). Directives `artefact/*DirectivesBattleBooster*.png`/`battleBooster_overlay.png`.
- **Note:** 1.45's stock bar already shows optional devices (`as_addOptionalDeviceSlotS`). The loadout strip is the compact reading (bonus stars, field modifications, directives), and its `show_devices` default stays on only in `detailed`.
- **GUIFlash fallback:** the current `<img>` row.

### 5.6 sixth_sense: lamp (replaces `sixthSense`)

```
         ╭──── 72 ────╮
         │   [lamp]   │   our lamp_128.png (or client commander_sixthSense 48, or eye/badge/marks)
         │  ◜‾‾‾‾‾◝   │   radial timer ring 4 px color-accent, drains over 10 s (the stock lamp duration)
         ╰────────────╯
              7          seconds 22 bold under the ring (show_timer)
```

- **Mode:** replace. Suppress `sixthSense` while our lamp widget is available. The stock lamp's audio (the `bulbVoices` sound) is untouched, because it is a separate setting.
- **Anchor:** exactly the stock lamp position, `x = W/2 − 109 + 43`, `y = H/2 − 225 + 43` (centre of the stock 86 px lamp), and at `H ≥ 1600` with scale 1, `−150/−275`. The panel is centre-aligned on that point, so a resized lamp stays centred.
- **Look:** icon 72 px, pulse between 1 and 0.55 opacity every 500 ms while lit. The ring uses SVG `stroke-dasharray` and counts down `hide_after_s` or the lamp's own 10 s. Colour `color-accent` (Battle Observer's `#FD7D1A` is the same role).
- **Fair play:** fires on the same own-vehicle state as the stock lamp; nothing about the spotter.
- **GUIFlash fallback:** the current `<img>` with pulse frames. The stock lamp is not hidden.

### 5.7 battle_clock: clock and timer (extends `battleTimer`)

```
                                   ┌ stock timer 11:42 ┐
                                   └───────────────────┘
                                     [clock 14] 21:47     under it, right-aligned, 13 px, muted
```

- **Mode:** extend. Docked under the stock `battleTimer` (`right = 8`, `top = battleTimer.initedHeight + 2`). With `show_timer` on and option `replace_timer`, suppress `battleTimer` and show `11:42` in 22 px bold at the stock spot with the local time under it. The default is `replace_timer: false`, because the stock timer has its own end-of-battle colouring.
- **Icon:** `library/clock_icon_s.png` at 14.
- **Hangar:** in the hangar the clock stays in hangar_info (§6).
- **GUIFlash fallback:** the current text.

---

## 6. Other panels (appendix, short)

| Component | Mode / anchor | Layout and icons | GUIFlash fallback |
|---|---|---|---|
| **received_hits** | extend; docks above our damage log (x = 229, bottom = damage log top − 4), 250 wide, `color-danger` rail | Header `По вам 3 · проб. 1 · −390 · [blk] 240`. Rows: `[outcome 16] −390 [shell 18] [cls red 16] Pz.IV +1 [crit]`, with outcome icons from `library/critical_damage/*` | current text |
| **main_gun** | extend; second line inside the team_hp plate, left half | `[target] 1 850 / 2 940 · осталось 1 090`, progress bar 120×3 `color-gold`; «порог пройден» as a green check | text line top right |
| **battle_efficiency** | extend; second line inside the team_hp plate, right half | `[wn8] ≈ 2 340 (2 105)` coloured by rating tier (`rating-*` palette); `[dmg] 2 150 / 1 720 +25 %` | text top right |
| **personal_best** | overlay, left middle (x = 8, y = H/2 − 60), 220 wide | `[record] 6 812 · осталось 1 200` per metric with the metric's efficiency icon; beaten → gold row `[record] 7 050 +238` | text |
| **death_card** | overlay, centre, top = H/2 − 260, 320 wide; postmortem only | `[contour 59×23][cls 24] Pz. IV` / `[shell 20] −390` 28 px red / `[modules 20…][roles 14…]` / hull-side dial 48 px (8 sectors, the hit one `color-danger`) | current text |
| **gun_arc** | overlay, centre, top = H/2 + 110 (above reload) | 160 px arc bar: limits as ticks, dot = gun, degrees 13 px each side; near the stop the side turns `color-warning`, at the stop `color-danger`; our `traverse` glyph | text |
| **session_goals / personal_missions** (battle lines) | overlay, docked under marks_panel (or left middle when marks is off) | `[target] Ср. урон 3 000: нужно 3 900`; missions `[mission] ЛБЗ ЛТ-7: 2/3 засвета` | text |
| **bush_circle** | 3D, unchanged | — | — |
| **hangar labels** (hangar_marks, hangar_ratings, hangar_info, session_stats, marks_history, battle_hits, platoon_helper, session_goals, personal_missions) | overlay; one right-side column under the «///» button (right = 8, from top = 96), stacked with 6 px spacing, each a plate 280 wide with a caps header + «///» mark | Rows as icon + number: flag `flags/25x17`, tier `levels/tank_level_small_<n>`, class `vehicleTypes/white`, marks `library/marksOnGun/mark_n`, ping `pingStatus/stairs_indicator_n`; ratings coloured by `rating-*`; session `[session] 12 боёв · 58 % · 2 140 · WN8 2 310` | current text |
| **«///» button** | overlay, top right under the lobby header (current `BUTTON_DEFAULTS`) | 36×36 plate, `LOGO_SHAPES` mark in `color-accent`, hover border accent; in edit mode it gets the same frame and caption as panels | — |
| **Settings window** | unchanged layout | Component cards get the catalog preview SVG as a 64 px thumbnail and a mode badge «заменяет стандартную панель» / «дополняет» / «поверх» (Badge component) | — |

---

## 7. Implementation order

1. Protocol v3 `widget` payload + page renderer switch (§2.3), keeping `text` as fallback.
2. `core/client/hud/stock` suppression (§3.2) with the GUI-visibility, full-stats and postmortem hide rules.
3. Shared UI kit for the HUD: `HudPlate`, `IconNumber`, `RadialTimer` (SVG), `MiniBar`, `ClientIcon` (an `img://` string with our-glyph fallback), in `ui-web/src/shared/ui/hud/*`.
4. Widgets in this order: team_hp, damage_log (+last_hit), sixth_sense, marks_panel, hit_log, the consumables/reload/loadout trio, clock; then the appendix.
5. Assets set `otmetki_hud_icons` (§2.4 new glyphs).

## 8. Live checks this spec adds

- `<img src="img://gui/maps/icons/artefact/rammer.png">` renders in our Gameface page on Lesta 1.45 (client paths, not only our `otmetki/` ones).
- `wulf.getImagePath` on a `battleAtlas` sprite id: whether Coherent can draw it (it would unlock the stock 16×16 damage-log sprites).
- Suppressed `fragCorrelationBar`, `battleDamageLogPanel` and `sixthSense` stay hidden through Tab, V, sniper/arcade switches, postmortem and replays, and come back when the feature is switched off mid-battle.
- Marks strip against the bottom chat line; reload bar against ribbons.
- SVG `stroke-dasharray` and `filter: grayscale` in the client's Coherent build.

## Sources

- Client assets, RU 1.45.0.5231: [github.com/unicum-gg/wot.assets (branch Lesta)](https://github.com/unicum-gg/wot.assets/tree/Lesta): `gui/maps/icons/**`, `gui/unbound/res_map.json`, `gui/flash/atlases/battleAtlas.xml`, `gui/gameface/_dist/production/battle/*`, `gui/gameface/fonts/*`.
- Client sources, RU 1.45: [github.com/izeberg/wot-src (branch RU)](https://github.com/izeberg/wot-src/tree/RU): `gui/Scaleform/genConsts/BATTLE_VIEW_ALIASES.py`, `gui/Scaleform/daapi/view/battle/{classic,shared}/page.py`, `…/shared/consumables_panel.py`, `account_helpers/settings_core/settings_constants.py`, `gui/impl/backport/backport_r.py`, `sources-as3/gui_battle/…/{BattlePage,BaseBattlePage}.as`, `…/sixthSense/SixthSense.as`, `…/consumablesPanel/ConsumablesPanel.as`, `…/damagePanel/DamagePanel.as`.
- OpenWG Gameface README (URL schemes, resource types): [gitlab.com/openwg/wot.gameface](https://gitlab.com/openwg/wot.gameface).
- Battle Observer (reference for replace-the-stock patterns, sizes, colours): [github.com/Armagomen/battle_observer](https://github.com/Armagomen/battle_observer): `as/src/.../base/ObserverBattleDisplayable.as` (`hideComponent`), `teamshealth/TeamsHealthUI.as`, `settings/settings_data.py`, `_constants.py` (`LOGS_ICONS = width 16 height 16 vspace -4`).
- Pack descriptions: [tankist.net: Jove](https://tankist.net/modpacks/jove), [joves-modpack.ru](https://joves-modpack.ru/), [wotspeak.org: Jove](https://wotspeak.org/modpacks/6-mody-ot-dzhova-modpak-ot-jove.html), [mirtankov.su: Jove-style damage panel](https://mirtankov.su/mody/panel-povrezhdenij/panel-povrezhdenij-kak-u-jove-0811-s-tajmerom-remonta), [mirtankov.su: Battle Observer](https://mirtankov.su/mody/interfeis/battle-observer), [wotspeak.org: Battle Observer 1.45 Lesta](https://wotspeak.org/mods/260-battle-observer-wot.html), [cyber.sports.ru: Jove pack review](https://cyber.sports.ru/wotblitz/blogs/3385579.html), [esports.ru: 2026 mods guide](https://esports.ru/igrovaya-industriya/articles/modi-mir-tankov-2026/).
