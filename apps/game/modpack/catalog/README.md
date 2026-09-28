# Component catalogue

The UI metadata of every modpack package: what the modpack manager ([apps/game/manager](../../manager/README.md)) shows in its wizard and component list, and what the МОСТ bundler ([tools/most](../tools/most/__init__.py)) writes on each mod page.

```
catalog/
  catalog.json          titles, descriptions, fair-play notes (ru/en), categories, presets, previews, ownedPatterns
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

`--strict` fails when a package has no catalog entry or an entry has no package (the release job uses it); `--skip-artwork` writes `components.json` only. The manual `modpack.yml` run uploads `dist/catalog` as the `modpack-catalog` artifact: copy it into the manager's `tauri/resources/` or publish it as a release's `catalog` (manager README «Releases»).

## components.json

One entry per package, generated: ids, versions, file names and dependencies from [tools/build/layout.py](../tools/build/layout.py) (never repeated in the catalog), UI metadata from `catalog.json`:

| Field                                | From                                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `id`, `packageId`, `version`, `file` | the package (`file` from `archive.file_name`)                                               |
| `sha256`, `size`                     | the built file, when `--packages` is given                                                  |
| `title`, `description`, `fairPlay`   | catalog, `{ru, en}`                                                                         |
| `category`, `presets`, `required`    | catalog; required components are in every preset and cannot be unticked                     |
| `default`                            | in the first preset («Рекомендуемый»)                                                       |
| `preview.image`, `preview.video`     | catalog; the image is rendered to `previews/<id>.png` (640x360), the video is an https link |
| `dependencies`                       | the package's `depends` plus catalog `dependencies`                                         |
| `catalogued`                         | false for a package without a catalog entry: it ships unticked in category «Другое»         |

The top level also has `schemaVersion`, `modpackVersion`, `platform`, `extension`, `categories`, `presets` and `ownedPatterns` (the file masks of our packages; the manager removes only files it listed itself or that match them).

Preset ids (`recommended`, `minimal`, `streamer`, `custom`) are also what `triotmetki://install?preset=<id>` links from the site pass to the manager.

**A new package** gets a catalog entry (and a preview in `previews/`). `tools/build/setupkit/manifest/tests/test_manifest.py` fails until it has one, and `tools/most/texts/tests/test_most_changelog.py` until [CHANGELOG.md](../CHANGELOG.md) has its entry.
