# CLAUDE.md — apps/modpack

Guidance for the game-client modpack. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The full reference — layout, hooks, payloads, build, install — is [README.md](README.md).

**Python 2.7** packages the «Мир танков» client loads from `mods/<client version>/` as `.mtmod` (Lesta 1.35+; `.wotmod` for WG). It is a bun workspace (`@otmetki/modpack`: `test`, `lint`, `build` scripts) and a uv workspace (`pyproject.toml` + one per package) for the Python 3 host tooling. It is not part of `bun run verify`.

## Packages

| Path                  | In the client                     | What                                                                                                                     |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `packages/core/`      | `gui/mods/otmetki/core/`          | Runtime for everything: event bus, hooks, lazy feature registry, schema settings, i18n, log, storage, signing, transport |
| `packages/companion/` | `gui/mods/otmetki/companion/`     | The mod the site binds to (`otmetki.companion`): binding, outbox, battle results, MoE data, settings share; the app host |
| `features/<id>/`      | `gui/mods/otmetki/features/<id>/` | One package per feature: `marks_panel`, `session_stats`, `replay_upload`                                                 |
| `*/entry/mod_*.py`    | `gui/mods/mod_*.py`               | Entry scripts the client auto-loads                                                                                      |
| `contract/`           | —                                 | JSON Schemas the API implements (ingest, bind, MoE, settings, replay upload)                                             |
| `tools/`              | —                                 | `build/` (package builder), `testing/_support.py`, cross-package `tests/`, `run_tests.py`                                |

## Two kinds of code

| Where                                                 | What                                                     | Tested                 |
| ----------------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| Any `*.py` outside `client/` and `entry/`; `model.py` | Pure logic, **Python 2/3 compatible**, no client imports | its package's `tests/` |
| `client/` folders, a feature's `client.py`, `entry/`  | Glue that imports `BigWorld` / `gui`                     | the import smoke only  |

Keep as much as possible in the pure half — it is the only half the checks can run.

## Rules

- **Python 2.7 syntax in the game sources.** No f-strings, annotations, `async`, walrus or `match`. Python-3-only modules (`urllib.request`, `pathlib`, `typing`, …) only inside a `try/except ImportError` fallback. `tools/tests/test_py27_compat.py` enforces both.
- **No load order.** The client imports `mod_*.pyc` in hash order. Never assume the core, the app or another feature is initialised first: features register through `core.registry` (`register()` in their entry script), and the app binds when it starts.
- **A feature is a folder:** `features/<id>/` with `__init__.py` (`FEATURE_ID`, `PACKAGE_ID`, `VERSION`, `create(app)`, `register()`), `entry/mod_otmetki_<id>.py`, `model.py` (pure), `client.py` (glue on `app.bus`), `settings.py`, `i18n.py`, `tests/`. `tools/tests/test_layout.py` checks the shape.
- **Settings stay in the companion schema** (`packages/companion/config.py`) so `config.json` keeps a switch while its feature is not installed; a feature's `settings.py` lists the keys it reads.
- **The settings window is behind `SettingsView`** (`companion/client/settings_ui.py`). ModsList master needs WG 2.4.1+; do not make the app depend on ModsSettingsAPI.
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
```

The deploy workflow runs `test:modpack` on Python 3 ([.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)). [.github/workflows/modpack.yml](../../.github/workflows/modpack.yml) runs pytest, the stdlib runner, ruff and vermin on Windows for pull requests, and a manual release build with `owg_python_compiler`.
