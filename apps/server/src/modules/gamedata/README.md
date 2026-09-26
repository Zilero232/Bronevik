# modules/gamedata

Importer of «Мир танков» (Lesta RU) client game data into the database: vehicles, modules, shells, equipment, consumables, directives, crew skills, field modifications and maps. The pure calculator it uses for profile stats is [`@bronevik/gamedata`](../../../../../packages/gamedata/README.md); the shapes the parsers return (`VehicleSpec`, `OptionalDevice`, …) are defined there too.

## Import

```bash
bun run dev:infra                                   # TimescaleDB :5434
bun run gamedata:import     # RU release → database
bun run gamedata:import -- --dry-run
bun run gamedata:import -- --source PT_RU   # public test: snapshot only
bun run gamedata:import -- --local /path/to/wot.src-checkout
```

| Option                 | What it does                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--source`             | `RU` (default, `unicum-gg/wot.src@RU`), `PT_RU` (`unicum-gg/wot.src@PT_RU`), `IZEBERG_RU` (`izeberg/wot-src@RU`, backup mirror) |
| `--ref <branch\|sha>`  | Pin another branch or an exact commit                                                                                           |
| `--local <dir>`        | Read a local checkout of the mirror instead of GitHub                                                                           |
| `--cache <dir>`        | Raw file cache, default `apps/server/.cache` (git-ignored), keyed by commit sha                                                 |
| `--nations ussr,uk`    | Only these nations                                                                                                              |
| `--limit <n>`          | At most `n` vehicles per nation                                                                                                 |
| `--dry-run`            | Fetch, parse and plan; print counts; no database                                                                                |
| `--snapshot`           | Only `GameVersion` + raw `GameDataEntry` rows. Always on for test-server sources                                                |
| `--no-current`         | Do not flag the imported version as `GameVersion.isCurrent`                                                                     |
| `--armor`              | Also build 3D armor models from `unicum-gg/wot.models@Lesta` (see below)                                                        |
| `--armor-only`         | Build armor models only; the catalog is left untouched                                                                          |
| `--models-ref <sha>`   | Pin the models mirror to another branch or commit                                                                               |
| `--local-models <dir>` | Read a local checkout of the models mirror instead of GitHub                                                                    |
| `--armor-dir <dir>`    | Local armor storage, default `<repo>/.data/armor` (only with `REPLAY_STORAGE=local`)                                            |

`DATABASE_URL` comes from the root `.env`. `GITHUB_TOKEN` is optional: the importer makes a single GitHub API call per run (to pin the branch to a commit). Everything else is downloaded from `raw.githubusercontent.com` by commit sha, so a cached run makes no network requests at all. A full RU import (about 1 000 vehicles, 1 070 files, roughly 200 MB) takes about 70 s cold and 50 s warm.

## Data source

- **Mirrors.** [`unicum-gg/wot.src`](https://github.com/unicum-gg/wot.src) has branches `RU` and `PT_RU`, rebuilt daily from the Lesta update CDN. It contains packed XML converted to text plus decompiled scripts. [`izeberg/wot-src`](https://github.com/izeberg/wot-src) (branch `RU`) has the same layout and is the backup. Minimaps come from [`unicum-gg/wot.maps`](https://github.com/unicum-gg/wot.maps) (`Lesta`, `Lesta_PT`). Each is `maps/<geometry>[_<mode>].webp`, re-encoded from `spaces/<id>/mmap*.dds`.
- **Licences.** None of these repositories has a licence file, and the assets belong to Lesta. We use them only as a source of public game data files. No code from `wot.build`/`wot.src` is copied. The parsers here are written against the XML format. The client's decompiled Python was read to learn the formulas, and none of it is vendored.
- **No localization.** The mirrors contain no `.mo` files, so names are fallbacks derived from localization keys (`#ussr_vehicles:IS` → `IS`). The keys themselves are kept (`nameKey`, `descriptionKey`) so a later Lesta API encyclopedia sync can fill in the real Russian names. The importer never overwrites `name`, `shortName`, `slug` or `description` on existing rows.

