# CLAUDE.md — apps/game/manager

The modpack manager: a Tauri 2 desktop app that installs the modpack, toggles its components, keeps profiles and snapshots, and moves the modpack to the new `mods\<version>` after a client patch. It replaced the Inno Setup installer and is the one way the site offers to install the modpack. Extends the root [../../../CLAUDE.md](../../../CLAUDE.md); the full reference is [README.md](README.md).

## Layout

| Path        | What                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tauri/`    | Rust crate `otmetki-manager`: `tauri.conf.json`, `capabilities/`, `icons/`, `resources/`, `windows/hooks.nsh`, `contract/` (IPC fixtures), `src/<concern>/mod.rs` + `tests.rs`                                                                                                                                                                                                                                                                                                                                                    |
| `tauri/src` | `detect` (LGC, version/paths xml), `state` (client key, manifest.ini), `catalog` (components.json), `components` (installation view, toggles), `install` (wizard install, other mods, uninstall), `patch` (plan, migrate, apply), `snapshots`, `profiles` + `durable` (profiles.json, the `%APPDATA%` mirror), `releases` (API client, sha256), `settings`, `logs`, `deep_link`, `process`, `service` (the `Manager` state and flows), `commands` (thin Tauri commands), `background` (tray, scheduler, notifications, autostart) |
| `web/`      | Vite + React UI, FSD like `apps/web/client`: `app`, `views`, `widgets`, `features`, `entities`, `shared`, `ui-kit`; alias `@/` → `web/src`, `@contract/` → `tauri/contract`                                                                                                                                                                                                                                                                                                                                                       |

## Rules

- **Rust owns the logic.** File system, detection, downloads, sha256, snapshots and the patch plan live in pure-ish Rust functions with `tempfile` tests (Cyrillic paths included); `commands/` only unwraps arguments and calls `service::Manager`. Anything testable without Tauri stays out of `commands/` and `background/`.
- **The state layout is a contract.** `clients\<key>\client.ini|manifest.ini|backups\` must stay readable by and compatible with installs made by the removed Inno installer (UTF-16 `.ini`, the same key hash, the same snapshot parts), which players may still have. The manager's own additions go in `[manager]` and `disabled\`.
- **Never touch other mods** without the reviewed list and a confirmation; never delete outside a path the code listed itself (`fsx::ensure_removable`, `install::remove_other_mods`). Refuse writes while the game runs (`process::ensure_closed`).
- **Durable settings follow the mod** (`apps/game/modpack/packages/core/durable`): write both copies atomically and stamp `saved_at.json`; read the newer one.
- **IPC contract.** A command's output is a `#[derive(Serialize)]` camelCase struct; the UI parses it with a zod schema in `entities/<x>/api/<resource>/<resource>.schemas.ts`. Changing an output means `OTMETKI_UPDATE_FIXTURES=1 bun run cargo:test` and updating the schema; the entity's `_tests` parse `@contract/<name>.json`. Error codes: `error::ErrorCode` ↔ `MANAGER_ERROR_CODES` ↔ `errors.json`.
- **UI rules are the client's** (`.claude/rules/shared/**`, `.claude/rules/client/**`): components only render, logic in `model/hooks`, every Rust call in an entity or feature `api/` through `invokeCommand`, TanStack Query for async state, constants in `config/`, every string in both `ru` and `en` catalogues (`shared/i18n/locales`). Differences: no Next (no SSR rules), `use-intl` instead of next-intl, pages are switched by `shared/lib/navigation` (no router), no React Compiler.
- **Rust style:** `cargo fmt` (`tauri/rustfmt.toml`, width 150) and `cargo clippy -D warnings` are clean; no comments in code, like the TypeScript side.

## Commands

```bash
cd apps/game/manager && bun run dev                 # the app with hot UI
bun --filter @otmetki/manager typecheck             # also part of `bun run typecheck`
bunx vitest run --project manager                   # UI tests (also part of `bun run test`)
cd apps/game/manager && bun run cargo:test          # Rust tests; OTMETKI_UPDATE_FIXTURES=1 rewrites tauri/contract
cd apps/game/manager && bun run cargo:clippy
```

CI: [.github/workflows/manager.yml](../../../.github/workflows/manager.yml) — checks on pull requests (Windows: UI typecheck + tests, cargo fmt/clippy/test), and a manual `tauri build` that uploads the unsigned NSIS installer.
