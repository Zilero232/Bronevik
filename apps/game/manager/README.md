# Three Marks modpack manager

A Windows desktop app that installs and looks after the «Мир танков» modpack of [apps/game/modpack](../modpack/README.md). It replaces the Inno Setup installer (`apps/game/modpack/installer`): same client detection, the same component catalogue (`components.json`), presets, profiles, snapshots and state layout, plus what an installer cannot do — switching components on and off without reinstalling, and moving the modpack into the new `mods\<version>` folder by itself after a game patch.

Tauri 2: the Rust core in [`tauri/`](tauri), the React UI in [`web/`](web). Bun workspace `@otmetki/manager`.

```
apps/game/manager/
  package.json            scripts (below); the UI dependencies
  tauri/                  the Rust app (crate otmetki-manager)
    Cargo.toml tauri.conf.json build.rs rustfmt.toml
    capabilities/         what the window may call (core, folder picker, links, updater, restart)
    icons/                generated from apps/web/client/app/icon.svg (`bun run tauri icon`)
    resources/            shipped next to the exe: components.json (and optionally previews/, packages/)
    windows/hooks.nsh     NSIS hook: the uninstaller offers to remove the modpack from the clients
    contract/             JSON the Rust tests write, the UI tests parse (the IPC contract)
    src/                  one module per concern, tests in <module>/tests.rs
  web/                    Vite + React UI
    index.html vite.config.ts vitest.config.ts vitest.setup.ts tsconfig.json global.d.ts
    src/                  FSD: app, views, widgets, features, entities, shared, ui-kit
```

## Commands

```bash
cd apps/game/manager
bun run dev               # tauri dev: Vite on :1420 + the Rust app (debug)
bun run build             # tauri build: web/dist + release exe + NSIS installer (needs the updater key, see Releases)
bun run build:ui          # the UI bundle only (web/dist)
bun run typecheck         # tsc -p web
bun run cargo:check       # cargo check --all-targets
bun run cargo:clippy      # clippy, warnings are errors
bun run cargo:test        # the Rust tests (tempdir fixtures, Cyrillic paths)
bunx vitest run --project manager                    # the UI tests (from the repo root; also part of `bun run test`)
OTMETKI_UPDATE_FIXTURES=1 bun run cargo:test         # rewrite tauri/contract/*.json after changing a command's output
```

Local builds need Rust stable (MSVC) and WebView2 (Windows 10/11 ship it). `tauri build` without `TAURI_SIGNING_PRIVATE_KEY` fails on the updater artifacts; for a local installer pass `--config '{"bundle":{"createUpdaterArtifacts":false}}'`.

## What it does

| Screen      | What                                                                                                                                                                                                                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Главная     | The update status (up to date / update available / moved / updated / waiting for a release / offline / failed) with its action, the selected client (version, branch, mods folder) and the install summary. Not installed: «Установить модпак».                                                  |
| Установка   | The first-run wizard, and «Изменить набор» later: client → components (presets «Рекомендуемый / Минимальный (FPS) / Стример / Свой», category tree with dependencies, preview pane with description, fair-play note and video; an installer `.ini` profile can be loaded) → other mods → review. |
| Компоненты  | The catalogue by category with search, previews and fair-play notes; a switch per component moves its `.mtmod` in or out of `mods\<version>` instantly. Switching on a component that was never installed downloads it from the current release (same version only).                             |
| Профили     | The in-game settings profiles (`profiles.json`, shared with the Gameface window): save the current settings, apply, rename, delete, copy the `TM1.` code, import a code.                                                                                                                         |
| Бэкапы      | Snapshots of `mods\<version>`, `res_mods\<version>` and `mods\configs\otmetki`, rollback, delete; removing the modpack from the client (optionally rolling back to the latest snapshot and deleting the mod settings).                                                                           |
| Настройки   | Autostart with Windows (on by default), notifications, automatic update after a patch, check interval (15 min … 12 h), language, the game client (detected or a folder picked by hand).                                                                                                          |
| О программе | Version and self-update, the logs zip (to the desktop), where the data lives, the unsigned-build note.                                                                                                                                                                                           |

Closing the window hides it to the tray (menu: open, check for updates, quit). Autostart launches the app with `--background`: tray only, no window.

### Client detection (`tauri/src/detect`)

`%ProgramData%\Lesta\GameCenter\data\lgc_path.dat` → the Lesta Game Center folder → `preferences.xml` (every `working_dir`, the selected one under `selectedGames`) → each client folder: `version.xml` (`v.1.45.0.0 #…` and the realm), `paths.xml` (`Packages/Root` = the mods folder, the `res_mods` path, the package mask), `game_info.xml` (`.RPT.` = common test), `Tanki.exe`. Only Lesta clients 1.35+ are usable; WG and older clients are listed with the reason. A folder picked by hand is remembered in the settings.

### State (`tauri/src/state`, `snapshots`, `install`) — the installer's layout

