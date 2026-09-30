# Component catalogue

The UI metadata of every modpack package: what the modpack manager ([apps/game/manager](../../manager/README.md)) shows in its wizard and component list, and what the МОСТ bundler ([tools/most](../tools/most/__init__.py)) writes on each mod page.

```
catalog/
  catalog.json          titles, descriptions, fair-play notes (ru/en), categories, presets, previews, ownedPatterns,
                        and the third-party runtime mods (kind "dependency") the manager installs
  previews/<id>.svg     16:9 component previews (a .png screenshot works too)
  screenshots/<id>/     real client screenshots for МОСТ, at most 3 per component (optional)
```

[tools/build/setupkit](../tools/build/setupkit/__init__.py) turns it into the files the manager reads: `manifest/` merges the catalog with the package layout into `components.json`, `artwork/` renders the previews with resvg-py and Pillow.

## Build

```bash
cd apps/game/modpack
uv sync                                                  # resvg-py, pillow for the previews
python tools/build/build.py --require-pyc                # release packages -> dist/ (see ../README.md#build)
uv run python tools/build/setupkit --packages dist       # -> dist/catalog/components.json + dist/catalog/previews/*.png
```

`--strict` fails when a package has no catalog entry or an entry has no package (the release job uses it; a `kind: "dependency"` entry has no package by design and is not counted), or when a dependency's `requiredBy` names a component the build does not ship; `--skip-artwork` writes `components.json` only. The manual `modpack.yml` run uploads `dist/modpack` and `dist/catalog` as the `modpack` artifact; a release publishes the catalogue as its `catalog`, which the manager downloads (manager README «Releases»).

## components.json

One entry per package, generated: ids, versions, file names and dependencies from [tools/build/layout.py](../tools/build/layout.py) (never repeated in the catalog), UI metadata from `catalog.json`:

| Field                                               | From                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`, `packageId`, `version`, `file`                | the package (`file` from `archive.file_name`)                                                                                                                                                                                                                                                |
| `sha256`, `size`                                    | the built file, when `--packages` is given                                                                                                                                                                                                                                                   |
| `title`, `description`, `fairPlay`                  | catalog, `{ru, en}`                                                                                                                                                                                                                                                                          |
| `category`, `presets`, `required`                   | catalog; required components are in every preset and cannot be unticked                                                                                                                                                                                                                      |
| `default`                                           | in the first preset («Рекомендуемый»)                                                                                                                                                                                                                                                        |
| `preview.image`, `preview.video`                    | catalog; the image is rendered to `previews/<id>.png` (640x360), the video is an https link                                                                                                                                                                                                  |
| `preview.audio`                                     | catalog, a sound the component ships (path under `assets/`, `.mp3`/`.ogg`/`.wav`); copied to `previews/<id>.<ext>` for the manager's player                                                                                                                                                  |
| `perf`                                              | catalog, required: the FPS cost `low`, `medium` or `high` (a judgement from the code: event-driven labels are low, per-frame reads and 3D markers medium); the manager shows it and filters «Только лёгкие»                                                                                  |
| `context`                                           | catalog, required: where the component shows anything, `hangar`, `battle` or `any`; the in-game window shows it as «Ангар» / «Бой» badges and filters by it (`packages/ui` keeps the same value in `components/constants.py` `PLACEMENT`, `packages/ui/tests/test_placement.py` checks both) |
| `dependencies`                                      | the package's `depends` plus catalog `dependencies`                                                                                                                                                                                                                                          |
| `catalogued`                                        | false for a package without a catalog entry: it ships unticked in category «Другое»                                                                                                                                                                                                          |
| `kind`                                              | `"dependency"` for a third-party runtime dependency; absent for our packages                                                                                                                                                                                                                 |
| `author {name, url}`, `licence {name, url, sha256}` | dependency only: the upstream author and licence; `licence.url` is the pinned licence text the manager saves in `notices\<id>\LICENSE`                                                                                                                                                       |
| `sourceUrl`, `sha256`, `size`                       | dependency only: the upstream release file, pinned; the manager downloads nothing else and refuses a different hash                                                                                                                                                                          |
| `requiredBy`                                        | dependency only: our component ids that need it; the wizard ticks it when one is selected, and switching one on in «Компоненты» installs it                                                                                                                                                  |
| `restartRequired`                                   | dependency only: the client restarts once after the first start with it (OpenWG Gameface's `res_map` registration)                                                                                                                                                                           |

Entries with `kind: "dependency"` are not our packages: `packageId` and `file` must not match `ownedPatterns`, and `file` is `<packageId>_<version>.mtmod`. The manager installs them only when the player has no copy, and removes only what it installed ([manager README «Runtime dependencies»](../../manager/README.md#runtime-dependencies-taurisrcdependencies)). setupkit checks them (id, lowercase 64-hex `sha256` and `licence.sha256`, https links, a positive `size`, no catalogue fields such as `category`, `requiredBy` naming only our components) and copies them after our packages in `components`, as `catalog.json` pins them; `requiredBy` drops the ids a build does not ship. They are written into `catalog.json` in that same form.

`requiredBy` follows the code: OpenWG Gameface is needed by the packages that import `openwg_gameface` (the in-game window, `ui`) and by every component that draws a HUD or hangar label; GUIFlash, the fallback renderer, by the label components only. A label component is one whose code uses `BattlePanel`, `hud_layer(` or `app.ui.show(` (core hosts the renderer chain and is not counted). `tools/build/setupkit/manifest/tests/test_dependencies.py` derives both sets from the sources and fails when the catalog disagrees. The МОСТ bundler lists them on each page that needs them as third-party mods installed separately (`description.<lang>.md`, `externalDependencies` in `submission.json`).

The top level also has `schemaVersion`, `modpackVersion`, `platform`, `extension`, `categories`, `presets` and `ownedPatterns` (the file masks of our packages; the manager removes only files it listed itself or that match them), plus two fields for the manager's conflict check ([manager README «Conflicts»](../../manager/README.md#conflicts-taurisrcconflicts)):

- `ownedPaths`: the in-game path prefixes only our packages write, without `res/` (`scripts/client/gui/mods/otmetki/`, `scripts/client/gui/mods/mod_otmetki`, `gui/gameface/mods/triotmetki/`, …). A third-party package or a `res_mods` file under one of them overwrites our files.
- `conflicts`: third-party mods that duplicate our components, `{id, title {ru, en}, patterns, components, note {ru, en}}`. `patterns` are lowercase masks matched against a package's file name and its `meta.xml` id (XVM, PMOD, Battle Observer, marks calculators, lamps, damage logs, session stats, replay managers); `components` are our ids it duplicates. The manager reports a match only while one of those components is on, and never touches the file. setupkit checks the ids and that a mask has fixed text and does not name our own packages, and keeps in `components` only the ids a build ships.

Preset ids (`recommended`, `minimal`, `streamer`, `custom`) are also what `triotmetki://install?preset=<id>` links from the site pass to the manager.

**A new package** gets a catalog entry (and a preview in `previews/`). `tools/build/setupkit/manifest/tests/test_manifest.py` fails until it has one, and `tools/most/texts/tests/test_most_changelog.py` until [CHANGELOG.md](../CHANGELOG.md) has its entry.
