# Three Marks modpack

Game-client modpack for «Мир танков» (Lesta, RU realm): Python 2.7 scripts the client loads from `mods/<client version>/`. It ships as `.mtmod` packages (Lesta 1.35+; `.wotmod` for WG clients): the core runtime, the companion, and one package per feature. The pre-split single package is still available as a build option.

It does four things, plus one opt-in:

- after each battle, it sends the player's own battle results to Three Marks in signed batches;
- it records marks-of-excellence (MoE) percentages for the player's own vehicles;
- in battle, it shows a MoE panel with the projected percentage and the damage needed for the next mark;
- in the hangar, it shows a session panel with battles, win rate, average damage and WN8;
- opt-in, off by default: it uploads the replays the game itself recorded of the player's own battles (see [Replay auto-upload](#replay-auto-upload)).

## Fair play

The mod follows the Lesta Fair Play Policy (see [market research](../../docs/research/market.md#техника-модов)) and the `Fair play` rule in [CLAUDE.md](../../CLAUDE.md).

- **It reads only the player's own data:**
  - the `personal` block of the player's own battle results;
  - the player's own vehicle dossier;
  - the player's own damage and assist feedback events, which also drive the vanilla damage log and ribbons;
  - the player's own queue events;
  - the loadout of the player's own selected vehicle in the hangar (equipment, consumables, directives, loaded shells, field modifications, crew skills), read when the player joins the queue;
  - an account command about the player's own vehicle.
- **It never reads or shows enemy information.** It has no positions, reload timers, aim or gun-marker data, spotting beyond vanilla, or minimap markers.
- **It has no aim assist.** It does not touch the crosshair, the camera or vehicle parameters.
- **It never serialises other players' data from battle results.** The `vehicles`, `players` and `avatars` blocks are never read into the payload. The test `test_payload.BattleEventTest.test_never_leaks_other_players` enforces this.
- The only other-vehicle value it reads is the team of a vehicle the player damaged. It uses that to ignore team damage in the MoE panel. The client already shows this value.
- **Nothing is collected or sent until the player binds the mod.** Binding uses a one-time code from the site. Each feature can be switched off.
- **Replay auto-upload is opt-in** (`upload_replays`, off by default). It never turns replay recording on and never touches the battle: in the hangar it uploads the `.wotreplay` file the client already wrote, only when the replay header's `playerID` is the bound account. The file is the player's own recording, exactly as the site's manual upload accepts it. Uploads stay private unless `publish_replays` (also off by default) is on; the server re-checks the recorder and refuses anyone else's replay.

## Layout

```
apps/modpack/
  package.json              bun workspace @otmetki/modpack: test / lint / build scripts
  pyproject.toml            uv workspace root: dev tools (pytest, ruff, jsonschema, vermin), pytest and ruff config
  uv.lock
  contract/                 JSON Schemas the API implements (ingest, bind, MoE thresholds, settings, replay upload) + example
  packages/
    core/                   -> gui/mods/otmetki/core            pure runtime shared by everything
      events.py               event bus (ordered handlers; a failing handler never stops the rest)
      hooks.py                subscribe/unsubscribe for client Events, override()/restore() for methods
      registry.py             lazy feature registry: attach in any load order (see "Load order")
      settings.py             schema-driven settings: defaults, typed merge, limits, choices, normalizers
      i18n.py                 string catalog, language resolution, translator
      log.py                  [OTMETKI] log lines and the safe() decorator
      compat.py jsonutil.py storage.py signing.py transport.py panels.py
      client/                 client glue: GUIFlash/system-message UI, BigWorld.fetchURL transport
    companion/              -> gui/mods/otmetki/companion       the mod the site binds to (id otmetki.companion)
      entry/mod_otmetki.py    entry point the client auto-loads (gui/mods/mod_otmetki.pyc)
      binding.py config.py i18n.py loadout.py outbox.py payload.py queue_timer.py sender.py
      settings_share.py settings_template.py shots.py version.py
      client/                 glue: app.py (thin host), battles.py, marks.py, binding.py, dossier.py, loadout.py,
                              shots.py, settings_core.py (settings share), settings_ui.py (settings window), game.py
  features/                 -> gui/mods/otmetki/features/<id>   one package each, attached through the registry
    <id>/
      __init__.py             FEATURE_ID, PACKAGE_ID, VERSION, create(app), register()
      entry/mod_otmetki_<id>.py   entry script: register() with the core registry
      model.py                pure logic (py2/3, unit-tested)
      client.py               client glue, subscribes to the app's event bus
      settings.py             the config keys the feature reads (defaults stay in the companion schema)
      i18n.py                 the feature's strings
      tests/
    marks_panel/            in-battle MoE panel: thresholds, EMA projection, damage needed
    session_stats/          hangar session panel and the session id on battle results
    replay_upload/          opt-in replay auto-upload (model.py queue/uploader, files.py header/lookup/multipart)
  tools/
    build/                  build.py (CLI), layout.py (what goes where), archive.py (zip + meta.xml), compilers.py
    testing/_support.py     maps the repo onto the otmetki package; fixtures, schema validators
    tests/                  cross-package tests: py2.7 compat scan, layout, client import smoke
    run_tests.py            runs every suite with the standard library only (also on Python 2.7)
```

Every package keeps its tests in its own `tests/` folder. The build leaves `tests/` out and moves `entry/` scripts to `gui/mods/`.

### Load order

The client imports every `gui/mods/mod_*.pyc` in hash order, so packages have no load order.

- The core has no entry script. It starts on first use.
- The companion's `mod_otmetki` creates the app. At the end of `start()` the app binds itself to the core registry: `core.registry.registry().bind(app)`.
- Each feature's `mod_otmetki_<id>` calls `register()`. A feature registered before the app starts is attached when the app binds; one registered later is attached at once. Both calls are idempotent.

`packages/core/tests/test_core_runtime.py` runs every order. `tools/tests/test_client_smoke.py` imports the real entry scripts in shuffled orders against stubbed client modules, then plays a login and a battle through the hooks.

### The app and its events

`companion/client/app.py` is a thin host. It hooks the client events and hands them to the companion's capture modules (`battles.py`, `marks.py`, `binding.py`) and to the features through `app.bus`.

- **Host interface for features:** `config`, `translate` (features add their strings with `translate.catalog.add(STRINGS)`), `ui`, `transport`, `account_id`, `in_battle`, `marks.hangar_moe`, `is_bound()`, `current_credentials()`, `auth_failed`, `on_auth_failed()`, `user_agent()`, `config_dir`, and the state file: `state`, `register_state(key, dump)`, `save_state()`.
- **Bus events:** `account`, `rebind`, `hangar`, `vehicle_moe`, `battle_enter`, `battle_start`, `battle_ready`, `battle_leave`, `battle_results`, `battle_event`, `battle_recorded`, `ingest_response`, `tick`. Their arguments are in the docstring of `app.py`.
- **Settings window:** `companion/client/settings_ui.py`. `SettingsView` is the interface (`register()`, `refresh()`), `ModsSettingsApiView` the current view, `NoSettingsView` the fallback. ModsList master, which ModsSettingsAPI needs, requires WG 2.4.1+, so a Gameface view (openwg_gameface) can be added to `VIEWS` without touching the app.

## Client hooks

| What                    | Hook                                                                                                                                                                                                                                                                                                                                                      | Learnt from                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Own battle results      | `PlayerEvents.g_playerEvents.onBattleResultsReceived(isPlayerVehicle, results)`. Fallback: poll `BigWorld.player().battleResultsCache.get(arenaUniqueID, cb)` for arenas played in this run.                                                                                                                                                              | wotstat-analytics `onBattleResultLogger.py` (same two-path approach), RU client source |
| Result fields           | `results['personal'][<intCD>]`: `damageDealt`, `damageAssistedRadio`/`Track`/`Stun`, `damageBlockedByArmor`, `spotted`, `kills`, `shots`, `directEnemyHits`, `piercingEnemyHits`, `xp`, `credits`, `lifeTime`, `deathReason`, and post-battle `marksOnGun`/`damageRating`/`movingAvgDamage` (VEHICLE_SELF). `results['common']` holds arena and duration. | `battle_results/battle_results_common.py` in the RU client source mirror               |
| Hangar MoE              | `g_currentVehicle.getDossier().getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'damageRating' / 'movingAvgDamage' / 'marksOnGun')`, refreshed on `g_currentVehicle.onChanged`                                                                                                                                                                                     | spoter `mod_marksOnGunExtended` (WTFPL), `dossiers2/custom/records.py`                 |
| MoE distribution        | `BigWorld.player()._doCmdInt(AccountCommands.CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION, intCD, cb)` returns `ext.battleCount` and `ext.damageBetterThanNPercent`, at most once per vehicle per 24 h                                                                                                                                                             | wotstat-analytics `moeLogger.py`                                                       |
| In-battle damage/assist | `guiSessionProvider.shared.feedback.onPlayerFeedbackReceived`, using `BATTLE_EVENT_TYPE.DAMAGE/RADIO_ASSIST/TRACK_ASSIST/STUN_ASSIST` and `extra.getDamage()`. It only counts while the controlled vehicle is the player's own.                                                                                                                           | spoter `mod_marksOnGunExtended`, `feedback_adaptor.py`                                 |
| MoE formula             | EMA with k = 2/(100+1) over `damage + max(radio, track, stun)`                                                                                                                                                                                                                                                                                            | spoter `mod_marksOnGunExtended`                                                        |
| Queue time              | `g_playerEvents.onEnqueued(queueType)`, `onDequeued(queueType)`, `onArenaCreated()`                                                                                                                                                                                                                                                                       | `Account.py` / `PlayerEvents.py`, RU client                                            |
| Battle start/end        | `g_playerEvents.onAvatarReady`, `onAvatarBecomeNonPlayer`. Replays are skipped with `BattleReplay.isPlaying()`.                                                                                                                                                                                                                                           | `Avatar.py`, RU client                                                                 |
| Account                 | `BigWorld.player().databaseID` on `onAccountShowGUI`                                                                                                                                                                                                                                                                                                      | `Account.py`, `connection_mgr.py`                                                      |
| HTTP                    | `BigWorld.fetchURL(url, cb, headers=, timeout=, method=, postData=)`, which is asynchronous on the main thread. Fallback: `transport.ThreadTransport`, a urllib2 daemon thread whose results the main-thread tick drains, so no BigWorld call ever runs off the main thread.                                                                              | wotstat-analytics `asyncResponse.py`                                                   |
| Settings                | `gui.modsSettingsApi.g_modsSettingsApi`: `getModSettings`, `setModTemplate`, `registerCallback`, a `TextInput` with a button for the binding code                                                                                                                                                                                                         | izeberg/modssettingsapi example + `templates.py`                                       |
| Panels                  | `gui.mods.gambiter.g_guiFlash.createComponent/updateComponent/deleteComponent(alias, COMPONENT_TYPE.LABEL, props)`                                                                                                                                                                                                                                        | GambitER/GUIFlash (MIT)                                                                |

Client source reference: [IzeBerg/wot-src](https://github.com/IzeBerg/wot-src), branch `RU` (Lesta client 1.45.0.8259 at the time of writing).

### References and licences

- [wotstat/wotstat-analytics](https://github.com/wotstat/wotstat-analytics) has **no licence**. We studied its patterns (hooks, batching, `fetchURL`, build script) and copied no code.
- [spoter/spoter-mods](https://github.com/spoter/spoter-mods) is **WTFPL**. We re-implemented the MoE EMA formula and the feedback-event accumulation as small pure functions.
- [izeberg/modssettingsapi](https://github.com/IzeBerg/modssettingsapi) is **CC BY-NC-SA 4.0**. It is an optional runtime dependency: we call its API and do not bundle it. Its `build.py` showed the `.wotmod` layout: stored zip, explicit directory entries, `meta.xml`.
- [wot-public-mods/mods-list](https://gitlab.com/wot-public-mods/mods-list) (poliroid, **MIT**) is a transitive dependency of ModsSettingsAPI. It needs OpenWG Gameface.
- [GambitER/GUIFlash](https://github.com/GambitER/GUIFlash) is **MIT**. It is an optional runtime dependency for on-screen panels.

We chose to write our own code rather than vendor any of these. A mod that has to pass МОСТ review should have a small, auditable surface with no third-party network code. wotstat's code is unlicensed anyway, and the MoE logic is about 30 lines.

## Data flow

1. **Binding.** On the site, a signed-in user gets a 10-character code: alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, one-time, short TTL. In the hangar, the user enters it in the ModsSettingsAPI window and presses «Привязать». Without ModsSettingsAPI, the user sets `"bind_code"` in `mods/configs/otmetki/config.json` and logs in.
   - The mod sends `POST /mod/bind` `{code, account_id, mod_version, client_version, realm}`.
   - The server answers `{device_id, secret, account_id}`.
   - The credentials are stored per account in `mods/configs/otmetki/credentials.json`.
2. **Capture.** Events go into a per-account persistent outbox (`outbox_<account_id>.json`, at most 2000 events):
   - hangar MoE snapshots, sent only when the values change;
   - MoE distribution, once per vehicle per day;
   - queue times;
   - own battle results. These are deduplicated by `arenaUniqueID`, and the last 200 are kept in `state.json`.
3. **Send.** In the hangar only, every `flush_interval_seconds` (15 s by default) and right after a battle result, the mod sends one batch of up to 50 events with `POST /mod/ingest`. Headers:
   - `X-Otmetki-Device: <device_id>`
   - `X-Otmetki-Timestamp: <unix seconds>` and `X-Otmetki-Nonce: <random hex, new per request>`
   - `X-Otmetki-Signature: sha256=<hex HMAC-SHA256(secret, "v2\nPOST\n<path>\n<timestamp>\n<nonce>\n" + raw body)>`. The server refuses a timestamp more than 5 minutes off (428, retried) and a nonce it has already seen, so a captured request cannot be replayed or pointed at another path.
   - **Clock skew.** Every error reply on `/mod/*` carries `X-Otmetki-Server-Time: <unix seconds>` (plus the standard `Date`). On a 428 the mod stores `server time − local time` as its clock offset, re-signs the same body with a fresh nonce and retries once right away; every later request (ingest, settings poll, apply result) is signed with the corrected clock. A second 428, or a 428 without a usable time, goes to the normal backoff. The offset lives in memory and is recomputed after a restart.

   Only one batch is in flight at a time. Events leave the outbox only after a 2xx or 409 response, so a crash or restart never loses them. Retries use exponential backoff (5 s up to 10 min, ±20% jitter) and honour `Retry-After`. Other responses:

   | Response        | Mod behaviour                                   |
   | --------------- | ----------------------------------------------- |
   | 401 / 403       | Pauses the outbox and asks the player to rebind |
   | 400 / 404 / 422 | Drops the batch                                 |
   | 413             | Halves the batch size                           |

4. **Session.** The session aggregates locally. It counts random battles only (`bonus_type == 1`) and starts a new session after `session_idle_minutes` (60 by default) without activity. The ingest response may carry `session: {session_id, wn8}`, and the hangar panel then shows the server-computed WN8.
5. **MoE panel.** When a vehicle is selected in the hangar, the mod fetches `GET /v1/moe/{tank_id}` and caches it for 6 h. In battle, the panel shows:
   - `current %` from the dossier;
   - `projected %`: the EMA after this battle, mapped through the threshold curve;
   - `до N%: ещё X`: the extra combined damage needed this battle to reach the next mark level (65/85/95).

## Payload contract (summary)

The API team implements the full contract in [contract/](contract):

- [contract/ingest.schema.json](contract/ingest.schema.json)
- [contract/bind.schema.json](contract/bind.schema.json)
- [contract/moe-thresholds.schema.json](contract/moe-thresholds.schema.json)
- [contract/settings.schema.json](contract/settings.schema.json)
- [contract/replay-upload.schema.json](contract/replay-upload.schema.json)
- the example [contract/examples/ingest.example.json](contract/examples/ingest.example.json)

The test suite validates the example and the builder output against the schema when `jsonschema` is installed.

- **Envelope:** `schema_version=1`, `batch_id`, `device_id`, `account_id`, `realm="RU"`, `mod_version`, `client_version`, `sent_at`, `events[1..50]`.
- **`battle_result` fields:**
  - identity:
    - `event_id="battle:<arenaUniqueID>"`, which makes the event idempotent;
    - `arena_unique_id`, a string because 64-bit values do not fit in a JS number;
    - `arena_type_id`, `map_name`, `bonus_type`, `gui_type`;
  - outcome: `duration_s`, `result` (win / loss / draw), `team`, `winner_team`;
  - `vehicle{tank_id, name, tier}`, where `tank_id` is the same as the Lesta API `tank_id`;
  - `stats{…}`: damage, radio/track/stun assist, blocked, spotted, frags, shots, direct and penetrating enemy hits, xp, credits, life time, alive, premium;
  - `moe{marks_on_gun, damage_rating (%×100), moving_avg_damage}` after the battle. This is the raw data point for our own RU thresholds;
  - `queue_time_s`, `session_id`;
  - `loadout` (optional, null when unknown): the own vehicle's `optional_devices`, `consumables`, `directives` (intCD per slot, null for empty), `shells[{shell_id, count}]`, `field_modifications[]`, `crew[{role, skills[] in learning order}]`, `gameplay_id` (`arena_type_id >> 16`). It feeds the site's recommended builds.
  - `platoon` (optional, null when solo): `{size, mates[]}` — the own platoon after the battle, mates are the account ids with the own `prebattleID` on the own team. Feeds the site's platoon chemistry.
  - `shots` (optional, null when off or none): own shots that damaged an enemy, from the player feedback events — `damage`, `nominal` (armour damage of the own shell), `shell`, `outcome`, `distance_m` (null: the mod reads no enemy positions), `fatal`. Feeds «Честный рандом».
- **`moe_snapshot`:** `tank_id`, `damage_rating`, `moving_avg_damage`, `marks_on_gun`, `battles`.
- **`moe_distribution`:** `tank_id`, `battle_count`, `damage_better_than_n_percent[]` (the raw client answer).
- **`queue`:** `queue_type`, `wait_s`, `outcome` (arena / dequeued), `tank_id`.
- **`battle_start`:** `tank_id` of the own vehicle when the arena is created, flushed at once. Opens the streamer's Twitch auto-prediction; the matching `battle_result` resolves it.
- **Server obligations:**
  - verify the HMAC over the raw bytes it received, never over a re-serialisation;
  - check that the device belongs to `account_id`;
  - deduplicate by `event_id`;
  - on bind, reject an `account_id` that differs from the Lesta ID linked to the site user.

## Streamer settings (hangar only)

Spec: [streamer-settings §3.5](../../docs/superpowers/specs/2026-09-26-streamer-settings.md). Switch: `share_settings` (on by default; does nothing until the mod is bound). Client glue: `packages/companion/client/settings_core.py`.

- **Whitelist.** The glue reads standard client settings through the settings core (`dependency.instance(ISettingsCore)`) into flat keys (`fov`, `sniperSens`, `zoomSteps`, …, see `settings_share.FIELDS`). `build_export` keeps only those keys with valid values and nests them into the contract groups `display` … `battleUi`. Login/account keys, hardware and mods are never sent.
- **Export.** Set `"settings_action": "export"` in `config.json` and open the hangar. The mod posts `POST /mod/settings` `{device_id, account_id, mod_version, target, anonymous_stats, settings}`. `settings_target` is `private` (default) or `profile`; `settings_anonymous_stats` is off by default.
- **Apply.** Every 2 minutes in the hangar the mod polls `POST /mod/settings/apply/poll`. For a request it shows a yes/no dialog with the diff. Resolution, refresh rate, window mode and sensitivity are left out unless `settings_include_resolution` / `settings_include_sensitivity` are on. On confirm it writes the player's current values of the touched keys to `settings_backup_<account_id>.json`, applies the diff and posts `…/apply/<id>/result` `{status: applied}`; on cancel `rejected`. Without a dialog API the request stays pending; nothing is applied automatically. A second apply keeps the first backup.
- **Restore («Вернуть мои»).** `"settings_action": "restore"` writes the backup back and deletes it.
- It never installs or configures third-party mods. All three requests are signed like `/mod/ingest`.

## Replay auto-upload

Switches: `upload_replays` (off by default; does nothing until the mod is bound) and `publish_replays` (off by default: uploads are private). Feature `features/replay_upload`: pure logic in `files.py` (header, lookup, multipart) and `model.py` (queue, uploader); client glue in `client.py`. Contract: [contract/replay-upload.schema.json](contract/replay-upload.schema.json).

1. **Respecting the game setting.** The mod never enables recording. If the client's replay setting (`replayEnabled` in the settings core) reads as off, nothing is queued; if it cannot be read, the mod just looks for a file and gives up when none appears.
2. **Queue.** When the player's own battle results arrive (the same hook as `battle_result`, never during replay playback), the battle is queued in `replays_<account_id>.json`: `arenaUniqueID`, account, local start time (from `onAvatarReady`, else `arenaCreateTime` corrected by the clock offset). The queue deduplicates by `arenaUniqueID` against pending items and the last 500 finished ones, holds at most 50 battles and forgets a battle after 7 days. It survives a client restart.
3. **Finding the file.** From 30 s after the battle, in the hangar only, the mod scans the client replay folder (`BattleReplay`'s replay dir, else `replays/`) for `.wotreplay`/`.mtreplay` files, skipping `temp.wotreplay` and anything older than the battle. It reads only the JSON header blocks: the file matches when `playerID` is the bound account and the results block names the same `arenaUniqueID`; a replay without a results block (left before the end) matches by its `dateTime` within 5 minutes of the battle start. A file modified in the last 5 s is still being written and is retried in 15 s. With the "last battle only" setting the file is overwritten by the next battle, and the header check then refuses it. No match within 30 minutes drops the battle.
4. **Upload.** One upload at a time, on a background thread (`BackgroundRunner` + blocking `SyncTransport`, 120 s timeout); the main thread only starts jobs and applies results. The file is refused above **50 MiB** (`max_bytes` in the contract, same as the server) before it is read. It is posted as `multipart/form-data` (one part named `file`) to `POST /replays/mod`, with the `/mod/ingest` headers, `X-Otmetki-Visibility` and `signing.signed_request`; the HMAC covers the raw file bytes (`"v2\nPOST\n/replays/mod\n<timestamp>\n<nonce>\nx-otmetki-visibility:<visibility>\n" + file`), because that is what the server verifies. A 428 re-syncs the clock from `X-Otmetki-Server-Time` or `Date` and re-signs once. The server has no chunked or resumable upload, so the file goes in one request.
5. **Visibility.** Uploads are private (only the owner sees them on the site) unless `publish_replays` is on (off by default), which sends `X-Otmetki-Visibility: public`. The value is taken when the upload starts. The header is a signed header: its `name:value` line sits between the nonce and the body in the signed message, so it cannot be added, stripped or changed on the way. The server stores a request without the header as private and refuses `unlisted` or any other value (400).
6. **Ownership.** The server parses the replay header before storing it and answers 422 `replay_not_owned` when its recorder (`playerID`) is not the device's bound account. Every error reply on `/replays/mod` carries `X-Otmetki-Server-Time`, as on `/mod/*`.

| Response                                                               | Mod behaviour                                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| 2xx / 409 (same file already uploaded)                                 | Done, remembered                                               |
| 401, 403 other than the plan limit                                     | Pauses replay uploads and asks the player to rebind            |
| 403 `SUBSCRIPTION_REQUIRED`                                            | Stored-replays limit: retried in 6 h                           |
| 400 / 404 / 413 / 422 (`replay_not_owned` included), or file too large | Dropped, remembered                                            |
| network error, 428 twice, 429, 5xx                                     | Exponential backoff 30 s up to 1 h, ±20% jitter, `Retry-After` |

## Build

```bash
python apps/modpack/tools/build/build.py                          # dev: one .mtmod per package; .py without a compiler
python apps/modpack/tools/build/build.py --require-pyc            # release: fails without a bytecode compiler
python apps/modpack/tools/build/build.py --single --require-pyc   # release in the single-package format
python apps/modpack/tools/build/build.py --wg                     # .wotmod for WG clients
python apps/modpack/tools/build/build.py --install-dir "D:\Games\Tanki\mods\1.45.0.8259"
```

`bun --filter @otmetki/modpack build` runs the first line. The output goes to `apps/modpack/dist/`:

| Package        | File                            | meta.xml id                        | Depends on      |
| -------------- | ------------------------------- | ---------------------------------- | --------------- |
| core           | `net.triotmetki.core_<v>.mtmod` | `net.triotmetki.core`              | —               |
| companion      | `otmetki.companion_<v>.mtmod`   | `otmetki.companion` (kept forever) | core            |
| feature `<id>` | `net.triotmetki.<id>_<v>.mtmod` | `net.triotmetki.<id>`              | core, companion |
| `--single`     | `otmetki.<v>.mtmod`             | `otmetki.companion`                | —               |

Versions come from `packages/core/version.py`, `packages/companion/version.py` and each `features/<id>/__init__.py`.

Each package is a stored (uncompressed) zip with explicit directory entries, `meta.xml` and `res/scripts/client/gui/mods/...`. The split packages never ship the same file, and `--single` is their union. The `<dependencies>` block in `meta.xml` is for installers and people. Whether the client reads it is **unverified**, and the code never relies on it (see [Load order](#load-order)).

**Release builds must ship `.pyc`.** The production client loads only `mod_*.pyc`; it reads `.py` only in development mode. A source-only package does not load in a live client. Pick the compiler with `--compiler auto|owg|py27` (see `tools/build/compilers.py`):

- **`owg`**, tried first: OpenWG [owg_python_compiler](https://gitlab.com/openwg/owg-python-compiler).
  - A C++ tool that writes CPython 2.7 bytecode without Python 2.7, reproducibly (fixed header timestamp, stable `co_filename`).
  - It has no binary releases: build the tag with CMake, as the `release-build` job in [.github/workflows/modpack.yml](../../.github/workflows/modpack.yml) does. Pass `--owg-compiler PATH` or set `$OWG_PYTHON_COMPILER`.
  - **Unverified:** that `--filename-root scripts` gives `co_filename` `scripts/client/gui/mods/...`. Check a traceback in `python.log` after the first owg-built release.
- **`py27`**: a Python 2.7 interpreter running `py_compile`, with `dfile` set to the in-package path. Looked up as `--python27`, `$OTMETKI_PY27`, `$PYTHON27`, `py -2.7`, `python2.7`, `python2`, `C:\Python27\python.exe`.

Without either, the packages carry `.py` sources and the build prints a warning. They load in development clients only.

## Tests

```bash
bun run test:modpack                     # from the repo root: python apps/modpack/tools/run_tests.py
cd apps/modpack && uv sync && uv run pytest && uv run ruff check .
```

- `tools/run_tests.py` needs only the standard library and runs every `tests/` folder (`packages/*`, `features/*`, `tools/**`). It also runs on Python 2.7, where the build tool's own tests are left out.
- pytest runs the same unittest-style tests, with its config in `pyproject.toml`.
- The pre-commit hook runs `test:modpack` when a staged Python file is under `apps/modpack`.
- [.github/workflows/modpack.yml](../../.github/workflows/modpack.yml) runs pytest, the stdlib runner, ruff and vermin on Windows for pull requests.

The tests are pure logic and need no game client:

- payload building, including the "no other players' data" check;
- HMAC signing (RFC 4231 vector, shared with the server's test);
- session aggregation and the session panel;
- MoE maths, projection and the MoE panel;
- outbox batching and backoff;
- the sender with a fake transport;
- binding;
- config, settings template and i18n;
- the core runtime: event bus, hooks and overrides, the registry in every load order, schema settings, the i18n catalog, storage;
- the thread and sync transports against a local HTTP server;
- replay auto-upload: header matching, lookup, multipart and signed headers, size limit, queue dedupe/persistence/backoff, the background runner, the settings switch and the contract/server limits;
- the package layout and the build: paths, meta.xml, dependencies, single vs split;
- a client import smoke: the entry scripts in shuffled orders against stubbed client modules, then a login and a battle through the hooks.

`tools/tests/test_py27_compat.py` guards Python 2.7 compatibility of the game sources (not the tests):

- it scans for syntax Python 2.7 lacks: f-strings, annotations, keyword-only args, `nonlocal`, `print` without `__future__`, unguarded py3-only imports;
- it checks that pure modules never import client modules;
- on Python 2.7 it compiles every source instead of the scan.

Lint and extra checks:

- ruff with `target-version = "py37"` (its oldest) and only the `E`, `F`, `W` rules. pyupgrade and bugbear stay off: they suggest Python-3-only code.
- `vermin --no-tips --violations -t=2.7- -t=3.0- --exclude-regex "tests|tools" packages features` reports minimum versions 2.6 and 3.0. The deliberate py2/py3 import fallbacks are marked `# novermin`.
- `pip install jsonschema` (or `uv sync`) enables the schema tests.

## Install (players)

1. Copy the packages into `<game>/mods/<client version>/`: `net.triotmetki.core_<v>.mtmod`, `otmetki.companion_<v>.mtmod` and the features you want, or the single `otmetki.<v>.mtmod`. Do not mix the single package with the split ones.
2. Optional: install ModsSettingsAPI (izeberg) with ModsList (poliroid) and OpenWG Gameface to get the settings window and binding UI. ModsList master needs WG 2.4.1+; on Lesta use a release that supports the client. Without them, edit `mods/configs/otmetki/config.json`.
3. Optional: install GUIFlash (gambiter) for the on-screen panels. Without it, the session summary comes as a system notification after each battle, and the in-battle panel is off.
4. Bind: on the site, open Profile → Mod, copy the code, then paste it into the mod settings and press «Привязать».

`mods/configs/otmetki/config.json` (created on first start):

| Key                                                                                                                     | Default                     | Meaning                                                                          |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| `enabled`                                                                                                               | `true`                      | Master switch                                                                    |
| `server_url`                                                                                                            | `https://api.triotmetki.ru` | API base. Must be https, or http://localhost / http://127.0.0.1 for development. |
| `send_battle_results`, `send_moe_snapshots`, `send_moe_distribution`, `send_queue_times`, `send_loadouts`, `send_shots` | `true`                      | Per-feature data switches                                                        |
| `battle_moe_panel`, `hangar_session_panel`                                                                              | `true`                      | UI switches                                                                      |
| `session_idle_minutes`                                                                                                  | `60`                        | New session after this idle gap (10–1440)                                        |
| `flush_interval_seconds`                                                                                                | `15`                        | Send interval (5–600)                                                            |
| `upload_replays`                                                                                                        | `false`                     | Upload the game's own replays of your battles (opt-in)                           |
| `publish_replays`                                                                                                       | `false`                     | Make auto-uploaded replays public; off keeps them private (owner only)           |
| `bind_code`                                                                                                             | `""`                        | Fallback binding without ModsSettingsAPI; cleared after use                      |
| `language`                                                                                                              | `auto`                      | `ru`, `en` or `auto` (client language)                                           |

The device secret is stored in plain text in `credentials.json`, as other mods store tokens. It is scoped to one device and one account, and the user can revoke it on the site.

## Publishing via МОСТ

МОСТ is Lesta's official mod portal. Moderators check every mod against the Fair Play Policy.

1. Build a release with `--require-pyc` on the exact client version and test it in the live client (see the checklist below).
2. On МОСТ, create the mod page in Russian and English. Include:
   - what the mod does;
   - the list of data it sends and where. Link to the site's privacy page and the contract;
   - the fair-play statement above;
   - the optional dependencies (ModsSettingsAPI, ModsList, GUIFlash);
   - screenshots of both panels.
3. Upload `otmetki.<version>.mtmod` (`--single`) or the split packages. The companion's `meta.xml` id stays `otmetki.companion` forever, so updates replace older versions. Bump `VERSION` on every release.
4. Tell the moderators that the mod makes HTTPS requests to our API, and that the only other-vehicle value it reads is the team of a vehicle the player damaged (to exclude team damage).
5. After each client patch:
   - rebuild;
   - smoke-test that the hooks still fire (see the checklist);
   - resubmit.

   The site's download page should link to the МОСТ page, not to a self-hosted binary, where possible.

Check МОСТ's current submission rules before the first upload. This README describes the process as we understand it, not an official document.

## Verified and not verified

**Verified on the development machine (Python 3.12, 2026-09-27):**

- 212 tests pass under pytest and the stdlib runner, including schema validation with `jsonschema`. The stdlib runner also passes on Python 2.7.18 (a portable build);
- the thread transport works against a real local HTTP server;
- `vermin` confirms the sources are 2.7-compatible;
- `tools/build/build.py` with a Python 2.7 interpreter produces valid stored zips with `.pyc`, for every package and for `--single`;
- not run here: the owg_python_compiler backend (no C++ toolchain on this machine).

**Checked against client sources only (RU branch of IzeBerg/wot-src, 1.45):**

- the names and signatures of `g_playerEvents` events and `CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION`;
- the battle-result field names, dossier record names and the feedback event types;
- `Account._doCmdInt` and `databaseID`;
- the `SystemMessages.pushMessage` signature.

**Not verified (needs the live client):**

- `onBattleResultsReceived` actually firing on Lesta 1.45 (the cache-polling fallback exists for this reason);
- the `BigWorld.fetchURL` keyword arguments with a non-empty headers dict, and whether response headers are exposed;
- the semantics of the `damageBetterThanNPercent` list;
- GUIFlash compatibility with the current Lesta client, and its label props (`x`, `y`, `alignX`, `alignY`, `drag`, `border`);
- the ModsSettingsAPI `TextInput` button callback payload;
- the `.mtmod` packages loading side by side from `mods/<version>/` with their paths merged under `gui/mods/otmetki/`, and whether the client reads the `<dependencies>` block of `meta.xml`;
- `vehicleTypeDescriptor.type.compactDescr` on the avatar;
- `ArenaType.g_cache[...].geometryName`;
- the settings core on Lesta 1.45: `skeletons.account_helpers.settings_core.ISettingsCore`, `getSetting` / `applySettings` / `confirmChanges` / `applyStorages`, the setting names in `companion/client/settings_core.CORE_NAMES` and their value scales (sensitivity, volume);
- the confirm dialog (`DialogsInterface.showDialog` + `SimpleDialogMeta` / `I18nConfirmDialogButtons`);
- replay upload: `BattleReplay.g_replayCtrl._BattleReplay__replayDir`, the `replayEnabled` setting name and values, when the client appends the results block to the replay file, and that the header `dateTime` is local time.

### Live-client smoke checklist

1. The Python log (`python.log`) shows `[OTMETKI] started <version>` and `[OTMETKI] feature <id> attached` for every installed feature.
2. The mod appears in the ModsSettingsAPI window, and binding with a code from the site succeeds.
3. After a random battle, `outbox_<id>.json` empties within about 15 s and the API shows the battle.
4. Selecting a tier 5+ vehicle sends a `moe_snapshot`. The in-battle panel appears when GUIFlash is installed.
5. With the network off, events stay in the outbox and are sent after reconnect.

## TODO

- A flash-free in-battle fallback when GUIFlash is absent. `GUI.Text` no longer exists in the 1.45 client stubs. Candidates are a Gameface (OpenWG) view or the battle `messages` controller.
- A smoke import of the client glue against the stubs from `IzeBerg/wot-src`. The smoke test uses hand-written stubs today.
- A Gameface settings view (`SettingsView`) and per-feature settings schemas, once the settings window moves off ModsSettingsAPI.