`%LOCALAPPDATA%\TriOtmetki\clients\<key>\` with `key` = the first 16 hex characters of SHA-256 over the UTF-16LE of the ASCII-lowercased client path (exactly the installer's `OtmClientKey`), so installs made by the Inno installer are picked up as they are:

| File                         | What                                                                                                                                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `client.ini`                 | `[client] path, version, mods, res_mods` (UTF-16LE with BOM, like every state `.ini`)                                                                                                                                         |
| `manifest.ini`               | `[install] client, version, mods, installer, modpack, date, components` (Inno names `category\id`), `[files] count, 0..n` (absolute paths of our packages in the mods folder); the manager adds `[manager] version, disabled` |
| `disabled\`                  | switched-off packages, moved out of `mods\<version>` (moved back when switched on)                                                                                                                                            |
| `backups\<yyyymmdd-hhnnss>\` | `snapshot.ini` (`mods`, `res_mods`, `configs` + `<part>_exists`) and a mirror of each part; the newest 3 are kept                                                                                                             |

Our files are the manifest's files plus anything matching `ownedPatterns` of the catalogue (`net.triotmetki.*.mtmod`, `otmetki.*.mtmod`, …). Other mods are never touched unless the player ticks them on the wizard's «Другие моды» step and confirms; a snapshot is then always taken first, and only paths from the listed set can be removed. Install, rollback, toggles and profile writes refuse while the game runs from that folder.

Uninstalling the app (Windows «Приложения») runs `otmetki-manager.exe --uninstall-mods` from the NSIS hook when the player agrees: in every recorded client it removes our files (manifest + masks) and the state folder, keeps other mods and the mod settings. Silent uninstalls (updates) keep the modpack.

### Profiles and durable settings (`tauri/src/profiles`, `durable`)

`mods\configs\otmetki\profiles.json` is the in-game UI's file (`{version: 1, active, profiles: [{id, name, created, updated, data: {config, components}}]}`, at most 12, names up to 40 characters, `server_url` / `bind_code` / `settings_action` never stored). Applying a profile merges `data.config` into `config.json` and each section of `data.components` into `components.json`. Codes are `TM1.` + base64url(zlib(JSON)), compatible with the mod.

Every write follows the mod's durable-settings contract ([modpack README «Durable settings»](../modpack/README.md#durable-settings-appdatatriotmetki)): the whole file is written atomically to `mods\configs\otmetki\<name>` and to `%APPDATA%\TriOtmetki\<name>`, with the same unix time in each folder's `saved_at.json`. Reads take the newer copy and restore a missing or older game-folder copy.

### Components catalogue

`components.json` from `tools/build/setupkit` (schema in the [installer README](../modpack/installer/README.md#componentsjson)). The manager reads the newer of `%LOCALAPPDATA%\TriOtmetki\manager\components.json` (downloaded with a release, checked by sha256) and `resources\components.json` shipped with the app (CI copies the real one there; the committed file is an empty placeholder). Previews are read from `previews\` next to whichever catalogue won.

### Patches and updates (`tauri/src/patch`, `service/check.rs`, `background`)

On start, every minute cheaply (has `version.xml` moved past the manifest's version?) and fully every check interval, the manager asks the API for the release that supports the client:

`GET https://api.triotmetki.ru/modpack/releases/latest?game=<client version>` (override with `OTMETKI_API_URL`)

```json
{
  "game": "1.46.0.0",
  "status": "compatible",
  "release": {
    "version": "0.2.0",
    "publishedAt": "2026-09-27T12:00:00.000Z",
    "games": ["1.46.*"],
    "notes": { "ru": "…", "en": "…" },
    "catalog": { "url": "https://…/components.json", "sha256": "…" },
    "packages": [{ "id": "core", "file": "net.triotmetki.core_0.2.0.mtmod", "url": "https://…", "sha256": "…", "size": 389723 }]
  }
}
```

`status: "waiting"` with `release: null` when no release lists the version. The plan (`patch::plan`, tested):

| Client patched? | Server says                       | Action                                                                                                                                |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| yes             | compatible, same modpack version  | **migrate**: copy our packages from the old `mods\<version>` into the new one, rewrite the manifest (configs are version-independent) |
| yes             | compatible, newer modpack version | **install**: snapshot, download every enabled and parked package, verify sha256, replace older versions                               |
| yes             | waiting                           | notify «Ждём обновления модпака под X», check again on schedule                                                                       |
| yes             | unreachable                       | offline, check again                                                                                                                  |
| no              | compatible, newer                 | «Доступна версия» + «Обновить модпак» (game must be closed)                                                                           |

With «Обновлять модпак после патча автоматически» off, a patch only reports «waiting» and the Home screen offers «Перенести в новую папку». Downloads are https only; a package whose sha256 differs is refused before any file in the client changes. Notifications (Windows toasts) announce migrated / updated / waiting / available / failed, once per change.

The server side is `apps/web/server/src/modules/modpack-releases`: it reads the release index from `MODPACK_RELEASES_URL` (cached 5 minutes, the last good copy survives a failed refresh) or the committed `assets/releases.json` (empty until the first release), validated by `modpackReleaseIndexSchema` from `@otmetki/schemas`:

