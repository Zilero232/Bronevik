# Visual language: making the site feel like the game (verified 2026-09-25)

Goal: Три отметки should feel like «Мир танков» without looking like a Lesta service.
Legal limits (developers.lesta.ru agreement):
- **Policy 1.6** bans "иконок, кнопок и других элементов интерфейса, схожих с интерфейсом сервисов Леста Игры, которые могут ввести пользователя в заблуждение или вызвать ассоциацию с Леста Игры".
- **1.7** bans hiding copyright notices or watermarks in Lesta content.
- **§12**: every logo and trademark shown on the Platform or in the API belongs to Lesta.
- **§18**: no partnership. We must never imply one.

The rule we follow: **use shared game conventions, never Lesta's brand.**

## 1. Game and tanki.su visual language

**In-game UI** (from `gui/gui_colors.xml` and textures in the `unicum-gg/wot.assets` `Lesta` branch):
- Very dark, desaturated ground. Warm cream text. Brushed metal and camo-grain textures.
- Thin 1 px hairline borders, low-alpha dark glass panels, soft orange glows.
- Team colours:
  - ally green `#61BF22` / `#7BEC37`
  - enemy red `#C81400` / `#F50800`
  - colour-blind enemy purple `#8379FE`
  - gold text `#FFC363`
  - neutral cream text `#C9C9B6` / `#E9E2BF`
- Tank previews are 3/4-view renders on a transparent background, usually placed over a large blurred, faded **nation flag**. The `flags/160x100` textures are waving flags that fade to transparent on the right.
- Tiers are Roman numerals. Tier XI now exists in the ecosystem: tomato.gg shows "XI". Our tier type must allow 11 (**[verify for Lesta]**).

**tanki.su site CSS** (`ptl-ru-cdn.tanki.su/static/5.145.2…/main.css`, most frequent values). These are the **brand values we must NOT reproduce as a set**:
- cream `#F9F5E1`, `#FFFBED`, `#E9E2BF`; greys `#8C8C7C`, `#A29E87`, `#B8B8A2`
- darks `#1C1C1E`, `#151515`, `#0F0F0F`, `#333335`
- accents `#FAB81B` (amber), `#F25322` / `#FF5000` / `#FF8200` (orange), `#FFD200`; green `#66AF4C`, red `#BC2515`
- fonts: proprietary **"MTSans" Regular/Bold/Light Condensed** (from `tanki-media-content.tanki.su/.../MT-sans`) and legacy **"WarHeliosCondC"**

| OK to use (community convention) | Must NOT copy (Lesta brand / service UI) |
|---|---|
| Class shapes (diamond / triangle / square), Roman tier numerals, gold for premium, laurel for elite | Мир танков logo, Lesta logo, «Леста Игры» marks used as decoration |
| Mastery levels (3rd / 2nd / 1st / Master) and MoE count (1–3) as concepts | MTSans / WarHelios fonts; exact cream `#F9F5E1` + amber `#FAB81B` pairing |
| Nation identity via stylised flags or emblems | tanki.su header, nav, button shapes, page layouts, hangar screenshots used as chrome |
| XVM/WN8 rating colour scales | Copying in-game textures (laurels, badges, MoE barrels, class PNGs) as our UI icons |
| Tank renders **from the API**, used as data with attribution | Removing or hiding Lesta watermarks in content |

## 2. Class icon convention (verified from game textures)

I checked `gui/maps/icons/vehicleTypes/64x64/*.png` in the `Lesta` branch. All shapes are **solid fills**, with no outline and no inner bars.

| Class | Shape (bbox inside a 64 px canvas) | Notes |
|---|---|---|
| Light (`lightTank`) | Solid **rhombus**, taller than wide (24×30, ratio about 0.8) | one piece |
| Medium (`mediumTank`) | Same rhombus, slightly larger (28×34), cut by **1 diagonal gap** into 2 pieces | the gap runs "\" (top-left to bottom-right), parallel to the NE and SW edges |
| Heavy (`heavyTank`) | Larger rhombus (30×37), cut by **2 parallel "\" gaps** into 3 slanted bars | the "stripes" read as the class marker |
| TD (`AT-SPG`) | Solid **downward-pointing triangle** (22×22) | flat top edge |
| SPG (`SPG`) | Solid **square** (20×20) | smallest glyph |

So the game marks class by *segments cut out of a rhombus*. It does not stack bars. Light, medium and heavy also grow slightly in size.

