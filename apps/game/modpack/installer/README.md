# Three Marks installer

Windows installer for the modpack: Inno Setup 6.7 with [OpenWG.Utils](https://gitlab.com/openwg/openwg.utils) (MIT) for client detection. It is the first-release installer; the long-term plan is a Tauri manager app (see [Later: bootstrapper and manager](#later-bootstrapper-and-manager)).

```
installer/
  setup.iss                 the script: [Setup], languages, tasks, includes
  catalog/catalog.json      component UI metadata: titles, descriptions, fair-play notes, categories, presets, previews
  locales/{ru,en}.isl       the installer's own texts ([CustomMessages])
  assets/
    branding/wizard.svg     the wizard image (the small image and the icon reuse apps/web/client/app/icon.svg)
    previews/<id>.svg       16:9 component previews (a .png screenshot works too)
    state/utf16.ini         an empty UTF-16 .ini, the template for every state file
  src/                      Pascal units, one folder per concern
    common/                 CSV sets, masks; robocopy / tar / delete helpers
    components/catalog.iss  the component table and its dependency closure
    detect/clients.iss      OpenWG clients -> «Мир танков» 1.35+ clients with absolute mods/res_mods paths
    state/                  per-client state folder, client.ini, manifest.ini (our files)
    backup/snapshot.iss     snapshots and rollback
    logs/collect.iss        the bug-report zip
    profiles/profiles.iss   save/load component profiles
    pages/                  client picker, maintenance, components (preview pane), other-mods review
    events/                 Inno event functions for setup and uninstall
  tests/
    units/                  harness.iss + test_units.py: the Pascal units against fixture clients
    e2e/                    test_silent_install.py: a real silent install and uninstall (opt-in)
```

The Python side lives in [tools/build/setupkit](../tools/build/setupkit/__init__.py): `manifest/` (catalog + package layout -> `components.json`), `inno/` (the generated includes, ISCC), `artwork/` (SVG -> PNG/ICO with resvg-py and Pillow), `openwg/` (the pinned OpenWG.Utils release, checked by sha256).

## Build

```bash
cd apps/game/modpack
uv sync                                                    # resvg-py, pillow for the artwork
python tools/build/build.py --require-pyc                  # release packages -> dist/ (see ../README.md#build)
uv run python tools/build/setupkit --packages dist --compile --iscc "C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
```

Output in `dist/installer/`: `components.json`, `otmetki-setup-<version>.exe`, and `build/` with the generated `components.iss` / `files.iss`, the artwork and OpenWG.Utils. `setup.iss` defaults its defines to these folders, so after one setupkit run it also opens and compiles in the Inno Setup IDE. `--strict` fails when a package has no catalog entry (the release job uses it); `--skip-artwork` / `--skip-openwg` reuse what is already in `build/`.

Inno Setup: 6.7 (`choco install innosetup --version 6.7.1` in CI; runner images no longer ship it). It needs 6.6+ for the dark style and PNG images, and 6.7 for `PathCombine` and friends.

### components.json

One entry per package, generated: ids, versions, file names and dependencies from [tools/build/layout.py](../tools/build/layout.py) (never repeated in the catalog), UI metadata from `catalog/catalog.json`:

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

The top level also has `schemaVersion`, `modpackVersion`, `platform`, `extension`, `categories`, `presets` and `ownedPatterns` (the file masks of our packages).

**A new package** gets a catalog entry (and a preview in `assets/previews/`). `tools/build/setupkit/manifest/tests/test_manifest.py` fails until it has one.

## What the installer does

Pages: Welcome → **Game client** → **Already installed** (only with an earlier install or a backup) → **Components** → Tasks → **Other mods** (only when that task is ticked) → Ready → install.

- **Game client.** OpenWG.Utils reads Lesta Game Center (`%ProgramData%\Lesta\GameCenter\data\lgc_path.dat` → `preferences.xml`) and checks each client folder (`app_type.xml`, `version.xml`, `paths.xml`, `Tanki.exe`). The page lists every «Мир танков» 1.35+ client, main and common test, and preselects the last one used, else the one LGC prefers. «Указать папку...» adds any folder OpenWG recognises; WG clients and clients older than 1.35 (no `.mtmod`) are refused with the reason. The mods and res_mods folders come from `paths.xml`, falling back to `mods\<version>` / `res_mods\<version>`.
- **Components.** Inno's type list is the preset: «Рекомендуемый», «Минимальный (FPS)», «Стример», «Свой». The tree is `<category>\<id>`. The right pane shows the preview, the description, the fair-play note and a video link when the catalog has one. Ticking a component ticks what it needs; unticking one unticks what needs it. «Сохранить профиль» / «Загрузить профиль» write and read `.ini` files in `Documents\TriOtmetki\Profiles` in the `/SAVEINF` format, so a profile also works as `/LOADINF=<file>`. Profiles hold components only. The last choice is preselected (`UsePreviousSetupType`).
- **Before copying** (`PrepareToInstall`): refuses while the game runs from that folder; takes a **snapshot** of `mods\<version>`, `res_mods\<version>` and `mods\configs\otmetki` (task on by default, forced when removing other mods); removes **our** previous files (the last manifest plus anything matching `ownedPatterns`); removes the reviewed other mods if asked.
- **Other mods** are never touched unless the player ticks «Удалить другие моды», reviews the exact list of files and folders on the next page and confirms. A snapshot is taken first; if it fails, nothing is removed and setup stops. Silent installs never remove other mods.
- **After copying**: `manifest.ini` lists every file we installed; only the newest 3 snapshots are kept.
- **Already installed** page: install/update, **roll back** to the newest snapshot (mirrors the folders back, deletes a folder that did not exist then), or **collect logs**: a zip on the desktop with the setup log, `python.log`, `version.xml`, `paths.xml`, a listing of the mod folders, our `config.json` and our state files. Never `credentials.json`.
- **Uninstall**: per client, offers to restore the newest snapshot, removes our files (manifest + our package names only), offers to delete our config and binding, then removes our state and backups. Silent uninstall restores nothing and keeps the config.

State: `%LOCALAPPDATA%\TriOtmetki\` holds the uninstaller (`uninstall\`), OpenWG's DLL for it, licences, and `clients\<hash of the client path>\` with `client.ini`, `manifest.ini` and `backups\<yyyymmdd-hhnnss>\` (`snapshot.ini` + `mods`, `res_mods`, `configs`). State files are UTF-16 .ini so Cyrillic paths survive any ANSI code page.

Command line, on top of Inno's own (`/SILENT`, `/VERYSILENT`, `/LANG=ru|en`, `/LOADINF`, `/SAVEINF`, `/LOG`, `/ALLUSERS`):

| Parameter             | Effect                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/GAMEDIR=<folder>`   | install into this client (added through OpenWG if LGC lacks it)                                             |
| `/STATEROOT=<folder>` | keep state and backups there instead of `%LOCALAPPDATA%\TriOtmetki` (tests; pass it to the uninstaller too) |
| `/LOGSDIR=<folder>`   | where «collect logs» writes the zip instead of the desktop (tests)                                          |

## Tests

```bash
cd apps/game/modpack
uv run pytest tools/build/setupkit                         # manifest, includes, OpenWG fetch, artwork (Python)
ISCC="C:\Program Files (x86)\Inno Setup 6\ISCC.exe" uv run pytest installer
OTMETKI_INSTALLER_E2E=1 ISCC=... uv run pytest installer/tests/e2e
```

- `tests/units` compiles `harness.iss` (the real units plus a synthetic component table) and runs it against fixture clients: Lesta release, common test, a Cyrillic path, a `paths.xml` without mods, WG, 1.30, an empty folder. It checks the version rule, the dependency closure, the manifest and clean-up of our files only, the other-mods list, snapshot/restore/prune and the logs zip. Skipped without ISCC or the OpenWG.Utils download.
- `tests/e2e` builds the real installer, installs silently into a fixture client with a foreign mod next to ours, checks the files, the manifest and the snapshot, uninstalls and checks that only the foreign mod is left. Opt-in: a real install registers an uninstaller for the current user, which the test's uninstall removes. The release job runs it.
- `bun run test:modpack` and `uv run pytest` pick all of this up; the ISCC-based tests skip where Inno Setup is absent.

## Unsigned builds

The installer is **not code-signed**: DigiCert and Sectigo do not issue certificates to Russian entities, Azure Artifact Signing is unavailable in Russia, and SignPath's free tier is for fully open-source projects. Windows SmartScreen will show «Windows защитила ваш компьютер» for a new file («Подробнее» → «Выполнить в любом случае»), and some antivirus products flag unknown installers. What we do about it:

- publish the sha256 of each release next to the download link (the CI artifact includes `components.json` with every package hash);
- no UPX or other packers, no self-extracting tricks beyond Inno's own;
- submit false positives to Kaspersky, Dr.Web and Microsoft;
- SmartScreen reputation accrues per file hash, so a small stable bootstrapper (below) is the long-term fix.

## Later: bootstrapper and manager

Not built yet, recorded so the pieces above fit it:

- **Bootstrapper**: a tiny, rarely changing signed-or-not `.exe` whose hash earns SmartScreen reputation. It downloads the current catalog (`components.json`) and payload from our CDN, verifies sha256 (Inno 6.5+ can also verify ISSig signatures with `DownloadTemporaryFileWithISSigVerify`), then runs the installer or, later, the manager.
- **Tauri 2 manager** (planned): the same `components.json` drives a catalog with search, video and sound previews, up to 12 profiles synced with the site account, per-client installs, updates by catalog diff, and moving the packages into the new `mods\<version>` after a client patch. It reuses the state layout above (`manifest.ini`, snapshots) so installs made by this installer stay manageable.

## Manual test checklist

Before a release, on a real Windows 10 and 11 PC with «Мир танков»:

1. Run the installer from Explorer: SmartScreen warning as described above; the wizard is dark, the images are sharp at 100 % and 150 % DPI, the language matches Windows (ru/en).
2. Game client page: the LGC client is listed and preselected; with a common test client installed both are listed; «Указать папку...» on a WG client, on an old client and on an empty folder shows the right message; a client moved outside LGC can be added.
3. Components: each preset ticks the expected set; clicking and arrow keys update the preview pane; the video link opens the browser; unticking «Отметка в бою» unticks nothing else, ticking a component with dependencies ticks them; required rows cannot be unticked.
4. Save a profile, change the selection, load the profile back; install once with `/LOADINF=<profile>`.
5. With the game running, Next on Ready refuses to install; after closing the game it proceeds.
6. Install: packages land in `mods\<version>` from `paths.xml`; the game loads them (`python.log` shows `[OTMETKI] started`).
7. Run the installer again: the «already installed» page appears; update with a different selection removes the unticked packages; «Собрать логи» puts a zip on the desktop without `credentials.json`.
8. Rollback: the mods folder returns to the snapshot state, including other packs' files.
9. «Удалить другие моды»: the review page lists exactly the foreign files; cancelling the confirmation keeps them; confirming removes only them, and rollback brings them back.
10. Uninstall from «Приложения»: answering the restore and config questions both ways leaves the expected files; other mods are untouched when not restoring.
11. Game path with Cyrillic characters and a path under `Program Files` (the latter needs `/ALLUSERS`, run as administrator).

## Not verified yet

- Behaviour on a client that LGC installs into a non-default folder or on a second drive (OpenWG handles it; not tried on a live machine other than the default `D:\Games\Tanki` it found).
- The dark style on Windows 10 with high-contrast themes (Inno falls back to the native style).
- Whether Lesta clients read the `<dependencies>` block of `meta.xml`; the installer resolves dependencies itself.