```json
{
  "schemaVersion": 1,
  "releases": [{ "version": "0.2.0", "publishedAt": "…", "games": ["1.46.*"], "notes": null, "catalog": null, "packages": ["…"] }],
  "manager": {
    "version": "0.2.0",
    "publishedAt": "…",
    "notes": "…",
    "platforms": { "windows-x86_64": { "url": "https://…/TriOtmetki Manager_0.2.0_x64-setup.exe", "signature": "<contents of the .sig>" } }
  }
}
```

`games` patterns: `1.46.*` (any build of 1.46), `1.46.0.0`, or `1.46` (= 1.46.0.0). The newest matching release wins (semver).

### Self-update

`tauri-plugin-updater` asks `GET https://api.triotmetki.ru/modpack/manager/update?target=windows&arch=x86_64&current=<version>` (the same module): 204 when current, otherwise Tauri's dynamic-update JSON `{version, notes, pub_date, url, signature}` from the index's `manager` block. «О программе» checks and installs it (NSIS, passive), then restarts. The update archive is verified against the minisign public key in `tauri.conf.json` (`plugins.updater.pubkey`); the private key is `%USERPROFILE%\.tauri\otmetki-manager.key` on the owner's machine and must be stored as the `TAURI_SIGNING_PRIVATE_KEY` repository secret (empty password).

**Unsigned code.** The exe and the installer are not Authenticode-signed (DigiCert/Sectigo do not issue to Russian entities; see the [installer README «Unsigned builds»](../modpack/installer/README.md#unsigned-builds)). SmartScreen shows «Windows защитила ваш компьютер» on the first run of each new file. The minisign signature protects the update channel only; it does not make SmartScreen happy. Mitigations: publish sha256 next to the download, no packers, report false positives to Kaspersky / Dr.Web / Microsoft.

### Deep links

The NSIS installer registers the `triotmetki://` scheme (`tauri-plugin-deep-link`); a second launch hands its link to the running instance. The site can link to:

| Link                               | Effect                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `triotmetki://open`                | shows the window (Home)                                                                                                        |
| `triotmetki://profile/TM1.<code>`  | opens «Профили» with the code filled into «Импорт по коду»; the player confirms the import                                     |
| `triotmetki://install?preset=<id>` | opens the install wizard with that preset (`recommended`, `minimal`, `streamer`, …; unknown ids fall back to the first preset) |

Anything else is ignored. Links are parsed in Rust (`tauri/src/deep_link`, tested), queued for a window that is not ready yet, and routed by the UI (`app/model/hooks/use-app-sync`).

### Logs

«Собрать логи» writes `otmetki-logs-<yyyymmdd-hhmmss>.zip` to the desktop: the manager's logs (`%LOCALAPPDATA%\TriOtmetki\manager\logs`), its settings, and per client `python.log`, `version.xml`, `paths.xml`, a listing of the mods, res_mods and parked folders, `config.json`, `components.json`, `profiles.json`, `manifest.ini`, `client.ini`. Never `credentials.json`.

## UI and IPC

- React 19, TanStack Query for every Rust call, react-hook-form + zod for forms, `use-intl` (next-intl's core) with ru/en catalogues in `web/src/shared/i18n/locales`, Base UI primitives, SCSS modules on `@otmetki/design-tokens` (dark graphite, orange accent, gold for updates), `@otmetki/icons` + lucide, sonner toasts.
- Every command goes through `shared/api/tauri/invokeCommand({ command, schema, args })`: the response is parsed with the entity's zod schema, a rejection becomes a `ManagerError` with the Rust `ErrorCode` (translated in `errors.json`). Events (`patch-report`, `deep-link`) go through `listenEvent`.
- The Rust side is the source of truth for shapes: `cargo test` writes nothing but compares `tauri/contract/*.json` with the serialised command outputs, and each entity's `api/**/_tests` parses the same file with its schema, so a drift fails one side or the other.

## Releases (manual for now)

1. Build the modpack release (`modpack.yml`, manual run) and take `components.json` from the installer job; copy it (and `build/previews`) into `tauri/resources/` for the manager build, or publish it and reference it as the release `catalog`.
2. Upload the `.mtmod` packages to the CDN, add the release to the index (`MODPACK_RELEASES_URL` or `assets/releases.json`) with sha256 and sizes.
3. Run `manager.yml` manually: the `modpack-manager` artifact holds the NSIS installer and its `.sig`. Upload the installer, put its URL and the `.sig` contents into the index's `manager` block.

## Not verified yet

- A real Lesta install end to end: detection against a live `preferences.xml`, the move after a real patch, toggles while LGC updates the client, the NSIS uninstall hook, toasts and autostart on Windows 10.
- WebView2 rendering of the UI on 100 % / 150 % DPI; the deep-link registration after an NSIS install.
- The API endpoints on production (the module has unit and HTTP-level tests; the index is empty until the first release).