Variants:
- **Regular**: silver metallic gradient, about `#D9D9D9` down to `#A5A9AF`.
- **Premium / "gold"** (`vehicleTypes/gold`): fill `#FFEECC` with an orange outer glow `#FF5500`. Premium tank names use gold `#FFC363`.
- **Elite** (`*_elite`, i.e. fully researched): the same glyph inside a **golden laurel wreath**.
- Other sets exist: `red`, `green`, `white`, `outline`, `flat`. The minimap markers use the same shapes coloured by team.

Community sites (tomato.gg, XVM, wotstat) all redraw these shapes as SVG, including prem/elite variants. That makes the **shapes** community-standard. The PNGs themselves are Lesta assets.

## 3. Tank images from the Lesta API

Pattern (verified with curl: nginx, `Cache-Control: max-age=315360000`, no watermark):

```
https://api.tanki.su/static/<apiVersion>/wot/encyclopedia/vehicle/<size>/<nation>-<tag>.png
```

| API field | `<size>` path segment | Size | Contents |
|---|---|---|---|
| `images.big_icon` | *(none)*: `.../vehicle/ussr-R106_KV85.png` | **160×100** RGBA | 3/4 render |
| `images.small_icon` | `small/` | **124×31** | cropped side render (carousel strip) |
| `images.contour_icon` | `contour/` | **60×23** (width varies, e.g. 73×23) | white side silhouette |

- The version segment isn't strict: `2.42.0` and `2.80.0` return the same file. **Store the URL exactly as the API returns it**; don't build it ourselves.
- The API gives no larger image. Hi-res renders exist only in game files, which are Lesta-owned.
- Licensing: the images come from the API itself, so showing them counts as using API content under the agreement. Two conditions:
  - keep the mandatory footer ("источник данных: Леста Игры", © line, link to tanki.su and the support center)
  - never alter them to hide their origin (Policy 1.7)
- Don't mirror them permanently: the ban on indefinite storage applies. Proxying through `next/image` with a TTL cache is fine.

**`unicum-gg/wot.assets` (branch `Lesta`)** has the full GUI texture tree: `gui/maps/icons/vehicleTypes`, `flags/{25x17,60x40,160x100,362x362,600x450}`, `nations/*_131x31`, `marksOnGun/{67x71,95x85,180x180}`, `vehicleLevel/s40x40`, achievement art. Its README says: "Assets provided in the repository are the property of sole owners". There is **no licence**, so these are **Lesta property**. Use them only as design reference, never ship them. `wot.models` (glTF) falls under the same rule: fine for an internal armour viewer only if it clearly credits Lesta, and legally riskier than API images.

## 4. Nation flags

- The game uses **historical** waving flags: USSR hammer-and-sickle, a WWII German war ensign with Balkenkreuz, 48-star USA, Kingdom of Italy. Lesta's nation list includes `intunion` (the international union), which has a custom emblem.
- **Don't copy these.** The German and Italian ones are also politically sensitive.
- **flag-icons** (lipis, MIT) is fine for modern states (de, us, fr, gb, cn, jp, cz, se, pl, it). It has no USSR flag and no `intunion`. Pair it with our own emblems:
  - USSR: red field + our own 5-point star
  - intunion: neutral globe or star-ring
- Better: keep the **own stylised emblem set** already in `packages/icons/src/icons/nations.tsx` (star, cross, circle-star…) as the primary glyph. Use flag-icons only for **large decorative flag backdrops**: blurred, 12–20 % opacity, fading right, behind tank renders. That's the in-game and tomato.gg pattern, drawn with open assets.

## 5. Community sites: patterns worth borrowing

- **tomato.gg**:
  - tank cards = API render over a faded nation-flag backdrop + Roman tier + SVG class glyph (premium variant in gold)
  - dense dark tables, WN8-coloured cells
- **XVM / modxvm**: the de-facto rating palette. Very bad `#FE0E00`, bad `#FE7903`, average `#F8F400`, good `#60FF00`, very good `#02C9B3`, unicum `#D042F3`. Players read these colours instantly.
- **kttc.ru, wotstat.info, lebwa, protanki**:
  - independent logos and own display fonts
  - contour icons in table rows
  - mono numerals for stats
  - MoE shown as 1–3 small stars
  - mastery as a compact badge
- Nobody uses Lesta fonts or the site chrome. The "tanky" feel comes from:
  - class glyphs and tier numerals
  - tank renders
  - flag backdrops
  - rating colours
  - dark metal surfaces

## 6. Recommendations for Три отметки