### File layout (paths relative to the repo root)

| Path                                                                                 | Content                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.version_name`                                                                      | Client version, e.g. `1.45.0.5231` → `GameVersion.version`                                                                                                                                                                                                                                                                                                                              |
| `sources/res/scripts/item_defs/vehicles/<nation>/list.xml`                           | Vehicle index: `<tag>` → id, `userString`, price (`<gold/>` marker for premium), `tags` (class, role, `collectorVehicle`, `wheeledVehicle`, `secret`, mode flags), `level`, `notInShop`, `clone_tags`                                                                                                                                                                                   |
| `…/vehicles/<nation>/<tag>.xml`                                                      | Vehicle: `crew`, `speedLimits`, `invisibility`, `optDevsOverrides`, `hull` (named armor plates `armor_N`, `primaryArmor` = front/side/rear plate names), `chassis`, `turrets0` → `guns`, `engines`, `fuelTanks`, `radios`, `postProgressionTree`, `siegeMode`. A module whose value is `shared` (text) takes its definition from the component file, and any child elements override it |
| `…/vehicles/<nation>/components/{guns,engines,radios,fuelTanks}.xml`                 | `<shared>` module definitions (id, level, price, weight, gun reload/aim/dispersion/pitch/`shots` with `piercingPower` at 100 m / 500 m, `clip`, `burst`, `autoreload`, `dualGun`)                                                                                                                                                                                                       |
| `…/vehicles/<nation>/components/{chassis,turrets}.xml`                               | Only ids. Chassis and turrets are defined inside the vehicle file                                                                                                                                                                                                                                                                                                                       |
| `…/vehicles/<nation>/components/shells.xml`                                          | Shells: `kind`, `caliber`, `damage/armor`, `explosionRadius`, `icon` (`*_premium` = premium), `price`                                                                                                                                                                                                                                                                                   |
| `…/vehicles/common/optional_devices.xml`                                             | Every optional device (standard tiers, deluxe, trophy, modernized). The `optional_devices/*.xml` files are the split originals of the same data                                                                                                                                                                                                                                         |
| `…/vehicles/common/equipments.xml`                                                   | Consumables (`type` absent), directives (`type=battleBoosters`) and mode abilities (`battleAbilities`)                                                                                                                                                                                                                                                                                  |
| `…/vehicles/common/post_progression/{trees,modifications,pairs,features,prices}.xml` | Field modification trees per role (`role_HT_break`…), steps, modifiers, pair choices, XP/credit prices per tier                                                                                                                                                                                                                                                                         |
| `sources/res/scripts/item_defs/tankmen/tankmen.xml`                                  | Crew roles and skills (`vsePerk` link, UI params with per-level values)                                                                                                                                                                                                                                                                                                                 |
| `sources/res/scripts/item_defs/perks/perks.xml`                                      | Per-level perk arguments by perk id                                                                                                                                                                                                                                                                                                                                                     |
| `sources/res/scripts/arena_defs/_list_.xml`, `<name>.xml`                            | Map ids, bounding box, camouflage, `gameplayTypes` (bases, spawns, control points, mode minimaps)                                                                                                                                                                                                                                                                                       |

Ids follow the client compact descriptor, `id << 8 | nation << 4 | itemType`, so `tankId` and `moduleId` match the Lesta API `tank_id`/`module_id`. Optional devices and equipment use nation 15 (`provision_id`). Field modifications use the reserved item type 0 (`id << 8 | 15 << 4`) so they can never collide with a real provision.

## Armor models

`--armor` fetches `vehicles.json` and `vehicles/<folder>/collision.json` from [`unicum-gg/wot.models`](https://github.com/unicum-gg/wot.models) (branch `Lesta`, pinned to a commit, cached under `--cache` like `wot.src`). It refuses a mirror whose `.version_name` differs from the imported `wot.src` version and never runs for a test-server source; the previous models stay. Only collision geometry is used — no visual models or textures.

Geometry comes from the mirror; thickness, spaced flags (`vehicleDamageFactor 0`) and the module → piece map (`hitTester/collisionModelClient`) come from our own `VehicleSpec`. The mirror's `armor`/`spaced` blocks are only a cross-check, and every disagreement is printed. Vertices are welded and packed by `encodeArmorGeometry` from `@bronevik/gamedata` (int16-quantised positions, 16/32-bit indices, plate groups, mounts). The object is stored through the replay storage abstraction (`REPLAY_STORAGE` local disk or S3) under `armor/<tankId>/<hash>.bin`, so an unchanged model is never re-uploaded, and one `VehicleArmorModel` row per tank holds the key, hash, game version, mirror commit and the per-module plate tables with shells. `GET /tanks/:idOrSlug/armor` serves it (`armorModelSchema`), switched off by `ARMOR_VIEWER.enabled` in `src/config/armor.constants.ts`.

The target is 20 KB gzipped per tank: IS-7 is about 10 KB, but modern high-poly collision meshes reach 50 KB and are reported as over budget. `bun run armor:purge -- --yes` deletes every stored object and row — the kill switch if Lesta asks.

## Layout

| Folder                       | Concern                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/xml`                    | `fast-xml-parser` wrapper and typed readers (`num`, `nums`, `price`, `mergeNodes`, `identifiedNodes`…)                                        |
| `lib/ids`                    | Nations and compact descriptors                                                                                                               |
| `lib/modifiers`              | Parsing modifier and factor blocks out of XML into the package's `Modifier` model                                                             |
| `lib/parsers/*`              | Pure parsers: `vehicle-list`, `vehicle`, `optional-devices`, `equipment`, `crew`, `post-progression`, `arenas`, `vehicle-filter`, `collision` |
| `lib/armor`                  | Armor models: `collect` (mirror + version guard), `join`, `pack`, `storage`, `writer` (upload, rows, purge)                                   |
| `lib/source`                 | GitHub raw fetcher with disk cache, local-checkout and in-memory readers                                                                      |
| `lib/game-data`              | `buildGameData({ reader })` reads and parses everything for one revision                                                                      |
| `lib/importer`               | `createImportPlan` (pure rows + summaries), `diffSpecs`, `writeImportPlan` (Prisma upserts)                                                   |
| `scripts/gamedata-import.ts` | The `gamedata:import` CLI (in `apps/server/scripts`)                                                                                          |

## Database mapping

| Table                   | Written as                                                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GameVersion`           | upsert by `version` (`title` = `"<source> <version>"`, `releasedAt` = mirror commit date); a full import marks it `isCurrent`                                                                                         |
| `GameDataEntry`         | replaced per version: `vehicle`, `shell`, `optionalDevice`, `equipment`, `crewSkill`, `crewRole`, `postProgressionTree`, `fieldModification`, `fieldModificationPair`, `arena`, plus `meta/revision` (commit, source) |
| `Vehicle`               | upsert by `tankId`. `specs` = full parsed `VehicleSpec`. Also `crew`, `modulesTree`, `nextTanks`, `prevTankIds`, prices and flags. `name`/`shortName`/`slug` (slug = tag) are set only on create                      |
| `VehicleProfile`        | `stock` (default) and `top`: module ids plus the calculator output for a 100 % crew without equipment                                                                                                                 |
| `Module`                | one row per compact id (chassis, turret, gun, engine, radio) with `tankIds` and the first definition seen as `data`                                                                                                   |
| `Provision`             | optional devices, consumables (`equipment`), directives, field modifications. `tankIds` = compatible vehicles                                                                                                         |
| `CrewRole`, `CrewSkill` | roles with their skills; skills with `data.params` (per-level values) and `data.extras`                                                                                                                               |
| `Arena`                 | `arenaId` = geometry name (`01_karelia`), `image` = wot.maps minimap URL, `data` = bounds, modes, bases, spawns                                                                                                       |
| `VehicleSpecHistory`    | per version: a compact summary (stock/top stats, guns, armor, engines, chassis) and `diff` against the latest earlier version                                                                                         |
