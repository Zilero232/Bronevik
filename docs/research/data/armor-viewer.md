# 3D armor viewer: research

Research date: 2026-09-25, source audit 2026-09-27 (see section 7). Feature row in [features.md](../../product/features.md): "3D-модель и схема брони (просмотр, пробитие по снарядам)", source FILES, P5.

**Summary.** No binary parsing is needed. [`unicum-gg/wot.models`](https://github.com/unicum-gg/wot.models), branch `Lesta`, already publishes per-vehicle armor geometry as `collision.json` (about 40 KB per tank). It is split per piece (hull, chassis, turret N, gun N) and grouped by plate name (`armor_N`, `leftTrack`, `gun`, `surveyingDevice`). It comes with mounts (turret and gun joints, pitch limits) and a module-name → piece map. It is built by the TypeScript [`unicum-gg/wot.build`](https://github.com/unicum-gg/wot.build) from the Lesta update CDN, on the same client build as our `wot.src` source (`1.45.0.5231`). The importer fetches it the way it already fetches `wot.src`. It joins thickness and spaced flags from our own parsed XML. The client draws it with three.js and R3F. We draw collision geometry only: no visual `.glb`, no textures.

---

## 1. Where armor data comes from

### In the game client

| What | Where / format |
| --- | --- |
| Armor geometry (current clients) | `vehicles/<nation>/<code>/collision_client/<Piece>.havok`: a **Havok binary tag file (`TAG0`)**, variant "Collision Physics Data". Each piece (Hull, Chassis, Turret_01, Gun_01…) holds named shapes `s_armor_N`, `s_leftTrack`, `s_gun`, `s_surveyingDevice`. The mesh is quantised: per-section 11/11/10-bit "packed" vertices plus file-wide 21/21/22-bit "shared" vertices, with quad faces. See `wot.build/lib/havok.ts` and `lib/collision.ts`. The vehicle XML points at it via `hitTester/collisionModelClient` (`vehicles/…/collision_client/Hull.model`). |
| Legacy armor geometry (pre-Havok WG clients, most old tools) | `collision_client/*.model` + `.visual_processed` (BigWorld packed section) + `.primitives_processed` (BigWorld block container: `<set>.vertices` / `<set>.indices` with a named vertex format such as `xyznuvtb`, index at the file tail). The armor group is the primitive-group index, mapped to `armor_N`. |
| Visual model | `normal/lod0/*.model` → `.visual_processed` + `.primitives_processed`, textures `*_AM/ANM/GMM/AO.dds`. |
| Thickness | Vehicle XML `hull/armor`, `turrets0/<t>/armor`, `guns/<g>/armor`, `chassis/<c>/armor` (`leftTrack`, `rightTrack`). Spaced plates carry `<vehicleDamageFactor>0</vehicleDamageFactor>`. Example: IS-7 `armor_14`/`armor_15` = 30 mm spaced, `armor_13` = 0. Already in `wot.src`, which we import. |
| Packages | `res/packages/vehicles_level_NN[-partK].pkg` (plain ZIP) for per-vehicle pieces, `shared_content*.pkg` for shared textures, `scripts.pkg` for XML. On the CDN they sit inside split 7-Zip install volumes. `wot.build` range-downloads only the needed blocks (sparse archive) via WGUS `lstus-ru.lesta.ru`, guid `MT.RU.PRODUCTION`. |

### Public mirrors

- **`wot.src`** (and `izeberg/wot-src`) hold XML and scripts only. No meshes.
- **[`unicum-gg/wot.models`](https://github.com/unicum-gg/wot.models)** has branches `Lesta`, `Lesta_PT`, `WG` and `WG_CT`. It is rebuilt daily (last push 2026-09-25). The `Lesta` branch `.version_name` is `1.45.0.5231`. Layout:
  - `vehicles.json`: tag → folder, e.g. `"R45_IS-7": "russian/R45_IS-7"`. Note that the nation folder is `russian`, not `ussr`, and `_IGR`/`_FL` clones point to the base folder.
  - `vehicles/<nation>/<code>/collision.json`, with keys `parts`, `armor`, `spaced`, `hullPosition`, `modules` and `mounts`:
    - `parts.<Piece>`: `{ positions: number[], indices: number[], groups: [{ name, start, count }] }`, Y-up.
    - `armor.<Piece>.<plate>`: mm. The README says thickness is deliberately excluded, but the file does contain it.
    - `spaced.<Piece>`: an array of plate names.
    - `modules`: module XML name → piece, e.g. `"_130mm_S-70": "Gun_01"`.
    - `mounts`: `turret` and `guns` joint positions, `pitch` limits and `sweep` (pitch-by-yaw curves).
  - `model.json` and `*.glb` / `*.webp`: the visual model. **Not used**, see §5.
  - IS-7 sizes: collision.json 38 KB (hull 161 vertices / 126 triangles, very low poly). The visual pieces total about 3 MB of GLB plus about 15 MB of textures.
- The mirror has no licence file. Its notice says: "Assets provided in the repository are the property of their sole owners". The README invites reuse: "shared community resource… Reuse and contributions welcome."

### How the importer gets them (ordered by preference)

1. **Mirror (default).** Fetch `vehicles.json` and `vehicles/<folder>/collision.json` from `raw.githubusercontent.com/unicum-gg/wot.models/<sha>`. Pin to a commit like `lib/source/github.ts` already does, and require `.version_name` to equal the `wot.src` version being imported. That is about 1 000 files and roughly 40–60 MB, cached on disk.
2. **Local install (`--client <dir>`).** Open `res/packages/vehicles_level_*.pkg` as ZIP, read `collision_client/*.havok`, and convert with a port of `wot.build/lib/havok.ts` + `collision.ts` (about 600 lines of TS). Only needed if the mirror dies. Ask the author before vendoring, because the repo has no licence.
3. **CDN (no client).** Run `wot.build` itself (`npm run models -- --collision-only --host lstus-ru.lesta.ru --guid MT.RU.PRODUCTION`) as an out-of-band tool. A full build is heavy, about 3 h and 20 GB.

## 2. Reusable parsers and converters

| Project | Lang | Licence | Activity | Collision + armor ids? | Verdict |
| --- | --- | --- | --- | --- | --- |
| [unicum-gg/wot.build](https://github.com/unicum-gg/wot.build) → [wot.models](https://github.com/unicum-gg/wot.models) | TypeScript (Node, tsx) | none (ask) | daily, 2026-09 | **Yes**: Havok TAG0 reader, named plates, mounts, Lesta branch | **Use the output. Port the code only as a fallback.** |
| [Anatoli5/Bullba-Hits](https://github.com/Anatoli5/Bullba-Hits) | JS (three.js viewer) + Py 2.7 mod | none stated | 2026-09 | Extracts from the local client, WG NA 2.4 | Reference UI only (hit recorder, pen-chance maps) |
| [atacms/wot-model-converter](https://github.com/atacms/wot-model-converter) (fork of [SkaceKamen's](https://github.com/SkaceKamen/wot-model-converter)) | Python | none | 2024 / 2016 | `.primitives(_processed)` → OBJ/DAE, no Havok | Obsolete for collision |
| [mikeoverbay/TankExporter](https://github.com/mikeoverbay/TankExporter) | VB.NET | none | 2026-05 | Visual models, modding | No |
| [wotcuk/WoT-Blender-Toolkit](https://github.com/wotcuk/WoT-Blender-Toolkit) | Python (Blender 4.3+) | GPL-3.0 | 2026-09 | Visual `.primitives`, skeletal | No (GPL, visual) |
| [Mikeyzy/WoT_ModDevTools](https://github.com/Mikeyzy/WoT_ModDevTools) | Python | GPL-2.0 | 2025-04 | `clientUnpacker.py` only | No |
| [Armor Inspector mod](https://wgmods.net/2319/) (in Protanki/Jove modpacks) | Py 2.7 in-client | closed | — | Uses the running client's own hit tester | Not reusable. Idea reference only. |
| tanks.gg / wotinspector armor | closed | — | — | — | UX reference only |

There is no npm or PyPI package that reads the Havok collision. Nothing is worth adding as a dependency.

## 3. Rendering stack (browser)

Current versions (npm, 2026-09-25). They match `docs/research/tooling/packages.md`.

| Package | Version | Role |
| --- | --- | --- |
| `three` | 0.186.1 | renderer |
| `@types/three` | 0.186.0 | types |
| `@react-three/fiber` | 9.8.1 | React renderer. Peers: `react >=19 <19.4` (we use ^19.3), `three >=0.156` |
| `@react-three/drei` | 10.7.8 | `OrbitControls`, `Bounds`, `Html` (tooltip), `GizmoHelper`, `AdaptiveDpr`, `useGLTF` |
| `three-mesh-bvh` | 0.9.15 | optional: accelerated raycast and ray-through-all-layers |
| `@gltf-transform/core` / `functions` / `extensions` | 4.5.0 | optional server-side packing to GLB |
| `meshoptimizer` | 1.2.0 | `EXT_meshopt_compression` encoder/decoder, if we ship GLB |

**Format decision.** Collision meshes are tiny: the IS-7 has 1 000 vertices in total across all pieces, 38 KB of JSON, about 8 KB gzipped. So ship **our own compact JSON** (or a typed-array binary) straight from the API and build `BufferGeometry` directly. glTF, Draco and meshopt add a decoder (Draco WASM is about 300 KB) for no gain. Keep `gltf-transform` + meshopt only if we later draw visual models. Draco is not recommended: `draco3dgltf` has been unmaintained since 2024, and meshopt decodes faster.

**Per-face armor.**
- Build one non-indexed `BufferGeometry` per piece, one draw call per piece.
- Add per-vertex attributes duplicated over each triangle's three vertices: `aThickness` (float, mm), `aFlags` (bit 0 spaced, bit 1 track, bit 2 gun/mantlet, bit 3 module, bit 4 zero-armor/hollow) and `aPlate` (index into a plate table for hover info).
- Compute the face normal in the shader with `dFdx`/`dFdy`, or bake it as `normal`.

**Shader colouring** (`ShaderMaterial` or `onBeforeCompile` on `MeshBasicMaterial`):
- Uniforms: `uPen` (distance-adjusted), `uCaliber`, `uKind` (AP=0, APCR=1, HEAT=2, HE=3), `uNorm` (deg), `uRicochet` (deg) and `uViewDir`. In orthographic mode the view direction is constant. In perspective mode use `normalize(cameraPosition - vWorldPos)`.
- Per fragment: angle θ = acos(|n·v|). Apply the §4 rules to get effective thickness, then colour: red = no pen or ricochet, yellow = within the ±25 % RNG band, green = pen. Spaced armor, tracks and zero-armor plates get fixed hues (e.g. purple and grey), as tanks.gg does.
- One uniform change recolours everything with zero CPU work. Rotating the camera is free.

**Hover.**
- `onPointerMove` on the mesh gives `intersection.faceIndex`. Look up the plate and nominal thickness, recompute the effective value on the CPU with the same TS function the shader mirrors, and show it in a drei `<Html>` tooltip.
- "Total along the ray" (spaced + main plate, as tanks.gg shows) needs all intersections: `raycaster.intersectObjects(pieces, true)` returns every hit, sorted.
- BVH is not needed at these polygon counts. Add `three-mesh-bvh` only if hover lags on mobile.

**Budgets.**
- Under 20 KB of armor payload per tank, gzipped.
- 1–6 draw calls.
- The three + R3F + drei chunk is about 250–350 KB gzipped, so load it only on the armor route.
- Use `frameloop="demand"` (render on change) and `AdaptiveDpr`.

**Next.js 16.**
- The canvas is client-only. Wrap it in a `'use client'` component and load it with `next/dynamic(() => import(...), { ssr: false })`. `ssr: false` is not allowed in Server Components.
- The server `page.tsx` fetches metadata and shells (SSR, SEO text, OG). The canvas payload is fetched on the client with TanStack Query.
- Add `three` to `optimizePackageImports` if bundle analysis shows it helps.
- Turbopack handles R3F with no extra config.
- Check that `transpilePackages` is not needed for drei 10 (it ships ESM).

## 4. Penetration math

Sources:
- Lesta wiki: [Стрельба и бронепробитие](https://wiki.lesta.ru/ru/%D0%9C%D0%B8%D1%80_%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2:%D0%A1%D1%82%D1%80%D0%B5%D0%BB%D1%8C%D0%B1%D0%B0_%D0%B8_%D0%B1%D1%80%D0%BE%D0%BD%D0%B5%D0%BF%D1%80%D0%BE%D0%B1%D0%B8%D1%82%D0%B8%D0%B5), [Снаряды](https://wiki.lesta.ru/ru/%D0%9C%D0%B8%D1%80_%D1%82%D0%B0%D0%BD%D0%BA%D0%BE%D0%B2:%D0%A1%D0%BD%D0%B0%D1%80%D1%8F%D0%B4%D1%8B)
- Lesta support: [Как работает бронепробиваемость](https://lesta.ru/support/ru/products/mt/article/15059/)
- WG wiki: [Ammo](https://wiki.wargaming.net/en/Ammo)
- tanks.gg colour legend: [Armored Patrol](https://thearmoredpatrol.wordpress.com/2015/04/24/inspect-your-tanks-easier-with-tanks-gg/)
- The decompiled client (`common/items/vehicles.py`, `_readShells`) confirms the fields. **`normalizationAngle` and `ricochetAngle` are read only when `not IS_CLIENT`**, so they are stripped from the client XML and have to be hard-coded.

| Rule | AP (`ARMOR_PIERCING`) | APCR (`ARMOR_PIERCING_CR`) | HEAT (`HOLLOW_CHARGE`) | HE (`HIGH_EXPLOSIVE`) |
| --- | --- | --- | --- | --- |
| Normalisation | 5° | 2° | 0 | 0 |
| Ricochet at impact angle ≥ | 70° | 70° | 85° | never |
| 2-caliber rule (C > 2T) | norm × 1.4 × C / (2T) | same | — | — |
| 3-caliber rule (C > 3T) | no ricochet (overmatch) | same | — | — |
| Distance falloff | linear between `piercingPower[0]` @100 m and `[1]` @500 m | same | none (both values equal) | none |
| After spaced armor or ricochet | keeps pen, minus plate LOS | same | loses 5 % of remaining pen per 10 cm travelled. XML `piercingPowerLossFactorByDistance` 0.05 ×10 = 0.5 per metre | modern HE (`mechanics MODERN`): see below |
| RNG | ±25 % of nominal (Lesta support). The client constant `DEFAULT_PIERCING_POWER_RANDOMIZATION = 0.15` exists, so show the band as configurable. | same | same | same |

Formulas:
- Angle θ is measured from the plate normal.
- `θn = max(0, θ − norm)` for AP/APCR when not ricocheting.
- `T_eff = T / cos θn`.
- Pen at distance d: `P(d) = P100 + (P500 − P100) · clamp((d − 100) / 400, 0, 1)`. Beyond 500 m this is shown as constant, which is also how tanks.gg does it.
- After a ricochet, the shell loses 25 % pen (Lesta wiki). This matters only for a "trace" mode.

Spaced armor, tracks and modules:
- **Spaced plates** (`vehicleDamageFactor 0`, `collision.json.spaced`): no damage on pen. For HEAT, jet loss starts at the first spaced plate, so the colour for "HEAT through spaced" depends on the gap. The viewer computes this per hover ray (sum along the ray) and colours spaced plates with a fixed hue in the shader.
- **Tracks** (`leftTrack` / `rightTrack` thickness from chassis armor): act as spaced armor. The shell cannot ricochet off tracks, gun or optics.
- **Gun / mantlet**: gun-piece plates (`armor_1..3`) are the mantlet. `gun` is the barrel, an external module that absorbs without ricochet.
- **Zero-thickness plates** (`armor_13 = 0`) are pass-through.
- **HE (modern Lesta mechanics).** Pen is `damage/armor`, with no normalisation and no ricochet. On no pen, damage is absorbed by nominal armor with `armorSpalls` / `shellFragments` / `blastWave` sub-blocks (already in `shells.xml`). Spaced armor gets `shieldPenetration` with a reduction factor of 3.0 (`component_constants.MODERN_HE_PIERCING_POWER_REDUCTION_FACTOR_FOR_SHIELDS`). **The viewer shows HE simply as pen vs nominal** (angle ignored), with a note.

Implement this as pure TS in `packages/gamedata` (`calculateArmorHit({ thickness, angle, shell, distance, flags })`). Unit-test it against wiki examples, and have the GLSL mirror it.

## 5. Legal

- **Lesta EULA** ([legal.lesta.ru/eula](https://legal.lesta.ru/eula/)):
  - 4.2.2 forbids reverse engineering, decompiling and modifying the game without written consent.
  - 4.2.4 forbids distributing the client.
  - 4.2.5 forbids distributing the game's "audiovisual elements, images or other IP" unless expressly permitted.
  - There is no explicit fan-site carve-out.
- **Developer API terms** ([lesta-api.md](lesta-api.md)): forbid derivative works without consent, implying affiliation, and Lesta-like UI. They require "© Леста Игры", "источник данных: Леста Игры" and links to the game site and the Support Center. These terms cover API data, not client files, but they are the tone Lesta expects.
- **[Content creator rules](https://legal.lesta.ru/contributors-content-guidelines/)** allow creating and monetising content that uses game material. You must not claim official status and must not publish NDA or leaked material.
- **Practice.** tanks.gg, wotinspector, armor.wotinspector, unicum.gg and many RU mods (Armor Inspector, Protanki calculators) have published collision-derived armor views for about 10 years. No takedown is known. The WG/Lesta mod portal hosts Armor Inspector. The risk is tolerated, but it is not a licence.

**Safe approach:**
1. Serve **collision geometry only**: coarse, non-artistic, functional data. Do not serve the visual GLB, textures, camouflage or 3D styles.
2. **Do not scrape or show PT/CT (`Lesta_PT`) vehicles** before release. That is closer to the NDA/leak clause.
3. Put in the UI and API response: "Геометрия брони и характеристики: © Леста Игры. Все права защищены. Источник данных: Леста Игры", plus a link to the official site. Credit `unicum-gg/wot.models`.
4. No affiliation claims, no Lesta branding in the viewer.
5. Keep a kill switch: a feature flag, plus a script that deletes the stored models if Lesta asks (`armor:purge`).
6. Don't redistribute the raw mirror as a download. Serve only our processed per-vehicle payload.
7. Tell the `wot.models` author we consume it. Ask before vendoring any `wot.build` code (the repo has no licence).

## 6. Implementation plan

**Server: importer step** (`apps/web/server/src/modules/gamedata`)

1. **Source.**
   - Add a `models` source in `lib/source/source.constants.ts`: `unicum-gg/wot.models@Lesta`, backup none, `--models-ref`, and `--local-models <dir>` for a local checkout.
   - Reuse the GitHub fetcher and disk cache (`apps/web/server/.cache`, keyed by sha).
   - Guard: the models `.version_name` must equal the `wot.src` version. Otherwise keep the previous armor models and log a warning.
2. **Parser.**
   - Create `lib/parsers/armor-model`: a pure `parseCollision(json)` that validates with zod and returns `ArmorModel { pieces: Record<Piece, { positions: Float32Array; indices: Uint32Array; groups: {plate, start, count}[] }>, modules, mounts, hullPosition }`.
   - Put the types in `packages/gamedata`.
3. **Join.**
   - Take thickness and spaced flags from **our** `VehicleSpec` (hull, turret, gun and chassis armor, per module), not from the mirror's `armor` block, which is used only as a cross-check.
   - Extend `parseArmor` to keep `vehicleDamageFactor` (spaced) and other material flags (`mayRicochet`, `collideOnceOnly`). Today it keeps just a number and may drop plates written as `30 + <vehicleDamageFactor>`.
4. **Pack.**
   - Per vehicle, write a compact binary: header JSON, then Float32 positions (quantised to Int16 over the bounding box), Uint16 indices and a plate table. Or write gzipped JSON. Target under 20 KB.
   - Emit only what changed (hash compare, like `diffSpecs`).
5. **Storage.**
   - Store it on the VPS disk through the object storage abstraction (`core/storage`, `LocalDiskStorage` on the `serverdata` volume; there is no S3): key `armor/<tankId>/<hash>.bin`, immutable, long `Cache-Control`.
   - Add a DB row `VehicleArmorModel { tankId, gameVersion, key, hash, pieces }`, or a `GameDataEntry` kind `armorModel`.
   - Dev uses the same local storage under `.data/armor`.
6. **API.**
   - `GET /tanks/:slug/armor?turret=&gun=&chassis=` → `{ gameVersion, modelUrl, pieces→module map, plates: { piece: { plate: { thickness, spaced, kind } } }, mounts, shells: [{ id, kind, caliber, pen100, pen500, damage, piercingPowerLossFactorByDistance }] }`.
   - Put the zod contract in `packages/schemas`.
   - The geometry itself is fetched from `modelUrl` (the API).
   - Also expose `/v1` later, subject to legal §5.

**Client (FSD)**

- **Route:** `app/[locale]/(site)/t/[slug]/armor/page.tsx`. Server component: metadata and `generateMetadata`. It renders `views/tank-armor`.
- **`entities/armor-model`:**
  - `api` (TanStack Query key `['armor', slug, modules]`)
  - `model` (decode binary → `BufferGeometry` with `aThickness`/`aFlags`/`aPlate`)
  - `ui/ArmorMesh` (one piece, shader material)
- **`features/armor-inspect`:**
  - `lib/penetration.ts` re-exports `calculateArmorHit` from `@otmetki/gamedata`
  - `ui/ShellPicker` (own and enemy gun, shell, distance slider 0–565 m)
  - `ui/HoverTooltip` (nominal, angle, effective, spaced/track, "total along ray")
  - `ui/ModulePicker` (turret/gun/chassis → pieces via `modules`)
  - `ui/Legend`
- **`widgets/armor-viewer`:**
  - `<Canvas frameloop="demand">` + `OrbitControls` + preset camera views (front, side, 30° angle, top)
  - hull-down toggle, turret yaw / gun pitch within `mounts.pitch`
  - The whole widget is loaded with `dynamic(..., { ssr: false })`.
- **`views/tank-armor`:** layout, SSR text (primary armor numbers from `VehicleSpec` for SEO and no-JS), attribution footer.
- Link it from `views/tank` (a tab or button "Бронирование 3D"). Compare mode (`views/compare-tanks`) can reuse the widget later.

**Fallbacks**

- Models missing for a tank (new vehicle, mirror lag) → show a 2D fallback: the primary armor table (`primaryArmor` hull/turret front/side/rear from `VehicleSpec`), plus a "3D-модель появится после обновления" state.
- Mirror dead → run the `--local-models` path: either a checkout produced by running `wot.build --collision-only` ourselves, or (after the author agrees) a vendored Havok reader over a local client's `vehicles_level_*.pkg`.
- Dev/e2e and Storybook-like design page → a committed **demo model**: a hand-built box tank (hull, turret and gun boxes with named groups `armor_1..n`, one spaced skirt, tracks) at `apps/web/client/shared/fixtures/armor-demo.json`. It is generated, not extracted, so it is legally clean and lets the e2e smoke test run without stored models or the mirror.

**Order of work**

1. Penetration math + tests in `packages/gamedata`.
2. Mirror source + parser + join + pack in the importer (`--dry-run` prints plate/thickness mismatches vs the mirror's `armor` block).
3. Storage + API + schema.
4. Client viewer with the demo model.
5. Shader + hover.
6. Shell and distance pickers, module switching.
7. Attribution, feature flag, e2e smoke on the demo model.

## 7. Мир танков, not World of Tanks: source audit (2026-09-27)

**Verdict.** Every source the importer reads is already built from the Lesta client of «Мир танков», not from Wargaming's World of Tanks. Nothing had to be switched. What was missing was a guard that proves it on every run, a check against the live game version, and a visible source badge in the viewer. All three are now in place (see "Guards added" below).

### Sources and versions

| Constant | Repository @ branch | Client (update service guid) | Version on 2026-09-27 | Used for |
| --- | --- | --- | --- | --- |
| `GAME_DATA_SOURCES.RU` | [`unicum-gg/wot.src@RU`](https://github.com/unicum-gg/wot.src/tree/RU) | `MT.RU.PRODUCTION` (`lstus-ru.lesta.ru`), named in the branch README | 1.45.0.5231 | vehicles, modules, shells, armor thickness, equipment, crew, maps |
| `GAME_DATA_SOURCES.PT_RU` | `unicum-gg/wot.src@PT_RU` | `MT.PT.PRODUCTION` (Lesta public test) | — | snapshot only, never armor |
| `GAME_DATA_SOURCES.IZEBERG_RU` | [`izeberg/wot-src@RU`](https://github.com/izeberg/wot-src/tree/RU) | Lesta RU (no guid in its README) | 1.45.0.8259 (`v.1.45.0.0 #2284`) | backup mirror |
| `LOCALE_SOURCES.RU` | `izeberg/wot-src@RU` | Lesta RU | same | `.po` localization (`sources/res/text/ru/lc_messages`) |
| `MODEL_SOURCES.RU` | [`unicum-gg/wot.models@Lesta`](https://github.com/unicum-gg/wot.models/tree/Lesta) | `MT.RU.PRODUCTION` (per the branch table in the `main` README) | 1.45.0.5231 | armor collision geometry |
| `MINIMAP_SOURCES` | `unicum-gg/wot.maps@Lesta` / `Lesta_PT` | Lesta | — | minimaps |

Both mirror families also publish Wargaming branches, and these are what we must never read:
- `wot.src@EU/NA/ASIA/CT`
- `izeberg/wot-src@EU/NA/ASIA/CT/CN`
- `wot.models@WG/WG_CT`

The Wargaming branches are on **2.4.0.5450** (`WOT.EU.PRODUCTION`). Since World of Tanks 2.0 the version line alone tells the two clients apart: Мир танков is 1.x (1.45 «Дело чести», released September 2026, see [update 1.45](https://tanki.su/ru/update-1-45/)), and Wargaming is 2.x.

The `izeberg` and `unicum` RU build numbers differ (8259 and 5231) because each bot numbers builds its own way. Both are release 1.45.

### What differs between the clients (checked in the cached 1.45.0.5231 data)

- **Nations.** The MT `item_defs/vehicles` has `intunion`, with 19 regular vehicles (`Un02_Merkava_LP`, `Un03_Degem_Yud`, `Un17_RDT_62`…). The WG EU branch has no such folder.
- **Lesta-only vehicles** are in both the XML and the models index:
  - `R229_Object_718B` (Объект 718Б)
  - `R230_Maus` (Трофейная «Мышь»)
  - `R239_ST_Molot` (СТ Молот)
  - `R211_Object_261_4`
  - `R174_BT-5`
  - `Ch76_HSD_1`
  - `It35_Gladiatore` (the 1.45 reward tank)
  - the whole `R16x`–`R25x` Soviet range

  `wot.models@Lesta/vehicles.json` has 1 285 tags. The model folder for `intunion` is also `intunion`.
- **tank_id** follows the MT client's compact descriptors and equals the tanki.su tankopedia ids: 7946753 `R239_ST_Molot`, 7941889 `R230_Maus`, 7943425 `R229_Object_718B`.
- **Vehicles Lesta withdrew** stay in `list.xml` as `secret` / `notInShop` entries whose `collisionModelClient` points at `vehicles/russian/R00_Placeholder/…`. So these have no geometry: `R05_KV`, `R70_T_50_2`, `A15_T57`, `A26_T18`, `A08_T23`, `A158_T832`, `GB70_FV4202_105`, `G79_Pz_IV_AusfGH` and `G98_Waffentrager_E100_WO`.
- **Two vehicles the mirror does not index.** `R95_Object_907A` reuses the collision of `R95_Object_907`. `G58_VK4502P7` points at a folder the mirror names `G58_VK4502P`. Both are reported as missing rather than guessed.
- **Shared geometry, own thickness.** Variants such as `R127_T44_100_I` load another vehicle's collision (`R127_T44_100_P`) but keep their own `<armor>`. The mirror's `armor` block then carries the other vehicle's numbers (turret `armor_1` 190 vs our 240). The importer reports this as a mismatch and keeps the XML value, which is the right one.
- **Mechanics.** The penetration constants in `@otmetki/gamedata` are the Lesta ones:
  - ±25 % RNG (Lesta support)
  - modern HE
  - the normalisation and ricochet values from §4 (Lesta wiki)

### Guards added

- **`lib/source/mt-client`.** `assertMtClient` runs in `buildGameData` (game data) and in `collectArmorModels` (models mirror). It throws `ForeignClientError` when any of these holds:
  - `.version_name` is missing
  - the version is not `1.x.y.z`
  - the README names a `WOT.*.PRODUCTION` guid
  - the README does not name the source's own guid (`MT.RU.PRODUCTION`, or `MT.PT.PRODUCTION` for PT_RU)

  There is no fallback to any Wargaming branch.
- **Exact version match.** The models mirror version must still equal the game data version (`ArmorVersionMismatchError`).
- **Encyclopedia check.** When `LESTA_APPLICATION_ID` is set, the importer compares the client's release line (`1.45`) with `encyclopedia/info.game_version` from the live Lesta API. On a mismatch it exits with code 1, unless `--allow-version-mismatch` is passed. With an empty key (dev today) it prints that the check was skipped.
- **Pinning.** `--ref`, `--models-ref` and `--locale-ref` take a commit sha. Every run resolves the branch to a sha and records it in `GameVersion` and `VehicleArmorModel.sourceSha`.
- **Missing models.** Every vehicle without a model is printed with its reason: not in `vehicles.json`, `collision.json` missing, or a parse error. `--strict-armor` makes any such vehicle exit with code 1.
- **Viewer badge.** `GET /tanks/:idOrSlug/armor` returns `source.client` (`MT.RU.PRODUCTION`). The armor page header shows the badge «Мир танков 1.45.0.5231 · MT.RU.PRODUCTION», and the attribution links the `Lesta` branch.

### Verification run (2026-09-27)

Pinned to `wot.src` 42158ff, `wot.models` 63471c1 and `wot-src` b3896b5.

The full import took 33 s: 1 028 vehicles, 5 410 modules, 1 017 armor models. 11 vehicles have no model: the 9 placeholders above, plus `R95_Object_907A` and `G58_VK4502P7`.

Primary armor from our data (front / side / rear, mm; turret = top turret) against the Lesta tankopedia and wiki:

| Vehicle | Ours: hull | Ours: turret | Lesta source |
| --- | --- | --- | --- |
| СТ Молот (`R239`, Lesta-only) | 85/70/40 | 330/100/60 | same ([tankopedia](https://tanki.su/ru/tankopedia/7946753-R239_ST_Molot/)) |
| Трофейная «Мышь» (`R230`, Lesta-only) | 200/185/160 | 220/210/210 | same ([tankopedia](https://tanki.su/ru/tankopedia/7941889-R230_Maus/)) |
| Объект 718Б (`R229`, Lesta-only) | 190/110/70 | 310/120/70 | same ([tankopedia](https://tanki.su/ru/tankopedia/7943425-R229_Object_718B/)) |
| ИС-7 | 150/150/100 | 240/185/94 | long-standing values |
| Maus | 200/185/160 | 260/210/210 | long-standing values |
| Merkava LP (`intunion`) | 155/50/30 | 330/120/30 | not checked |

The Soviet trophy Maus has a 220 mm turret front where the German Maus has 260: a Lesta-specific difference that the data carries correctly.

The per-plate join also reports 697 more mismatches. They are shared-geometry variants and tracks, and in each case the XML stays the source of truth.

### Other Мир танков sources (not used)

- **[armor.wotinspector.com/ru/mirtankov](https://armor.wotinspector.com/ru/mirtankov/7946753--/).** A closed MT armor viewer. Use it as a UX reference only.
- **[Lesta wiki](https://wiki.lesta.ru/) and the tanki.su tankopedia.** Good for human cross-checks. The tankopedia renders its numbers client-side, so a plain fetch cannot scrape them.
- **Local Lesta client** (`<install>/res/packages/*.pkg`, `scripts.pkg`, `vehicles_level_*.pkg`). This is the only fallback if the mirrors stop. Reading `collision_client/*.havok` needs a port of `wot.build/lib/havok.ts`, which has no licence (§1). A checkout produced by running `wot.build` against `lstus-ru.lesta.ru` / `MT.RU.PRODUCTION` works today through `--local <dir>` / `--local-models <dir>`, with no code changes.
- **Licences.** None of the mirrors has a licence file, and the game files are © Lesta Games. The committed test fixtures (`parsers/collision/_tests/fixtures/mt-*.json`) are kept minimal: a trimmed R230_Maus hull and chassis, plus an 8-tag excerpt of the index. Remove them if Lesta asks.

## Blockers and open questions

- `wot.models` / `wot.build` have **no licence**. Using the published output is in line with the README's "reuse welcome", but it is still the author's call. Ask before vendoring code.
- There is no written Lesta permission for client-derived assets (EULA 4.2.2 / 4.2.5). This is tolerated industry-wide. Mitigate with collision-only data, attribution and a kill switch.
- Normalisation and ricochet angles are not in the client files and are hard-coded from the wiki. They must be updated by hand if Lesta changes mechanics. Watch the patch notes.
- The penetration RNG band is ±25 % per Lesta support, but the client has a default constant of 0.15. Keep it configurable.
- The HE (modern mechanics) armor view is approximate.
- `parseArmor` must be extended for `vehicleDamageFactor` (spaced) before the join.
