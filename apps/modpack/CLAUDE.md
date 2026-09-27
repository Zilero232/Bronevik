# CLAUDE.md — apps/modpack

Guidance for the game-client modpack. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The full reference — layout, hooks, payloads, build, install — is [README.md](README.md).

**Python 2.7** packages the «Мир танков» client loads from `mods/<client version>/` as `.mtmod` (Lesta 1.35+; `.wotmod` for WG). It is a bun workspace (`@otmetki/modpack`: `test`, `lint`, `build` scripts) and a uv workspace (`pyproject.toml` + one per package) for the Python 3 host tooling. Its Python half is not part of `bun run verify`; `ui-web` (the in-game window's TypeScript) is: typecheck, ESLint, Prettier.

## Packages

| Path                  | In the client                      | What                                                                                                                                                                                                                |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core/`      | `gui/mods/otmetki/core/`           | Runtime for everything: event bus, hooks, lazy feature registry, schema settings, i18n, log, storage, signing, transport                                                                                            |
| `packages/companion/` | `gui/mods/otmetki/companion/`      | The mod the site binds to (`otmetki.companion`): binding, outbox, battle results, MoE data, settings share; the app host                                                                                            |
| `packages/ui/`        | `gui/mods/otmetki/ui/`             | In-game UI (`net.triotmetki.ui`): Gameface settings window, hangar entry points, profiles, HUD edit protocol                                                                                                        |
| `features/<id>/`      | `gui/mods/otmetki/features/<id>/`  | One package per feature: `marks_panel`, `session_stats`, `replay_upload`, battle HUD (`damage_log`, `hit_log`, …), hangar and client settings (`replay_manager`, `hangar_tweaks`, `minimap`, `camera`, `crosshair`) |
| `ui-web/`             | `gui/gameface/mods/triotmetki/ui/` | The window's page: preact + nanostores + zod/mini, built by esbuild (`bun run ui:build`) into `packages/ui/gameface/`                                                                                               |
| `*/entry/mod_*.py`    | `gui/mods/mod_*.py`                | Entry scripts the client auto-loads                                                                                                                                                                                 |
| `contract/`           | —                                  | JSON Schemas the API implements (ingest, bind, MoE, settings, replay upload)                                                                                                                                        |
| `tools/`              | —                                  | `build/` (package builder, `setupkit/` for the installer), `testing/_support.py`, cross-package `tests/`, `run_tests.py`                                                                                            |
| `installer/`          | —                                  | Windows installer (Inno Setup 6.7 + OpenWG.Utils) and its component catalog — [README](installer/README.md)                                                                                                         |

## Two kinds of code

| Where                                                 | What                                                     | Tested                 |
| ----------------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| Any `*.py` outside `client/` and `entry/`; `model.py` | Pure logic, **Python 2/3 compatible**, no client imports | its package's `tests/` |
| `client/` folders, a feature's `client.py`, `entry/`  | Glue that imports `BigWorld` / `gui`                     | the import smoke only  |

Keep as much as possible in the pure half — it is the only half the checks can run.

## Rules

- **Python 2.7 syntax in the game sources.** No f-strings, annotations, `async`, walrus or `match`. Python-3-only modules (`urllib.request`, `pathlib`, `typing`, …) only inside a `try/except ImportError` fallback. `tools/tests/test_py27_compat.py` enforces both.
- **No load order.** The client imports `mod_*.pyc` in hash order. Never assume the core, the app or another feature is initialised first: features register through `core.registry` (`register()` in their entry script), and the app binds when it starts.
- **A feature is a folder:** `features/<id>/` with `__init__.py` (`FEATURE_ID`, `PACKAGE_ID`, `VERSION`, `create(app)`, `register()`), `entry/mod_otmetki_<id>.py`, `model` (pure), `client` (glue on `app.bus`), `settings`, `i18n` (a module, or a package folder per concern as in the battle HUD features), `tests/`. `tools/tests/test_layout.py` checks the shape.
- **Every package has an installer catalog entry** in `installer/catalog/catalog.json` (titles ru/en, category, presets, fair-play note, preview in `installer/assets/previews/`). `tools/build/setupkit/manifest/tests/test_manifest.py` fails without it.
- **Settings stay in the companion schema** (`packages/companion/config.py`) so `config.json` keeps a switch while its feature is not installed; a feature's `settings` lists the keys it reads. A battle HUD component's look and position live in its own schema-checked section of `components.json` (`core/hud`), its on/off switch in `config.json`.
- **The settings window is behind `SettingsView`** (`companion/client/settings_ui.py`). ModsList master needs WG 2.4.1+; do not make the app depend on ModsSettingsAPI. The Gameface window (`packages/ui`) is added next to it with `add_settings_view`; it renders every card from the feature's own schema, so a new feature needs no UI code: `settings.SETTINGS` (its config.json switch), `settings.SCHEMA` (its components.json section), optional `GROUP`, labels `component_<id>`, `<id>_<key>`, `<id>_<key>_<value>` in its i18n; buttons and list pages through `ui_actions()` / `ui_page()` / `ui_action()` on the feature instance (README «In-game UI»).
- **Client settings only through the game's own options.** Components that change the player's client settings (`minimap`, `camera`, `crosshair`, `hangar_tweaks`) go through `core/client/native` with `native` meaning "leave the game's value", and write only on the player's change in the hangar. Anything beyond the game's own options (camera distance, free look, Flash patches) stays out until Lesta confirms it.
- **Fair play is a hard constraint.** Read only the player's own data; never read or show enemy positions, reload timers, aim or spotting data. Never serialise the `vehicles`, `players` or `avatars` blocks of battle results — `test_payload.BattleEventTest.test_never_leaks_other_players` enforces it.
- **Nothing is sent before the player binds the mod**, and every feature can be switched off in settings.
- **The contract is the API's contract.** A payload change updates `contract/*.json` and the server's ingest schema together; the server's tests read `contract/examples/ingest.example.json`.
- **Release packages ship `.pyc`.** The production client loads only `mod_*.pyc`.

## Commands

```bash
bun run test:modpack                                         # stdlib runner over every tests/ folder
cd apps/modpack && uv sync && uv run pytest                  # the same tests under pytest
cd apps/modpack && uv run ruff check .                       # lint (E, F, W; pyupgrade off)
python apps/modpack/tools/build/build.py                     # dev build -> dist/*.mtmod, one per package
python apps/modpack/tools/build/build.py --single --require-pyc   # release, single package; needs a compiler
python apps/modpack/tools/build/build.py --dry-run           # list packages and in-game paths, write nothing
cd apps/modpack && bun run ui:build                          # rebuild packages/ui/gameface from ui-web (commit the result)
cd apps/modpack && bun run ui:test                           # ui-web tests (also in the repo's `bun run test`)
cd apps/modpack && uv run python tools/build/setupkit --packages dist --compile   # installer -> dist/installer (needs ISCC)
```

The deploy workflow runs `test:modpack` on Python 3 ([.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)). [.github/workflows/modpack.yml](../../.github/workflows/modpack.yml) runs pytest, the stdlib runner, ruff and vermin on Windows for pull requests, and a manual release build with `owg_python_compiler` followed by the Windows installer job (Inno Setup from choco, installer tests, `otmetki-setup-<version>.exe`).
