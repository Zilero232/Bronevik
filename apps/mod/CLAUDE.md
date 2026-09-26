# CLAUDE.md — apps/mod

Guidance for the game-client mod. Extends the root [../../CLAUDE.md](../../CLAUDE.md); those rules still apply. The full reference — hooks, payloads, build, install — is [README.md](README.md).

A **Python 2.7** `.wotmod` package the «Мир танков» client loads from `mods/<client version>/`. It is not a Bun workspace: no `package.json`, not part of `bun run verify`.

## Two kinds of code

| Path                  | What                                                                | Tested                  |
| --------------------- | ------------------------------------------------------------------- | ----------------------- |
| `src/otmetki/*.py`    | Pure logic, **Python 2/3 compatible**, no client imports            | `tests/`, on Python 3   |
| `src/otmetki/client/` | Glue that imports `BigWorld` / `gui` — hooks, dossier, UI, settings | only in the game client |
| `src/mod_otmetki.py`  | Entry point the client auto-loads (`gui/mods/mod_*.pyc`)            | —                       |
| `contract/`           | JSON Schemas the API implements (ingest, bind, MoE thresholds)      | —                       |

Keep as much as possible in the pure half — it is the only half the deploy checks can run.

## Rules

- **Python 2.7 syntax in `src/`.** No f-strings, annotations, `async`, walrus or `match`; Python-3-only modules (`urllib.request`, `pathlib`, `typing`, …) only inside a `try/except ImportError` fallback. `tests/test_py27_compat.py` enforces both.
- **Fair play is a hard constraint.** Read only the player's own data; never read or show enemy positions, reload timers, aim or spotting data. Never serialise the `vehicles`, `players` or `avatars` blocks of battle results — `test_payload.BattleEventTest.test_never_leaks_other_players` enforces it.
- **Nothing is sent before the player binds the mod**, and every feature can be switched off in settings.
- **The contract is the API's contract.** A payload change updates `contract/*.json` and the server's ingest schema together.

## Commands

```bash
bun run test:mod                                 # python -m unittest discover apps/mod/tests
python apps/mod/build.py                         # dev build -> dist/otmetki.<version>.wotmod
python apps/mod/build.py --require-pyc           # release build; needs Python 2.7
```

The deploy workflow runs the unittest suite on Python 3 ([.github/workflows/deploy.yml](../../.github/workflows/deploy.yml)).