**Palette (`apps/web/client/shared/styles/_tokens.scss`)**
- The current tokens (bg `#0B0D0F`, accent `#FF6B1A`, Tektur/Onest) are already clearly different from tanki.su. Keep the orange accent, and don't move to amber `#FAB81B` + cream `#F9F5E1`.
- Add game-semantic tokens:
  - `--color-premium: #FFC363` (gold text/glyph), `--color-premium-glow: rgb(255 85 0 / 45%)`
  - `--color-elite: #D9B25C` (laurel gold)
  - `--color-ally: #61BF22`, `--color-enemy: #D32A12`, `--color-enemy-cb: #8379FE` (replays and battles)
  - light theme: premium `#B8791A`
- Rating scale: offer an **"XVM colours"** option with the six hex values above next to our current accessible scale. Keep the existing hatch patterns for colour-blind users.
- Surfaces: keep `--brushed` and `--noise`. Add `--flag-backdrop` (linear mask `to right, #000 30%, transparent`) for hero/cards.

**Icon redesign (`packages/icons`)**
- `classes.tsx` currently draws side-view tank silhouettes. **Replace them with the convention**, as a 24×24 viewBox, fill-based with `currentColor`:
  - Light: rhombus `M12 2.5 19 12 12 21.5 5 12Z`
  - Medium: the same rhombus with one 1.6 px "\" gap through the centre. Build it as two polygons, or apply a mask with a line from (7,6.5) to (17,17.5).
  - Heavy: a slightly larger rhombus `M12 1.5 20 12 12 22.5 4 12Z` with two parallel "\" gaps, about 3.4 px apart → 3 bars.
  - TD: `M4 6h16L12 19Z` (inverted triangle)
  - SPG: `M6.5 6.5h11v11h-11Z`
  - Add props `variant: 'regular' | 'premium' | 'elite'`:
    - premium = fill `var(--color-premium)` + `drop-shadow(0 0 3px var(--color-premium-glow))`
    - elite = our own simple two-branch laurel (5–6 leaves per side, drawn from scratch, not traced)
- **Mastery** (`mastery.tsx`): the shield + chevrons + star is fine and original. Tint it: 3rd = bronze `#B0714A`, 2nd = silver `#AEB6BF`, 1st = gold `#E0B24C`, Master = gold with an accent glow. Don't trace the game's mastery medals.
- **Marks of excellence** (`marks.shapes.ts`): the game draws marks as **bands or stars painted on a diagonal gun barrel**, and the style depends on the nation (the USSR barrel uses red stars; others use white rings). Keep our own design:
  - a 30°-tilted barrel stroke with 1–3 five-point stars above it
  - stars filled `currentColor`, and gold at 3 marks
  - optional `nation` prop that switches stars ↔ rings

**Where to use API images**
- **Tables and lists**: `contour_icon` (60×23), tinted by CSS `filter` or used as-is, or `small_icon` (124×31) for session and replay rows.
- **Cards and compare columns**: `big_icon` 160×100 over the flag backdrop, class glyph + tier numeral top-left, gold name when premium.
- **Tank page hero**: `big_icon` shown at a scale of 1 to 1.5 at most (it's only 160 px), placed on a large blurred flag backdrop with the `--dusk` glow. Don't upscale it into a blurry hero. If we ever need big art, use our own illustration or a CSS "blueprint" treatment.
- **`next/image`**: add to `IMAGES` in `apps/web/client/config/build.ts`:
  ```ts
  remotePatterns: [{ protocol: 'https', hostname: 'api.tanki.su', pathname: '/static/**' }]
  ```
  The originals are tiny PNGs, so consider `unoptimized` for `contour` / `small` to avoid pointless AVIF conversion. `minimumCacheTTL` of a week is fine.
- **Fallbacks**: on 404 or missing `images`, render the class glyph centred on a flag backdrop (card), or the class glyph + tier (row). Always set explicit `width`/`height` (160×100, 124×31, 60×23) to avoid layout shift.
- **Attribution**: keep the footer credit visible on every page that shows these images. Never crop, recolour or overlay them in a way that hides their origin.

## Sources
- developers.lesta.ru/documentation/rules/agreement/ (Policy 1.6–1.9, §12, §18)
- api.tanki.su/static/…/wot/encyclopedia/vehicle/{,small/,contour/}*.png (probed); urlquery.net reports of `contour/ussr-R106_KV85.png`
- github.com/unicum-gg/wot.assets (branch `Lesta`: `gui/maps/icons/vehicleTypes|flags|nations|marksOnGun`, `gui/gui_colors.xml`)
- tanki.su CSS (`ptl-ru-cdn.tanki.su/static/5.145.2_a7ba6e/ptl_static/css/main.css`)
- modxvm.com/en/ratings/xvm-scale/colors/ (XVM scale); tomato.gg; github.com/lipis/flag-icons (MIT)
