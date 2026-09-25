# Bronevik companion mod

Game-client companion for «Мир танков» (Lesta, RU realm). It ships as a `.wotmod` package: Python 2.7 scripts that the client loads from `mods/<client version>/`.

It does four things:

- after each battle, it sends the player's own battle results to Bronevik in signed batches;
- it records marks-of-excellence (MoE) percentages for the player's own vehicles;
- in battle, it shows a MoE panel with the projected percentage and the damage needed for the next mark;
- in the hangar, it shows a session panel with battles, win rate, average damage and WN8.

## Fair play

The mod follows the Lesta Fair Play Policy (see [market research](../../docs/research/market.md#техника-модов)) and the `Fair play` rule in [CLAUDE.md](../../CLAUDE.md).

- **It reads only the player's own data:**
  - the `personal` block of the player's own battle results;
  - the player's own vehicle dossier;
  - the player's own damage and assist feedback events, which also drive the vanilla damage log and ribbons;
  - the player's own queue events;
  - an account command about the player's own vehicle.
- **It never reads or shows enemy information.** It has no positions, reload timers, aim or gun-marker data, spotting beyond vanilla, or minimap markers.
- **It has no aim assist.** It does not touch the crosshair, the camera or vehicle parameters.
- **It never serialises other players' data from battle results.** The `vehicles`, `players` and `avatars` blocks are never read into the payload. The test `test_payload.BattleEventTest.test_never_leaks_other_players` enforces this.
- The only other-vehicle value it reads is the team of a vehicle the player damaged. It uses that to ignore team damage in the MoE panel. The client already shows this value.
- **Nothing is collected or sent until the player binds the mod.** Binding uses a one-time code from the site. Each feature can be switched off.

## Layout

```
apps/mod/
  build.py                  Python 3 host build script -> dist/bronevik.<version>.wotmod
  contract/                 JSON Schemas the API implements (ingest, bind, MoE thresholds) + example
  src/mod_bronevik.py       client entry point (auto-loaded by the client: gui/mods/mod_*.pyc)
  src/bronevik/             pure logic, py2/py3 compatible, no client imports (unit-tested)
    binding.py              code normalisation, /mod/bind request/response, per-account credential store
    config.py               defaults, typed merge, feature switches, server URL validation
    i18n.py                 ru/en strings
    moe.py                  EMA maths, threshold curve interpolation, "damage needed" projection
    outbox.py               persistent event queue, batching, backoff, drop/auth/shrink rules
    panels.py               panel text formatting (GUIFlash HTML subset)
    payload.py              battle/MoE/queue event builders and the ingest envelope
    queue_timer.py          matchmaking queue timing
    sender.py               signs and posts batches through an injected transport
    session.py              session aggregation (idle gap, random battles only)
    settings_template.py    ModsSettingsAPI template
    signing.py              HMAC-SHA256 signature headers
    storage.py              atomic JSON files
    transport.py            urllib2/urllib worker-thread transport with main-thread callback polling
  src/bronevik/client/      client glue (imports BigWorld and gui): hooks, dossier, battle tracker, UI, settings
  tests/                    unittest suite, run with Python 3 (the pure code is 2/3 compatible)
```

The client loads `res/scripts/client/gui/mods/mod_bronevik.pyc`, which imports `gui.mods.bronevik.client.app` and calls `start()`. The `bronevik` subpackage is not named `mod_*`, so the client does not load it on its own.

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

1. **Binding.** On the site, a signed-in user gets a 6-character code: alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`, one-time, short TTL. In the hangar, the user enters it in the ModsSettingsAPI window and presses «Привязать». Without ModsSettingsAPI, the user sets `"bind_code"` in `mods/configs/bronevik/config.json` and logs in.
   - The mod sends `POST /mod/bind` `{code, account_id, mod_version, client_version, realm}`.
   - The server answers `{device_id, secret, account_id}`.
   - The credentials are stored per account in `mods/configs/bronevik/credentials.json`.
2. **Capture.** Events go into a per-account persistent outbox (`outbox_<account_id>.json`, at most 2000 events):
   - hangar MoE snapshots, sent only when the values change;
   - MoE distribution, once per vehicle per day;
   - queue times;
   - own battle results. These are deduplicated by `arenaUniqueID`, and the last 200 are kept in `state.json`.
3. **Send.** In the hangar only, every `flush_interval_seconds` (15 s by default) and right after a battle result, the mod sends one batch of up to 50 events with `POST /mod/ingest`. Headers:
   - `X-Bronevik-Device: <device_id>`
   - `X-Bronevik-Signature: sha256=<hex HMAC-SHA256(secret, raw body)>`

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
  - `queue_time_s`, `session_id`.
- **`moe_snapshot`:** `tank_id`, `damage_rating`, `moving_avg_damage`, `marks_on_gun`, `battles`.
- **`moe_distribution`:** `tank_id`, `battle_count`, `damage_better_than_n_percent[]` (the raw client answer).
- **`queue`:** `queue_type`, `wait_s`, `outcome` (arena / dequeued), `tank_id`.
- **Server obligations:**
  - verify the HMAC over the raw bytes it received, never over a re-serialisation;
  - check that the device belongs to `account_id`;
  - deduplicate by `event_id`;
  - on bind, reject an `account_id` that differs from the Lesta ID linked to the site user.

## Build

```bash
python apps/mod/build.py                 # dev build; ships .py if Python 2.7 is missing
python apps/mod/build.py --require-pyc   # release build; fails without Python 2.7
python apps/mod/build.py --python27 C:\Python27\python.exe --install-dir "D:\Games\Tanki\mods\1.45.0.8259"
```

The output is `apps/mod/dist/bronevik.<version>.wotmod`. The version comes from `src/bronevik/version.py`. The package is a stored (uncompressed) zip, which `.wotmod` requires, with explicit directory entries, `meta.xml` (`id=bronevik.companion`) and `res/scripts/client/gui/mods/...`.

The build looks for Python 2.7 in this order: `--python27`, `$BRONEVIK_PY27`, `$PYTHON27`, `py -2.7`, `python2.7`, `python2`, `C:\Python27\python.exe`. It compiles with `py_compile` and sets `dfile` to the in-package path, so tracebacks point to `scripts/client/gui/mods/...`.

Without Python 2.7, the package contains `.py` sources. This is for development only: it is **unverified** whether the client imports `.py` from inside a `.wotmod`. The client does import `.py` from `res_mods` during development. Every published mod ships `.pyc`, so always use `--require-pyc` for МОСТ and site releases. CI should install Python 2.7, for example the `actions/setup-python` 2.7 build on Windows or a `python:2.7` container.

## Tests

```bash
python -m unittest discover apps/mod/tests
```

The tests are pure logic and need no game client:

- payload building, including the "no other players' data" check;
- HMAC signing (RFC 4231 vector);
- session aggregation;
- MoE maths and projection;
- outbox batching and backoff;
- the sender with a fake transport;
- binding;
- config and settings template;
- panels and i18n;
- the thread transport against a local HTTP server.

`test_py27_compat` scans the sources for syntax that Python 2.7 lacks: f-strings, annotations, keyword-only args, `nonlocal`, `print` without `__future__`, unguarded py3-only imports. It also checks that the pure modules never import client modules.

Optional checks:

- `pip install jsonschema` enables the schema tests.
- `vermin -t=2.7- -t=3.6- apps/mod/src` reports minimum versions 2.6 and 3.0. The deliberate py2/py3 import fallbacks are marked `# novermin`.

## Install (players)

1. Copy `bronevik.<version>.wotmod` into `<game>/mods/<client version>/`.
2. Optional: install ModsSettingsAPI (izeberg) with ModsList (poliroid) and OpenWG Gameface to get the settings window and binding UI. Without them, edit `mods/configs/bronevik/config.json`.
3. Optional: install GUIFlash (gambiter) for the on-screen panels. Without it, the session summary comes as a system notification after each battle, and the in-battle panel is off.
4. Bind: on the site, open Profile → Mod, copy the code, then paste it into the mod settings and press «Привязать».

`mods/configs/bronevik/config.json` (created on first start):

| Key                                                                                      | Default                    | Meaning                                                                                                                                                |
| ---------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `enabled`                                                                                | `true`                     | Master switch                                                                                                                                          |
| `server_url`                                                                             | `https://api.bronevik.app` | API base. Must be https, or http://localhost / http://127.0.0.1 for development. **The domain is a placeholder until the domain decision (spec §12).** |
| `send_battle_results`, `send_moe_snapshots`, `send_moe_distribution`, `send_queue_times` | `true`                     | Per-feature data switches                                                                                                                              |
| `battle_moe_panel`, `hangar_session_panel`                                               | `true`                     | UI switches                                                                                                                                            |
| `session_idle_minutes`                                                                   | `60`                       | New session after this idle gap (10–1440)                                                                                                              |
| `flush_interval_seconds`                                                                 | `15`                       | Send interval (5–600)                                                                                                                                  |
| `bind_code`                                                                              | `""`                       | Fallback binding without ModsSettingsAPI; cleared after use                                                                                            |
| `language`                                                                               | `auto`                     | `ru`, `en` or `auto` (client language)                                                                                                                 |

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
3. Upload `bronevik.<version>.wotmod`. The `meta.xml` id stays `bronevik.companion` forever, so updates replace older versions. Bump `VERSION` on every release.
4. Tell the moderators that the mod makes HTTPS requests to our API, and that the only other-vehicle value it reads is the team of a vehicle the player damaged (to exclude team damage).
5. After each client patch:
   - rebuild;
   - smoke-test that the hooks still fire (see the checklist);
   - resubmit.

   The site's download page should link to the МОСТ page, not to a self-hosted binary, where possible.

Check МОСТ's current submission rules before the first upload. This README describes the process as we understand it, not an official document.

## Verified and not verified

**Verified on this machine (Python 3.12):**

- all pure logic passes 73 unit tests, including schema validation with `jsonschema`;
- the thread transport works against a real local HTTP server;
- `vermin` confirms the sources are 2.7-compatible;
- `build.py` produces a valid stored zip with the expected layout. It fell back to `.py` because Python 2.7 is not installed here.

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
- `.py`-only packages loading from `.wotmod`;
- `vehicleTypeDescriptor.type.compactDescr` on the avatar;
- `ArenaType.g_cache[...].geometryName`.

### Live-client smoke checklist

1. The Python log (`python.log`) shows `[BRONEVIK] started <version>`.
2. The mod appears in the ModsSettingsAPI window, and binding with a code from the site succeeds.
3. After a random battle, `outbox_<id>.json` empties within about 15 s and the API shows the battle.
4. Selecting a tier 5+ vehicle sends a `moe_snapshot`. The in-battle panel appears when GUIFlash is installed.
5. With the network off, events stay in the outbox and are sent after reconnect.

## TODO

- A flash-free in-battle fallback when GUIFlash is absent. `GUI.Text` no longer exists in the 1.45 client stubs. Candidates are a Gameface (OpenWG) view or the battle `messages` controller.
- Automatic replay upload (features §16). This needs `/mod/replays` in the contract first.
- CI job: Python 2.7 build, `--require-pyc`, and a smoke import against the stubs from `IzeBerg/wot-src`.
