# Three Marks modpack

Game-client modpack for «Мир танков» (Lesta, RU realm): Python 2.7 scripts the client loads from `mods/<client version>/`. It ships as `.mtmod` packages (Lesta 1.35+; `.wotmod` for WG clients): the core runtime, the companion, and one package per feature. The pre-split single package is still available as a build option.

It does four things, plus one opt-in:

- after each battle, it sends the player's own battle results to Three Marks in signed batches;
- it records marks-of-excellence (MoE) percentages for the player's own vehicles;
- in battle, it shows a MoE panel with the projected percentage and the damage needed for the next mark;
- in the hangar, it shows a session panel with battles, win rate, average damage and WN8;
- in the hangar, once bound, it shows the player's own site ratings (account, latest session, selected tank) read over signed `/mod/me` requests (see [hangar_ratings](#hangar_ratings--own-ratings-in-the-hangar));
- in battle, optional HUD components on a shared draggable panel layer: damage log, hit log, clock and battle timer, team HP, sixth-sense alert; plus event sounds for the player's own vehicle and a battle chat filter (see [Battle HUD](#battle-hud) and [Battle extras](#battle-extras));
- in the hangar, an extended battle summary with the session's battles, a marks-of-excellence history per vehicle, a clock/server/ping panel, auto-resupply flags, a notification filter, a cleaner hangar, quick actions and client-settings presets (see [Hangar and client-settings components](#hangar-and-client-settings-components));
- opt-in, off by default: it uploads the replays the game itself recorded of the player's own battles (see [Replay auto-upload](#replay-auto-upload)).

## Fair play

The mod follows the Lesta Fair Play Policy (see [market research](../../../docs/research/competitors/market.md#техника-модов)) and the `Fair play` rule in [CLAUDE.md](../../../CLAUDE.md).

- **It reads only the player's own data:**
  - the `personal` block of the player's own battle results;
  - the player's own vehicle dossier;
  - the player's own damage and assist feedback events, which also drive the vanilla damage log and ribbons;
  - the player's own queue events;
  - the loadout of the player's own selected vehicle in the hangar (equipment, consumables, directives, loaded shells, field modifications, crew skills), read when the player joins the queue;
  - an account command about the player's own vehicle.
- **It never reads or shows enemy information.** It has no positions, reload timers, aim or gun-marker data, spotting beyond vanilla, or minimap markers.
- **It has no aim assist.** It never changes vehicle parameters or computes anything about aiming. The crosshair, camera and minimap components only switch options the game's own settings window already offers (reticle look, sniper zoom steps, stabilisation, minimap size and own range circles), in the hangar, when the player picks them (see [Hangar and client-settings components](#hangar-and-client-settings-components)).
- **Hangar-only components stay in the hangar:** the replay manager touches only the player's own replay files (its opt-in auto names too); the quick actions are the client's own free requests (removable equipment, crew to barracks, the previous crew back), each confirmed by the player; auto-resupply sends the client's own vehicle-settings requests only when the player presses its button; the notification filter and the cleaner hangar only hide promo elements the client would show.
- **Battle extras only touch the player's own view:** event sounds follow the player's own vehicle state and the kill feed every player sees; the chat filter only hides or timestamps chat lines the client already received and never filters the player's own lines.
- **It never serialises other players' data from battle results.** The `vehicles`, `players` and `avatars` blocks are never read into the payload. The test `test_payload.BattleEventTest.test_never_leaks_other_players` enforces this.
- The only other-vehicle value it reads is the team of a vehicle the player damaged. It uses that to ignore team damage in the MoE panel. The client already shows this value.
- **The battle HUD components only re-arrange what the client already shows the player** (see [Battle HUD](#battle-hud)): the player's own damage/assist/blocked/received feedback, the hit result the client draws on an enemy marker after the player's own shot, the vehicle HP the client already has for markers and team panels, the arena timer, the client's own sixth-sense lamp. Nothing from Lesta's forbidden list: no enemy reload timers, aim direction, arty trajectories or tracer positions, destroyed-object or lost-enemy markers, smart crosshair or in-battle armour analysis.
- **Nothing is collected or sent until the player binds the mod.** Binding uses a one-time code from the site. Each feature can be switched off.
- **Replay auto-upload is opt-in** (`upload_replays`, off by default). It never turns replay recording on and never touches the battle: in the hangar it uploads the `.wotreplay` file the client already wrote, only when the replay header's `playerID` is the bound account. The file is the player's own recording, exactly as the site's manual upload accepts it. Uploads stay private unless `publish_replays` (also off by default) is on; the server re-checks the recorder and refuses anyone else's replay.

## Layout

```
apps/game/modpack/
  package.json              bun workspace @otmetki/modpack: test / lint / build scripts
  pyproject.toml            uv workspace root: dev tools (pytest, ruff, jsonschema, vermin), pytest and ruff config
  uv.lock
  contract/                 JSON Schemas the API implements (ingest, bind, MoE thresholds, settings, replay upload, own ratings) + examples
  packages/
    core/                   -> gui/mods/otmetki/core            pure runtime shared by everything; one folder per concern
      compat/                 Python 2/3 helpers on the vendored six (to_text/to_bytes/to_native, is_int/is_number/as_int)
      events/                 app.bus: one blinker signal per event, ordered handlers, a failing handler never stops the rest;
                              the names of the events sent between packages (component_settings, replay_uploaded)
      errors/                 ReasonError: a refusal with a `reason` (the i18n key suffix the caller shows)
      hooks/                  subscribe/unsubscribe for client Events, override()/restore() for methods; every handler runs
                              guarded (logged, never reaches the client; a failing override falls back to the original)
      registry/               lazy feature registry: attach in any load order (see "Load order")
      settings/               schema-driven settings: defaults, typed merge, limits, choices, normalizers
      storage/                JsonFile (atomic write) and MemoryFile
      codec/                  JSON on the stdlib: canonical form, request/response bodies, Retry-After
      net/                    transport/ (fetch-free HTTP on a worker thread, BackgroundRunner), signing/ (HMAC v2,
                              clock offset), backoff/ (exponential retry with jitter)
      i18n/ log/              string catalog and translator; [OTMETKI] log lines (native str on both Pythons) and safe()
      format/                 panel text: GUIFlash <font>, the shared palette, numbers, percentages, times, strip_tags/single_spaces
      templates/              {macro} panel templates (string.Template)
      hud/                    battle HUD layer: panel/ (per-panel schema), config/ (components.json), backend/ (renderer
                              interface), layer/ (HudLayer), edit/ (HudPreview: the panels' side of hud_edit/hud_describe)
      shells/                 shell types from the battle feedback (1.45 IntEnum, name or index) -> short codes
      native_settings/        component values -> the player's own client settings ('native' keeps the game's value)
      replay_file/            JSON header blocks of the client's own replay files (upload and manager)
      vendor/                 pinned py2.7 libraries (six 1.17.0, blinker 1.5, attrs 21.4.0, enum34 1.1.10) + licenses/;
                              written by tools/vendor/vendor.py, never edited by hand
      client/                 client glue: ui/ (hangar labels, system messages), transport/ (BigWorld.fetchURL), game/
                              (client version, language, vehicle and map reads, client_attr, service, values_by_name,
                              selected_vehicle), component/ (FeatureComponent: strings, components.json section, switch),
                              hud/ (shared HudLayer, guiflash/ backend, panel/ BattlePanel), battle/ (session reads, waiting
                              subscriptions), native/ (settings core, NativeSettingsComponent), garage/ (lock flags, the
                              client's item processors), timer/ (Ticker on BigWorld.callback), replays/
    ui/                     -> gui/mods/otmetki/ui              in-game UI (own package net.triotmetki.ui, see "In-game UI")
      protocol/ fields/ components/ profiles/ hud_edit/ bridge/ i18n/   pure: the whole window as state out, messages in
      client/                 glue: Gameface window, hangar button, ModsList entry, hotkey, the bridge context
      gameface/               the built ui-web page (committed; `bun run ui:build` rewrites it)
      res_map/                OpenWG Gameface resource registration of the page
    companion/              -> gui/mods/otmetki/companion       the mod the site binds to (id otmetki.companion)
      entry/mod_otmetki.py    entry point the client auto-loads (gui/mods/mod_otmetki.pyc)
      version.py              MOD_ID, VERSION, SCHEMA_VERSION (read by the build)
      app/                    client/: the thin host (OtmetkiApp, start())
      binding/ config/ i18n/ outbox/ payload/ sender/ queue_timer/ loadout/ shots/ settings_share/ settings_ui/
                              one concern each: pure logic in the folder, its client glue in <concern>/client/
      battles/ marks/         client/: the battle and marks-of-excellence capture for the API
  features/                 -> gui/mods/otmetki/features/<id>   one package each, attached through the registry
    <id>/
      __init__.py             FEATURE_ID, PACKAGE_ID, VERSION, create(app), register()
      entry/mod_otmetki_<id>.py   entry script: register() with the core registry
      model/                  pure logic (py2/3, unit-tested); HUD panels add preview.py (hud_edit sample text)
      client/                 client glue, subscribes to the app's event bus
      settings/               the config keys the feature reads (defaults stay in the companion schema)
      i18n/                   the feature's strings
      tests/
    marks_panel/            in-battle MoE panel: thresholds, EMA projection, damage needed
    session_stats/          hangar session panel and the session id on battle results
    replay_upload/          opt-in replay auto-upload (model/: queue, upload, files lookup/multipart, constants)
    damage_log/ hit_log/ battle_clock/ team_hp/ sixth_sense/ battle_results/
                            battle HUD components (see "Battle HUD"); each is model/ client/ settings/ i18n/ packages
    battle_sounds/ chat_filter/
                            battle extras without a panel (see "Battle extras")
    replay_manager/ hangar_tweaks/ minimap/ camera/ crosshair/ hangar_info/ marks_history/ auto_resupply/
    notification_filter/ hangar_cleaner/ hangar_ratings/
                            hangar and client-settings components (see "Hangar and client-settings components")
  ui-web/                   TypeScript source of the Gameface page (preact, nanostores, zod/mini, clsx; esbuild via bun)
  tools/
    build/                  build.py (CLI), layout.py (what goes where), archive.py (zip + meta.xml), compilers.py,
                            setupkit/ (the installer build: components.json, Inno includes, artwork, OpenWG.Utils)
    vendor/vendor.py        re-vendors packages/core/vendor from the pinned PyPI wheels (sha256); --check compares
    testing/_support.py     maps the repo onto the otmetki package; fixtures, schema validators
    tests/                  cross-package tests: py2.7 compat scan, layout, client import smoke
    run_tests.py            runs every suite with the standard library only (also on Python 2.7)
  installer/                Windows installer: Inno Setup 6.7 + OpenWG.Utils, component catalog, tests (installer/README.md)
```

Every package keeps its tests in its own `tests/` folder. The build leaves `tests/` out and moves `entry/` scripts to `gui/mods/`.

### Load order

The client imports every `gui/mods/mod_*.pyc` in hash order, so packages have no load order.

- The core has no entry script. It starts on first use.
- The companion's `mod_otmetki` creates the app. At the end of `start()` the app binds itself to the core registry: `core.registry.registry().bind(app)`.
- Each feature's `mod_otmetki_<id>` calls `register()`. A feature registered before the app starts is attached when the app binds; one registered later is attached at once. Both calls are idempotent.

`packages/core/tests/test_core_runtime.py` runs every order. `tools/tests/test_client_smoke.py` imports the real entry scripts in shuffled orders against stubbed client modules, then plays a login and a battle through the hooks.

### The app and its events

`companion/app/client` is a thin host. It hooks the client events and hands them to the companion's capture modules (`battles/client`, `marks/client`, `binding/client`) and to the features through `app.bus`.

- **Host interface for features:** `config`, `translate` (features add their strings with `translate.catalog.add(STRINGS)`), `ui`, `transport`, `account_id`, `in_battle`, `marks.hangar_moe`, `is_bound()`, `current_credentials()`, `auth_failed`, `on_auth_failed()`, `user_agent()`, `config_dir`, and the state file: `state`, `register_state(key, dump)`, `save_state()`.
- **Bus events:** `account`, `rebind`, `hangar`, `vehicle_moe`, `battle_enter`, `battle_start`, `battle_ready`, `battle_leave`, `battle_results`, `battle_event`, `battle_recorded`, `ingest_response`, `tick`. Their arguments are in the docstring of `companion/app/client`. Emitted by packages: `component_settings(component_id, changed_keys)` and `language(language)` (the in-game window), `hud_edit(active)` and `hud_describe(collect)` (HUD edit mode, see [In-game UI](#in-game-ui)), `replay_uploaded(arena_unique_id, replay_id)` (replay upload).
- **Settings window:** `companion/settings_ui/client`. `SettingsView` is the interface (`register()`, `refresh()`). The app creates `ModsSettingsApiView` (or `NoSettingsView`); the ui package adds its Gameface window next to it with `add_settings_view(app, view)` (a `CompositeSettingsView`), so the app keeps calling `app.settings_ui.refresh()` and ModsSettingsAPI stays the fallback.

## Client hooks

| What                    | Hook                                                                                                                                                                                                                                                                                                                                                                                                                               | Learnt from                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Own battle results      | `PlayerEvents.g_playerEvents.onBattleResultsReceived(isPlayerVehicle, results)`. Fallback: poll `BigWorld.player().battleResultsCache.get(arenaUniqueID, cb)` for arenas played in this run.                                                                                                                                                                                                                                       | wotstat-analytics `onBattleResultLogger.py` (same two-path approach), RU client source   |
| Result fields           | `results['personal'][<intCD>]`: `damageDealt`, `damageAssistedRadio`/`Track`/`Stun`, `damageBlockedByArmor`, `spotted`, `kills`, `shots`, `directEnemyHits`, `piercingEnemyHits`, `xp`, `credits`, `lifeTime`, `deathReason`, and post-battle `marksOnGun`/`damageRating`/`movingAvgDamage` (VEHICLE_SELF). `results['common']` holds arena and duration.                                                                          | `battle_results/battle_results_common.py` in the RU client source mirror                 |
| Hangar MoE              | `g_currentVehicle.getDossier().getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'damageRating' / 'movingAvgDamage' / 'marksOnGun')`, refreshed on `g_currentVehicle.onChanged`                                                                                                                                                                                                                                                              | spoter `mod_marksOnGunExtended` (WTFPL), `dossiers2/custom/records.py`                   |
| MoE distribution        | `BigWorld.player()._doCmdInt(AccountCommands.CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION, intCD, cb)` returns `ext.battleCount` and `ext.damageBetterThanNPercent`, at most once per vehicle per 24 h                                                                                                                                                                                                                                      | wotstat-analytics `moeLogger.py`                                                         |
| In-battle damage/assist | `guiSessionProvider.shared.feedback.onPlayerFeedbackReceived`, using `BATTLE_EVENT_TYPE.DAMAGE/RADIO_ASSIST/TRACK_ASSIST/STUN_ASSIST` and `extra.getDamage()`. It only counts while the controlled vehicle is the player's own.                                                                                                                                                                                                    | spoter `mod_marksOnGunExtended`, `feedback_adaptor.py`                                   |
| MoE formula             | EMA with k = 2/(100+1) over `damage + max(radio, track, stun)`                                                                                                                                                                                                                                                                                                                                                                     | spoter `mod_marksOnGunExtended`                                                          |
| Queue time              | `g_playerEvents.onEnqueued(queueType)`, `onDequeued(queueType)`, `onArenaCreated()`                                                                                                                                                                                                                                                                                                                                                | `Account.py` / `PlayerEvents.py`, RU client                                              |
| Battle start/end        | `g_playerEvents.onAvatarReady`, `onAvatarBecomeNonPlayer`. Replays are skipped with `BattleReplay.isPlaying()`.                                                                                                                                                                                                                                                                                                                    | `Avatar.py`, RU client                                                                   |
| Account                 | `BigWorld.player().databaseID` on `onAccountShowGUI`                                                                                                                                                                                                                                                                                                                                                                               | `Account.py`, `connection_mgr.py`                                                        |
| HTTP                    | `BigWorld.fetchURL(url, cb, headers=, timeout=, method=, postData=)`, which is asynchronous on the main thread. Fallback: `core.net.transport.ThreadTransport`, a urllib daemon thread (a `BackgroundRunner`) whose results the main-thread tick drains, so no BigWorld call ever runs off the main thread.                                                                                                                        | wotstat-analytics `asyncResponse.py`                                                     |
| Settings                | `gui.modsSettingsApi.g_modsSettingsApi`: `getModSettings`, `setModTemplate`, `registerCallback`, a `TextInput` with a button for the binding code                                                                                                                                                                                                                                                                                  | izeberg/modssettingsapi example + `templates.py`                                         |
| Panels                  | `gui.mods.gambiter.g_guiFlash.createComponent/updateComponent/deleteComponent(alias, COMPONENT_TYPE.LABEL, props)`                                                                                                                                                                                                                                                                                                                 | GambitER/GUIFlash (MIT)                                                                  |
| Panel drag              | `gui.mods.gambiter.flash.COMPONENT_EVENT.UPDATED(alias, props)`, fired by GUIFlash's `py_update` when the player drags a label; the HUD layer saves `x`/`y` to components.json                                                                                                                                                                                                                                                     | GUIFlash `flash.py`                                                                      |
| Damage log              | `feedback.onPlayerFeedbackReceived`: `BATTLE_EVENT_TYPE.DAMAGE/RADIO_ASSIST/TRACK_ASSIST/STUN_ASSIST/TANKING/RECEIVED_DAMAGE`, `extra.getDamage()`, `extra.getShellType()` (a `BATTLE_LOG_SHELL_TYPES` IntEnum member); `feedback.onPlayerSummaryFeedbackReceived` (`getTotalDamage/AssistDamage/BlockedDamage/StunDamage`)                                                                                                        | `feedback_events.py`, `feedback_adaptor.py`, RU 1.45                                     |
| Hit log                 | `feedback.onVehicleFeedbackReceived(eventID, vehicleID, value)` with the marker hit states `FEEDBACK_EVENT_ID.VEHICLE_HIT/RICOCHET/ARMOR_PIERCED/CRITICAL_HIT*/ARMOR_SCREEN_BLOCKED/TRACK_BLOCKED/WHEEL_BLOCKED/ARMOR_MISSED` (the client sends them only for the controlling vehicle's own shots: `Vehicle.showDamageFromShot` → `updateMarkerHitState`), `VEHICLE_HEALTH`; `BATTLE_EVENT_TYPE.DAMAGE/CRIT` with `extra.isShot()` | `Vehicle.py`, `feedback_adaptor.py`, `battle_constants.MARKER_HIT_STATE`, RU 1.45        |
| Team HP                 | `sessionProvider.getArenaDP().getVehiclesInfoIterator()` (`vehicleID`, `team`, `vehicleType.maxHealth`, `isAlive()`); `feedback.onVehicleFeedbackReceived` `VEHICLE_HEALTH` `(newHealth, attackerInfo, reason)` / `VEHICLE_DEAD`; own vehicle `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.HEALTH, hp)`; `arena.onVehicleKilled`, `arena.onVehicleAdded`                                                                 | `arena_dp.py`, `arena_vos.py`, `battle_session.setVehicleHealth`, `ClientArena.py`       |
| Battle clock            | `BigWorld.player().arena.period` / `periodEndTime` (`constants.ARENA_PERIOD`), `BigWorld.serverTime()`                                                                                                                                                                                                                                                                                                                             | `ClientArena.py`, `constants.py`, RU 1.45                                                |
| Sixth sense             | `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.OBSERVED_BY_ENEMY, isObserved)` (what the vanilla lamp listens to; `SWITCHING` resets); sound `SoundGroups.g_instance.playSound2D(event)`                                                                                                                                                                                                                                   | `Avatar.onObservedByEnemy`, `indicators.py`, `SoundGroups.py`, RU 1.45                   |
| Battle summary          | the companion's own `battle_event(event, now)` bus event (built from the `personal` block) and `marks.hangar_moe` from before the battle; map label `ArenaType.g_cache[...].name`; `SystemMessages.pushMessage`                                                                                                                                                                                                                    | companion `payload.py`                                                                   |
| Battle sounds           | `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.FIRE, bool)` and `(VEHICLE_VIEW_STATE.DEVICES, (deviceName, 'critical' / 'destroyed' / 'repaired' / 'normal', actualState))` (what the damage panel shows); `arena.onVehicleKilled(victimID, killerID, ...)` (the kill feed)                                                                                                                                                | `Avatar.__showDamageIconAndPlaySound`, `damage_panel.py`, RU 1.45                        |
| Chat filter             | overrides of `messenger.gui.Scaleform.channels.layout.BattleLayout.addMessage(message, doFormatting)` / `addCommand(command)` and `bw_chat2.battle_controllers._ChannelController._formatMessage`; own lines by `messenger.ext.player_helpers.isCurrentPlayer(avatarSessionID)` / `command.isSender()`                                                                                                                             | `layout.py`, `battle_controllers.py`, RU 1.45                                            |
| Notification filter     | override of `notification.NotificationsModel.NotificationsModel.addNotification(notification)`, `notification.getType()` against `notification.settings.NOTIFICATION_TYPE` names                                                                                                                                                                                                                                                   | `NotificationsModel.py`, `settings.py`, `decorators.py`, RU 1.45                         |
| Hangar cleaner          | overrides of `Hangar._Hangar__onTeaserReceived` (promo teaser), `Hangar._Hangar__updateCarouselEventEntryState` (`as_updateCarouselEventEntryStateS(False)`) and `IOffersBannerController.showBanners` (`skeletons.gui.offers`)                                                                                                                                                                                                    | `lobby/hangar/Hangar.py`, RU 1.45                                                        |
| Hangar info             | `IConnectionManager.serverUserNameShort` / `.url` (`skeletons.connection_mgr`), `predefined_hosts.g_preDefinedHosts.requestPing()` / `getHostPingData(url).value` (-1 = unknown), `IServerStatsController.getStats()` -> `(cluster, region, type)`                                                                                                                                                                                 | `connection_mgr.py`, `predefined_hosts.py`, `game_control/ServerStats.py`, RU 1.45       |
| Auto-resupply           | `Vehicle.isAutoRepair` / `isAutoLoad` / `isAutoEquip` (properties), `isAutoBattleBoosterEquip()`; `gui.shared.gui_items.processors.vehicle.VehicleAutoRepairProcessor` / `VehicleAutoLoadProcessor` / `VehicleAutoEquipProcessor` / `VehicleAutoBattleBoosterEquipProcessor(vehicle, value).request(cb)`; `IItemsCache.items.getVehicles(REQ_CRITERIA.INVENTORY)`                                                                  | `gui_items/Vehicle.py`, `processors/vehicle.py`, `requesters/ItemsRequester.py`, RU 1.45 |
| Crew quick actions      | `processors.tankman.TankmanUnload(vehicleInvID)`, `TankmanReturn(vehicle)` (the "return crew" button, needs `vehicle.lastCrew`); `processors.module.getInstallerProcessor(vehicle, item, slotIdx, install=False)`                                                                                                                                                                                                                  | `processors/tankman.py`, `processors/module.py`, RU 1.45                                 |

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
- [contract/ratings.schema.json](contract/ratings.schema.json) (the own-ratings reads `/mod/me/overview` and `/mod/me/tanks`)
- the examples [contract/examples/ingest.example.json](contract/examples/ingest.example.json), [ratings-overview.example.json](contract/examples/ratings-overview.example.json) and [ratings-tanks.example.json](contract/examples/ratings-tanks.example.json)

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

Spec: [streamer-settings §3.5](../../../docs/specs/2026-09-26-streamer-settings.md). Switch: `share_settings` (on by default; does nothing until the mod is bound). Client glue: `packages/companion/settings_share/client`.

- **Whitelist.** The glue reads standard client settings through the settings core (`dependency.instance(ISettingsCore)`) into flat keys (`fov`, `sniperSens`, `zoomSteps`, …, see `settings_share.FIELDS`). `build_export` keeps only those keys with valid values and nests them into the contract groups `display` … `battleUi`. Login/account keys, hardware and mods are never sent.
- **Export.** Set `"settings_action": "export"` in `config.json` and open the hangar. The mod posts `POST /mod/settings` `{device_id, account_id, mod_version, target, anonymous_stats, settings}`. `settings_target` is `private` (default) or `profile`; `settings_anonymous_stats` is off by default.
- **Apply.** Every 2 minutes in the hangar the mod polls `POST /mod/settings/apply/poll`. For a request it shows a yes/no dialog with the diff. Resolution, refresh rate, window mode and sensitivity are left out unless `settings_include_resolution` / `settings_include_sensitivity` are on. On confirm it writes the player's current values of the touched keys to `settings_backup_<account_id>.json`, applies the diff and posts `…/apply/<id>/result` `{status: applied}`; on cancel `rejected`. Without a dialog API the request stays pending; nothing is applied automatically. A second apply keeps the first backup.
- **Restore («Вернуть мои»).** `"settings_action": "restore"` writes the backup back and deletes it.
- It never installs or configures third-party mods. All three requests are signed like `/mod/ingest`.

## Replay auto-upload

Switches: `upload_replays` (off by default; does nothing until the mod is bound) and `publish_replays` (off by default: uploads are private). Feature `features/replay_upload`: pure logic in `model/` (`files` lookup and multipart, `queue`, `upload`, `constants`; the header reader is `core/replay_file`); client glue in `client/`. Contract: [contract/replay-upload.schema.json](contract/replay-upload.schema.json).

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

## Battle HUD

Six components, each its own feature package (`features/<id>/`, own `.mtmod`, depends on core and companion) with a switch in `config.json` (on by default) and its own section in `mods/configs/otmetki/components.json`. They follow the research's "who does it best": XVM for template-formatted logs, Battle Observer for team HP and the clock (Battle Observer does not run on Lesta), everyone's sixth-sense lamp without the forbidden "nearest enemy".

### The HUD layer (core)

- **`core/hud/`** (pure): `HudLayer` (`register(panel_id, schema)`, `show(panel_id, text)`, `hide`, `hide_all`, `update_settings`, `on_moved`), `ComponentConfig` (components.json: one schema-checked section per component; sections of components that are not installed are kept), `panel_schema(...)` (the common layout keys plus the panel's own), `HudBackend` (the renderer interface), `render(template, values)` (`{macro}` templates on the standard library's `string.Template`; `{{` is a literal brace, an unknown macro stays as written).
- **Common panel keys** (every panel section): `x`, `y` (-4000..4000), `align_x` (`left`/`center`/`right`), `align_y` (`top`/`center`/`bottom`), `alpha` (0..100), `font_size` (8..48), `drag`, `border`. The on/off switch stays in `config.json` (the companion schema), so the settings window keeps working while a component is not installed.
- **Dragging:** hold Ctrl for the cursor and drag a panel; GUIFlash reports the new position (`COMPONENT_EVENT.UPDATED`) and the layer writes `x`/`y` into the panel's section, so it comes back there next battle.
- **Renderer:** `core/client/hud/` picks the first usable backend from `BACKENDS`. Today that is GUIFlash (optional dependency, not bundled, last updated 2024: unverified on Lesta 1.45). Without it `NullBackend` keeps every panel hidden and logs `no HUD renderer (GUIFlash) installed`; the battle summary still works (it uses system messages). A Gameface backend (openwg_gameface) can be added to `BACKENDS` without touching the features: it only has to implement `available/create/update/delete/listen` with the GUIFlash label props (`x`, `y`, `alignX`, `alignY`, `alpha`, `drag`, `border`, `text`, `visible`).
- **Settings UI:** a settings window reads `hud_layer(app).schemas` / `.panels` and writes through `hud_layer(app).update_settings(panel_id, values)` (a shown panel moves at once).
- Components start on the app's `battle_ready` (own battles, never replays; the clock on `battle_enter`) and hide on `battle_leave`: each panel is a `core/client/hud/panel.BattlePanel` (`start`, `stop`, `render`; the base registers the panel, its `HudPreview` and the lifecycle). Battle-session events are subscribed through its `hooks` (`core/client/battle.BattleHooks`), which retries for 20 s while the session is not ready and unsubscribes everything on leave; tick loops use `core/client/timer.Ticker`.

### damage_log — damage log

- **What:** totals of the player's own damage dealt, damage blocked by armour, assistance (radio + track + stun) and damage received, plus the latest entries (kind, amount, vehicle short name, shell). The client's own end-of-life summary (`onPlayerSummaryFeedbackReceived`) raises the totals to at least its values.
- **Fair play:** the same feedback events that drive the vanilla damage log and ribbons, counted only while the camera follows the player's own vehicle. Damage to allies is not counted as dealt.
- **Switch:** `battle_damage_log`. **Section `damage_log`:** `style` (`full`, `compact`, `minimal`, `custom`), `template` (for `custom`), `show_log`, `log_lines` (0..15), `log_kinds` (`all`, `dealt`, `received`), `entry_template` (empty = built-in). Default position: bottom left.
- **Macros:** totals `{dealt}`, `{blocked}`, `{assisted}`, `{assist_radio}`, `{assist_track}`, `{assist_stun}`, `{received}`, `{hits}`, `{blocked_hits}`, `{received_hits}`; entries `{index}`, `{amount}`, `{kind}`, `{vehicle}`, `{shell}`.

### hit_log — own hits

- **What:** each of the player's own shots that hit an enemy: penetration, critical, no penetration, ricochet, spaced armour, tracks/wheels, missed armour, with the damage and shell when the server reports damage, crits, and the target's HP after the hit. Optionally grouped by target (hits and damage per vehicle). A damage event arriving within 2 s after a hit result is merged into it.
- **Fair play:** the hit result is exactly the one the client draws on the enemy marker after the player's own shot (the client only sends it for the controlling vehicle's shots); HP is what the enemy's marker shows. No armour analysis, nothing predictive.
- **Switch:** `battle_hit_log`. **Section `hit_log`:** `show_header`, `header_template`, `line_template` (empty = built-in), `lines` (0..20), `group_by_target`. Default position: bottom right.
- **Macros:** header `{hits}`, `{pens}`, `{no_pens}`, `{ricochets}`, `{damage}`, `{crits}`; lines `{index}`, `{vehicle}`, `{outcome}`, `{damage}`, `{crits}`, `{hp}`, `{shell}`, `{hits}` (grouped).

### battle_clock — clock and battle timer

- **What:** local time (and optionally the date) with the time left in the current arena period (countdown before the battle, then the battle timer).
- **Fair play:** the arena period and its end time are what the client's own timer shows.
- **Switch:** `battle_clock`. **Section `battle_clock`:** `clock_format` (`%H:%M`, `%H:%M:%S`, `%I:%M %p`), `date_format` (none, `%d.%m`, `%d.%m.%Y`, `%Y-%m-%d`), `show_timer`, `template` (`{time}`, `{date}`, `{timer}`, `{period}`). Default position: top right.

### team_hp — team HP and score

- **What:** the HP sum of each team against its maximum, as bars and/or numbers, the frag score and the HP difference. Styles `full`, `numbers`, `bars`, `compact`.
- **Fair play:** max HP comes from the arena data behind the player panels; current HP from the health updates the client already receives for markers and panels (an enemy the client has not seen keeps its last known HP, exactly as on its marker); deaths from the arena. The client already tracks the same values for its own HUD (the `battleField` controller in `battle_session.setVehicleHealth`); this panel only sums and restyles them.
- **Switch:** `battle_team_hp`. **Section `team_hp`:** `style`, `bar_width` (5..60), `show_score`, `show_diff`, `ally_color`, `enemy_color` (`#RRGGBB`), `template` (`{allies_hp}`, `{allies_max}`, `{allies_alive}`, `{enemies_hp}`, `{enemies_max}`, `{enemies_alive}`, `{allies_frags}`, `{enemies_frags}`, `{diff}`). Default position: top centre, under the vanilla score.

### sixth_sense — sixth-sense alert

- **What:** when the client's own sixth-sense lamp lights, a text or icon (with seconds since it lit) and, optionally, a custom sound; hidden when the lamp goes out or after `hide_after_s`.
- **Fair play:** it listens to the same vehicle-state event as the vanilla lamp, for the player's own vehicle only. No "nearest enemy", direction or distance (forbidden, item 8/9 of the rules).
- **Switch:** `battle_sixth_sense`. **Section `sixth_sense`:** `text` (empty = built-in), `color`, `icon` (a client image path, shown as `img://<path>`; letters, digits, `_./-` only), `icon_size` (16..256), `sound_event` (a Wwise event name already loaded by the client or a sound mod; letters, digits, `_` only; empty = no extra sound, the vanilla lamp sound is untouched), `show_timer`, `hide_after_s` (0 = while lit). We ship no sound bank: a custom sound needs a bank from a sound mod (e.g. built with openwg/wot.wwise).

### battle_results — extended battle summary

- **What:** after each own battle, a hangar system notification with the result, vehicle and map, XP and credits, damage/assist/blocked/frags/spotted, and the MoE percent with its change against the hangar snapshot from before the battle (and the change of the moving-average damage). Arrives in the hangar; results that arrive during a battle wait for the hangar.
- **Fair play:** built from the companion's own `battle_result` event, i.e. the `personal` block of the player's own results only.
- **Switch:** `hangar_battle_results`. **Section `battle_results`:** `show_economy`, `show_combat`, `show_marks`, `colored`, `bonus_types` (`all`, `random`), `history_size` (10..100), `template` (macros: `{result}`, `{vehicle}`, `{tier}`, `{map}`, `{xp}`, `{free_xp}`, `{credits}`, `{net_credits}`, `{repair}`, `{ammo}`, `{consumables}`, `{damage}`, `{assist}`, `{assist_radio}`, `{assist_track}`, `{assist_stun}`, `{blocked}`, `{frags}`, `{spotted}`, `{shots}`, `{hits}`, `{pens}`, `{life_time}`, `{duration}`, `{marks_on_gun}`, `{moe_percent}`, `{moe_delta}`, `{moving_avg}`, `{moving_avg_delta}`, `{marks_delta}`).
- **Window page:** the last `history_size` summaries (kept in `state.json` under `battle_results_history`), newest first, under a session row (battles closer than `session_idle_minutes`: win rate, average damage/assist/XP, credits after repair and resupply); each battle row opens its details (damage, assist by kind, blocked, frags/spotted, shots/hits/penetrations, XP and free XP, credits, repair/shells/consumables, credits after costs, lifetime, MoE and its change). Actions: «Мои бои на сайте» (`/me/battles`), «Очистить список». A link to one battle is left out: the site's battle page is keyed by its database id, which the mod does not know.

## Battle extras

Components that change no panel: each is a feature package with a config.json switch (on by default) and a components.json section, active only in the player's own battles (never replays).

### battle_sounds — event sounds

- **What:** a Wwise event of the player's choice for: fire on the own vehicle, an own module damaged or destroyed, the ammo rack hit, a crew member injured, first blood of the battle, the player's own frag and the own vehicle destroyed; each at most once per `cooldown_s`.
- **Fair play:** the own vehicle's state (the damage panel's own events, only while the camera follows the own vehicle) and the kill feed every player sees. Nothing about enemies.
- **Switch:** `battle_sounds`. **Section `battle_sounds`:** `fire`, `module_critical`, `module_destroyed`, `ammo_rack`, `crew_injured`, `first_blood`, `own_frag`, `own_death` (Wwise event names: letters, digits, `_`; empty = nothing extra, the vanilla sounds stay), `cooldown_s` (0..30). Played through `core/client/sound` (shared with the sixth-sense alert). We ship no sound bank: the events come from a sound mod.

### chat_filter — battle chat

- **What:** a `[HH:MM:SS]` stamp on every chat line (team, common, squad; the epic-battle channel formats its own lines and keeps no stamp), and hiding of repeats (the same line from the same player within `duplicate_window_s`), flood (more than `rate_limit` lines per player within `rate_window_s`), quick-command spam (the same limit) and lines with a blocked word. The player's own lines are never hidden. Hidden lines are left out of the replay's chat as well.
- **Fair play:** it only hides or annotates chat the client already received.
- **Switch:** `battle_chat_filter`. **Section `chat_filter`:** `timestamp_format` (none, `%H:%M`, `%H:%M:%S`), `filter_duplicates`, `duplicate_window_s` (5..300), `rate_limit` (0..20, 0 = off), `rate_window_s` (5..60), `filter_commands`, `block_words` (comma-separated, case-insensitive).

## In-game UI

Package `packages/ui` (`net.triotmetki.ui`, depends on core and companion; registers through the core registry as `ui`, so it attaches in any load order). Without OpenWG Gameface it logs one line and the ModsSettingsAPI window / `config.json` stay the settings UI.

- **Window:** a Gameface `WindowImpl` + `ViewImpl` whose `ViewModel` has one string property `state` (the whole UI state as JSON) and one command `send` (`{message: '<json>'}`). The page is `ui-web` built into `packages/ui/gameface/` and shipped at `res/gui/gameface/mods/triotmetki/ui/`; `res_map/net.triotmetki.ui.json` registers it for OpenWG Gameface (Lesta needs its Lesta-compatible build; the first start after install restarts the client once).
- **Entry points:** a «///» button injected into a hangar Gameface view (`client/constants.BUTTON_HOSTS`, `setChildView` + `gf_mod_inject` of `button.js`), a ModsList entry when a Lesta-compatible ModsList is installed, and the hotkey Ctrl+Shift+T (hangar only; it also ends the on-screen HUD edit mode). The window closes on `battle_enter`.
- **Bridge (pure, `ui/bridge`):** `SettingsBridge.state()` and `handle(message)`; the glue only moves JSON. Messages: `ready`, `close`, `set {component, key, value}`, `action {component, action, row?, value?}`, `language`, `bind {code}`, `open {path}` (site-relative paths only, joined to the site next to `server_url`), `profile_save/load/rename/delete/export/import`, `hud_edit {active}`, `hud_move {panel, x, y, align_x?, align_y?}`, `hud_reset {panel}`. A test checks the command list against `ui-web`, and the page's zod schema parses a state fixture the Python tests write (`OTMETKI_UPDATE_FIXTURES=1` regenerates it).
- **Cards (`ui/components`):** the companion's data switches (`COMPANION_KEYS`) first, then every attached feature, then HUD panels no feature claims. A page row may carry `details: [{label, value}]`; the page shows them behind a «Подробнее» toggle (the battle summaries and the marks history use it). A card's switch is the feature's config.json switch (`settings.SETTINGS`); its fields come from its components.json section (`settings.SCHEMA`) or its companion keys; field type, limits and choices are derived from the `Schema` (bool, int with min/max, choice, text). Panel position keys (`x`, `y`, `align_*`, `drag`) are left to the HUD editor. A feature instance may add buttons and a list page with duck-typed `ui_actions()`, `ui_page()` and `ui_action(action, row, value)` (the replay manager and hangar tweaks do). Group: `GROUP` in the feature's settings (`data`, `hangar`, `battle`).
- **Labels:** from the shared catalog, most specific first: `component_<id>` / `component_<id>_hint`; field `<id>_<key>`, `setting_<key>`, then the bare key (the companion labels its switches that way); hints with `_hint`; choices `<id>_<key>_<value>`, then `choice_<value>`. A feature adds these to its `i18n` STRINGS.
- **Profiles (`ui/profiles`):** `mods/configs/otmetki/profiles.json` `{version: 1, active, profiles: [{id, name, created, updated, data: {config, components}}]}`, at most 12. `data.config` is config.json without `server_url`, `bind_code`, `settings_action`; `data.components` is the whole components.json (sections of components that are not installed included: they are stored as is and merged through their schema once installed). The installer reads and writes the same file. Profile codes `TM1.<base64url(zlib(json))>` copy a profile between players. **Site sync is not wired:** the settings-share contract (`contract/settings.schema.json`) is a strict whitelist of standard client settings and excludes mods by design, so syncing profiles to the site needs its own contract and endpoint.
- **HUD edit mode:** the window's editor draws the screen (the client size from `viewEnv.getClientSizePx()`) with every registered panel from `hud_layer(app).panels`; dragging (or the arrow keys) sends `hud_move` with the nearest anchor (`align_x`/`align_y` by screen third), throttled to 150 ms, and the bridge writes it through `hud_layer(app).update_settings`, so a shown panel moves live. «Edit on screen» emits `hud_edit(True)` on the bus and closes the window: every HUD panel (damage log, hit log, clock, team HP, sixth sense) shows itself with preview data in the hangar when its switch is on, and GUIFlash lets the player drag it (Ctrl); `hud_edit(False)` (hotkey, window reopened, battle) hides the previews, and a panel's own battle start ends its preview. `hud_describe(collect)` asks panels for the editor's miniature: `collect(panel_id, preview=None, width=None, height=None)`. A panel answers both through `core.hud.HudPreview(layer, panel_id, render_preview, is_enabled, can_show, size).attach(app.bus)`; its preview text comes from the feature's pure `model/preview.py`.
- **Look:** the site's design v4 tokens, read from `apps/web/client/shared/styles/_tokens.scss` at build time (dark theme; `rgb(r g b / a)` becomes `rgba()`, px becomes rem because Gameface scales rem) and inlined into the CSS: graphite surfaces, orange accent, gold for the active profile. The ModsList icon is drawn at build time from the same tokens (`fast-png`).
- **Build and tests:** `bun run ui:build` (in `apps/game/modpack`) bundles `ui-web` with esbuild into `packages/ui/gameface/` (committed; a test fails when it is stale). `bun run ui:test` (`bun test ui-web`) and the repo's Vitest project `modpack-ui` run the same `_tests`; `bun run typecheck` covers `ui-web`.

## Hangar and client-settings components

Each is a feature package with a config.json switch (on by default) and a components.json section. The four client-settings components write **only standard client settings the game's own settings window offers**, through the settings core (`core/client/native`), only in the hangar, and only when the player changes a value in the window or loads a profile (`component_settings`): the value `native` («Как в игре») never touches the game's setting, and a later change in the game's own settings window is never overridden.

### replay_manager — replay manager

- **What:** the player's own replays in the client's replay folder (the header's recorder must be the logged-in account), newest first, with map, vehicle, date and size; rename (Windows-safe names, same extension), delete (with a confirmation), open the folder; replays the mod uploaded link to `/replays/<id>` on the site (the upload's `replay_uploaded` event stores the site id per arena in `replay_manager_<account>.json`), plus «Мои реплеи на сайте».
- **Auto names (opt-in):** with `auto_rename` on, the replay of each own battle is renamed after the battle from `name_template` (macros `{date}`, `{time}`, `{map}`, `{vehicle}`, `{tier}`, `{result}`, `{damage}`, `{xp}`, `{frags}`, `{arena}`; Windows-safe, same extension). The file is matched by its header (the results block's arenaUniqueID, else the start time within 5 min), never by its name; checked every 15 s in the hangar once the file has not changed for 10 s; a battle without a replay is dropped after 30 min; an existing target name is never overwritten. The replay upload matches by header too, so a renamed file still uploads.
- **Switch:** `hangar_replay_manager`. **Section:** `max_rows` (10..200), `uploaded_only`, `auto_rename` (off by default), `name_template`.
- **Left out:** playing a replay from the hangar (no verified client API).

### hangar_tweaks — hangar

- **What:** the carousel options of the client (`carouselType` one/two rows, `doubleCarouselType` tile size) and three free quick actions on the selected vehicle, with confirmations: demount every piece of equipment the client marks removable, send the crew to the barracks (refused when the barracks are known to be full), and bring the previous crew back (the client's own «Вернуть экипаж», refused without a remembered crew). All refuse while the vehicle is in battle, in the queue or in a platoon, and run the client's own item processors (signatures checked against the RU 1.45 source: `TankmanUnload` takes the vehicle's inventory id).
- **Switch:** `hangar_tweaks`. **Section:** `carousel_rows`, `carousel_tiles`, `quick_actions`.
- **Left out:** a three-row carousel (needs patching the Flash carousel) and hiding the hangar tutorial hints (no side-effect-free client API could be verified for Lesta 1.45).

### minimap — minimap

- **What:** size (`minimapSize` 0..5), transparency (`minimapAlpha`), vehicle names on the map (`showVehModelsOnMap`: never / Alt / always) and the player's own range circles (`minimapViewRange`, `minimapMaxViewRange`, `minimapDrawRange`).
- **Switch:** `minimap_tweaks`. **Fair play:** vanilla options only; a test checks that no setting name concerns enemies, directions, tracers, destroyed objects or spotting. **Left out:** zoom beyond the client's own size range (Flash patch); lost-enemy markers, gun directions, arty tracers (forbidden).

### camera — camera

- **What:** camera presets (`preset`: `sniper` = x2–x25 without the dynamic camera, `balanced` = x2–x16, `dynamic` = x2–x8 with the dynamic camera; all with horizontal stabilisation), the sniper zoom steps preset (`zoomSteps`: x2–x8, x2–x16, x2–x25, x4–x25), the dynamic camera and horizontal stabilisation. A preset only fills the fields left at «Как в игре»; a field set by hand wins.
- **Switch:** `camera_tweaks`. **Left out until Lesta/МОСТ confirms them in writing:** camera distance and zoom beyond the client's own options, free-look / pitch limits, the commander camera and sway removal. All of them override the camera configuration (PMOD-style) rather than a setting the game exposes.

### crosshair — crosshair presets

- **What:** presets (`classic`, `minimal`, `contrast`, `clean`) over the client's own reticle settings (`arcade` / `sniper`: opacity and style index of the net, centre mark, gun mark, mixing, reload, condition, cassette and zoom indicator; the player's other parts are kept), for arcade, sniper or both; and the client's server-reticle switch (`useServerAim`).
- **Switch:** `crosshair_presets`. **Fair play:** looks only; nothing computes lead, penetration, distance or anything about enemies.
- **Custom reticle art (not shipped):** the battle reticle is the Scaleform `crosshairPanel` (AS3). New art would mean an original vector design exported from SVG into our own AS3 skin (Animate or FFDec), compiled to SWF and shipped inside a `.mtmod` at the client's `gui/flash/...` path so the VFS overrides the vanilla file, rebuilt after every client patch. It stays visual-only and keeps the vanilla logic; until then the presets use only the settings the game offers.

### hangar_info — clock, server, ping, online

- **What:** a hangar label with the local time and date, the server the player is logged in to, the client's own ping to it (coloured by the client's own bands: up to 59 ms, up to 119 ms, above) and the online counter of the lobby header; redrawn on the app's hangar tick, hidden in battle. Needs GUIFlash like the other hangar panels.
- **Fair play:** hangar only; the player's own connection.
- **Switch:** `hangar_info`. **Section:** `clock_format`, `date_format` (none, `%d.%m`, `%d.%m.%Y`, `%Y-%m-%d`), `show_server`, `show_ping`, `show_online`, `template` (`{time}`, `{date}`, `{server}`, `{ping}`, `{online}`, `{region_online}`), `font_size`, `x`, `y`, `align_x`, `align_y`. The ping is what the server selector measured (the client pings at most every 10 min; the panel asks every 60 s).

### marks_history — marks of excellence history

- **What:** per vehicle, the MoE percent, marks and moving-average damage after each own battle (the `moe` of the companion's own battle_result event) and the hangar dossier snapshots in between (only when they changed: battles played without the mod), with the date each mark was reached. A hangar label for the selected vehicle (percent, stars, the last battle's change, the trend over `trend_battles`); the window page lists the vehicles, most recent first, with their latest entries in the details and a «Очистить» per vehicle; «Прогресс на сайте» opens `/me/progress`. Stored per account in `mods/configs/otmetki/marks_history_<account>.json` (at most `max_entries` per vehicle, 300 vehicles).
- **Fair play:** the player's own battle results and dossier only.
- **Switch:** `hangar_marks_history`. **Section:** `max_entries` (10..500), `show_panel`, `trend_battles` (1..50), `page_rows` (10..200).
- **Left out:** WN8 and other site ratings per vehicle: the [hangar_ratings](#hangar_ratings--own-ratings-in-the-hangar) label shows them for the selected tank.

### hangar_ratings — own ratings in the hangar

- **What:** a hangar label with the bound player's own site ratings: the account (WN8, EFF, Броня-Индекс, win rate, battles, average damage), the latest session (the mod's live session, else the latest day the site counted: WN8, Броня-Индекс, win rate, battles, average damage) and the selected tank (WN8, win rate, battles, average damage, MoE percent with its marks, mastery badge). Values are coloured by the rating scale's tier. The window card has «Обновить» and «Аналитика на сайте» (`/me/analytics`). Hidden in battle and until the mod is bound.
- **Requests:** `POST /mod/me/overview` `{device_id, account_id}` and `POST /mod/me/tanks` `{device_id, account_id, tank_ids}` (the selected tank), signed like `/mod/ingest` (v2, `core.net.signing.signed_request`, the same 428 clock re-sync), through the app's transport. Contract: [contract/ratings.schema.json](contract/ratings.schema.json). The server answers only for the device's bound account (another `account_id` is 403 `account_mismatch`), caches each answer for 30 s and rate-limits the pair.
- **Cache:** in memory for the game session, per account (`model/cache.RatingsCache`): each value is read once; after an own battle result the overview and that tank are read again 20 s later (after the ingest flush), or at once when an ingest answer arrives; a failed read waits 2 min (429: its `Retry-After`, 1 min without); 401/403 pauses it like the outbox (`on_auth_failed`, rebind). Nothing is stored on disk.
- **Fair play:** only the bound account's own ratings; an answer naming any other account is dropped by the mod as well.
- **Switch:** `hangar_ratings`. **Section:** `show_account`, `show_session`, `show_tank`, `metric_wn8`, `metric_eff` (off), `metric_brone_index`, `metric_win_rate`, `metric_battles`, `metric_avg_damage`, `metric_moe`, `metric_mastery`, `colored`, `font_size`, `x`, `y`, `align_x`, `align_y`. Needs GUIFlash like the other hangar panels.

### auto_resupply — auto-resupply flags

- **What:** the four per-vehicle flags of the game's ammunition panel: auto repair, auto-resupply of shells, of consumables and of directives, each «Как в игре» / on / off. Two buttons: «Применить к выбранному танку» and «Применить ко всем танкам» (confirmed); only the flags that differ are sent, one request after another, vehicles in battle, in the queue or in a platoon are skipped. Nothing is sent without a button press, so a flag changed later in the game is never overridden.
- **Fair play:** hangar only; the client's own vehicle-settings requests.
- **Switch:** `hangar_auto_resupply`. **Section:** `auto_repair`, `auto_load`, `auto_equip`, `auto_boosters`.
- **Left out:** an automatic crew return: RU 1.45 has no such vehicle flag (the crew's return is the hangar tweaks' one-off quick action).

### notification_filter — notification centre

- **What:** hides whole groups of notification-centre entries by the client's own notification types: `hide_promo` (web promo pop-ups, the WoT Plus intro, auction, black market and resource well announcements), `hide_reminders` (recruit, e-mail confirmation, Battle Pass chapter and task reminders, missing events), `hide_friend_requests`, `hide_clan` (clan invites and applications). Plain messages (battle results, purchases, the mod's own) and platoon invites are never hidden. A hidden entry is neither listed nor counted.
- **Fair play:** hangar only; it only hides notifications.
- **Switch:** `hangar_notification_filter`. **Section:** `hide_promo` (on), `hide_reminders`, `hide_friend_requests`, `hide_clan` (off).

### hangar_cleaner — cleaner hangar

- **What:** hides the promo teaser (the hangar's pop-up promo card), the offer banners and, optionally, the event entry points of the carousel. Takes effect the next time the hangar view is created.
- **Fair play:** hangar only and cosmetic.
- **Switch:** `hangar_cleaner`. **Section:** `hide_teaser` (on), `hide_offer_banners` (on), `hide_event_entries` (off).
- **Left out:** CSS injection into Gameface hangar views (banner widgets of the new lobby): the selectors change with every patch and cannot be verified without the live client.

### Left out of the component catalogue (fair play or unverifiable)

From the research's "who does it best" list, these stay out:

| Component                                                                                                                                                                   | Why                                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Penetration calculator in the reticle, skins with armour zones                                                                                                              | Lesta's item 12 (in-battle armour analysis, "will be forbidden")                                                                            |
| Arty trajectory/"artometer", tracer-based positions, lost-enemy markers, gun directions on the minimap, "nearest enemy" at the lamp, enemy reload timers, destroyed objects | Lesta's forbidden list (items 1–10)                                                                                                         |
| Player panel ratings / "оленемер" (other players' stats in battle)                                                                                                          | the research's decision: conflict-prone, and it reads other players' data; the mod reads only the player's own                              |
| Player panel and vehicle marker restyling (names, icons, HP on markers)                                                                                                     | needs patching the Scaleform players panel / markers2d; no verifiable Python API                                                            |
| Safe Shot (blocking the own shot at allies and wrecks)                                                                                                                      | overrides the shooting path in battle; doubtful without a written МОСТ/Lesta answer                                                         |
| Distance and shell flight time in the reticle, server reticle on a key                                                                                                      | reads the aim point in battle (close to "smart reticle"); writing client settings in battle breaks the hangar-only rule for client settings |
| Commander camera, zoom beyond x25, sway removal (PMOD), fog removal                                                                                                         | override the camera/graphics configuration beyond the game's options; waiting for Lesta's written confirmation                              |
| White wrecks, highlighted broken tracks                                                                                                                                     | texture replacement assets in `res_mods`; nothing to ship without our own art                                                               |
| Damage direction indicator extensions                                                                                                                                       | a longer or larger indicator shows attackers the client no longer shows                                                                     |
| Hits on the own tank in the hangar (battle-hits)                                                                                                                            | a 3D hangar scene of shot data; no verified API, planned later with our own breakdown on the site                                           |
| Voice-overs                                                                                                                                                                 | heavy sound banks; the event-sounds component plays any installed bank instead                                                              |
| FPS limiter, Reflex, Anti-Lag                                                                                                                                               | OpenWG Common does it; installed as a dependency, not re-implemented; external .exe tweakers are grey                                       |
| Carousel filters, a three-row carousel, the vertical tech tree                                                                                                              | patching the Flash carousel / tech tree                                                                                                     |
| Auto-accept rewards                                                                                                                                                         | economic actions without the player's confirmation                                                                                          |

## Build

```bash
python apps/game/modpack/tools/build/build.py                          # dev: one .mtmod per package; .py without a compiler
python apps/game/modpack/tools/build/build.py --require-pyc            # release: fails without a bytecode compiler
python apps/game/modpack/tools/build/build.py --single --require-pyc   # release in the single-package format
python apps/game/modpack/tools/build/build.py --wg                     # .wotmod for WG clients
python apps/game/modpack/tools/build/build.py --dry-run                # list the packages and their in-game paths, write nothing
python apps/game/modpack/tools/build/build.py --install-dir "D:\Games\Tanki\mods\1.45.0.8259"
```

`bun --filter @otmetki/modpack build` runs the first line. The output goes to `apps/game/modpack/dist/`:

| Package        | File                            | meta.xml id                        | Depends on      |
| -------------- | ------------------------------- | ---------------------------------- | --------------- |
| core           | `net.triotmetki.core_<v>.mtmod` | `net.triotmetki.core`              | —               |
| companion      | `otmetki.companion_<v>.mtmod`   | `otmetki.companion` (kept forever) | core            |
| ui             | `net.triotmetki.ui_<v>.mtmod`   | `net.triotmetki.ui`                | core, companion |
| feature `<id>` | `net.triotmetki.<id>_<v>.mtmod` | `net.triotmetki.<id>`              | core, companion |
| `--single`     | `otmetki.<v>.mtmod`             | `otmetki.companion`                | —               |

Versions come from `packages/core/version.py`, `packages/companion/version.py` and each `features/<id>/__init__.py`.

Each package is a stored (uncompressed) zip with explicit directory entries, `meta.xml` and `res/scripts/client/gui/mods/...`; the ui package also carries `res/gui/gameface/mods/triotmetki/ui/*` and `res/mods/configs/res_map/net.triotmetki.ui.json`, which are never compiled. The split packages never ship the same file, and `--single` is their union. The `<dependencies>` block in `meta.xml` is for installers and people. Whether the client reads it is **unverified**, and the code never relies on it (see [Load order](#load-order)).

**Release builds must ship `.pyc`.** The production client loads only `mod_*.pyc`; it reads `.py` only in development mode. A source-only package does not load in a live client. Pick the compiler with `--compiler auto|owg|py27` (see `tools/build/compilers.py`):

- **`owg`**, tried first: OpenWG [owg_python_compiler](https://gitlab.com/openwg/owg-python-compiler).
  - A C++ tool that writes CPython 2.7 bytecode without Python 2.7, reproducibly (fixed header timestamp, stable `co_filename`).
  - It has no binary releases: build the tag with CMake, as the `release-build` job in [.github/workflows/modpack.yml](../../../.github/workflows/modpack.yml) does. Pass `--owg-compiler PATH` or set `$OWG_PYTHON_COMPILER`.
  - **Unverified:** that `--filename-root scripts` gives `co_filename` `scripts/client/gui/mods/...`. Check a traceback in `python.log` after the first owg-built release.
- **`py27`**: a Python 2.7 interpreter running `py_compile`, with `dfile` set to the in-package path. Looked up as `--python27`, `$OTMETKI_PY27`, `$PYTHON27`, `py -2.7`, `python2.7`, `python2`, `C:\Python27\python.exe`.

Without either, the packages carry `.py` sources and the build prints a warning. They load in development clients only.

## Tests

```bash
bun run test:modpack                     # from the repo root: python apps/game/modpack/tools/run_tests.py
cd apps/game/modpack && uv sync && uv run pytest && uv run ruff check .
```

- `tools/run_tests.py` needs only the standard library and runs every `tests/` folder (`packages/*`, `features/*`, `tools/**`). It also runs on Python 2.7, where the build tool's own tests are left out.
- pytest runs the same unittest-style tests, with its config in `pyproject.toml`.
- `ui-web`: `bun run ui:test` (or the repo's `bun run test`, Vitest project `modpack-ui`). `tools/tests/test_ui_smoke.py` loads the ui with stubbed Gameface, ModsList, InputHandler and settings core, opens the window and drives it with page messages.
- The pre-commit hook runs `test:modpack` when a staged Python file is under `apps/game/modpack`.
- [.github/workflows/modpack.yml](../../../.github/workflows/modpack.yml) runs pytest, the stdlib runner, ruff and vermin on Windows for pull requests.

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
- hangar ratings: the signed request bodies against `contract/ratings.schema.json`, the response examples, dropping an answer about another account, the per-session cache (in flight, backoff, refresh after a battle) and the panel text per metric switch;
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

The installer `otmetki-setup-<version>.exe` finds the client, offers presets and profiles, backs up the mod folders and can roll back: see [installer/README.md](installer/README.md). By hand:

1. Copy the packages into `<game>/mods/<client version>/`: `net.triotmetki.core_<v>.mtmod`, `otmetki.companion_<v>.mtmod` and the features you want, or the single `otmetki.<v>.mtmod`. Do not mix the single package with the split ones.
2. Optional: install ModsSettingsAPI (izeberg) with ModsList (poliroid) and OpenWG Gameface to get the settings window and binding UI. ModsList master needs WG 2.4.1+; on Lesta use a release that supports the client. Without them, edit `mods/configs/otmetki/config.json`.
3. Optional: install GUIFlash (gambiter) for the on-screen panels. Without it, the session summary comes as a system notification after each battle, and the in-battle panel is off.
4. Bind: on the site, open Profile → Mod, copy the code, then paste it into the mod settings and press «Привязать».

`mods/configs/otmetki/config.json` (created on first start):

| Key                                                                                                                                                                                                                               | Default                     | Meaning                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `enabled`                                                                                                                                                                                                                         | `true`                      | Master switch                                                                                                               |
| `server_url`                                                                                                                                                                                                                      | `https://api.triotmetki.ru` | API base. Must be https, or http://localhost / http://127.0.0.1 for development.                                            |
| `send_battle_results`, `send_moe_snapshots`, `send_moe_distribution`, `send_queue_times`, `send_loadouts`, `send_shots`                                                                                                           | `true`                      | Per-feature data switches                                                                                                   |
| `battle_moe_panel`, `hangar_session_panel`                                                                                                                                                                                        | `true`                      | UI switches                                                                                                                 |
| `battle_damage_log`, `battle_hit_log`, `battle_clock`, `battle_team_hp`, `battle_sixth_sense`, `hangar_battle_results`                                                                                                            | `true`                      | Battle HUD switches; their look and position live in `components.json` (see [Battle HUD](#battle-hud))                      |
| `battle_sounds`, `battle_chat_filter`                                                                                                                                                                                             | `true`                      | Battle extras (see [Battle extras](#battle-extras))                                                                         |
| `hangar_replay_manager`, `hangar_tweaks`, `minimap_tweaks`, `camera_tweaks`, `crosshair_presets`, `hangar_info`, `hangar_marks_history`, `hangar_ratings`, `hangar_auto_resupply`, `hangar_notification_filter`, `hangar_cleaner` | `true`                      | Hangar and client-settings components (see [Hangar and client-settings components](#hangar-and-client-settings-components)) |
| `session_idle_minutes`                                                                                                                                                                                                            | `60`                        | New session after this idle gap (10–1440)                                                                                   |
| `flush_interval_seconds`                                                                                                                                                                                                          | `15`                        | Send interval (5–600)                                                                                                       |
| `upload_replays`                                                                                                                                                                                                                  | `false`                     | Upload the game's own replays of your battles (opt-in)                                                                      |
| `publish_replays`                                                                                                                                                                                                                 | `false`                     | Make auto-uploaded replays public; off keeps them private (owner only)                                                      |
| `bind_code`                                                                                                                                                                                                                       | `""`                        | Fallback binding without ModsSettingsAPI; cleared after use                                                                 |
| `language`                                                                                                                                                                                                                        | `auto`                      | `ru`, `en` or `auto` (client language)                                                                                      |

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

- 434 tests under pytest (425 passed, 9 skipped without ISCC) and 427 in the stdlib runner, including schema validation with `jsonschema`. The stdlib runner also passes on Python 2.7.18 (a portable build, 390 tests without the build tool's own);
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
- battle HUD: GUIFlash on Lesta 1.45 at all; the `alpha` label prop; that the `x`/`y` in `COMPONENT_EVENT.UPDATED` are in the same space as the ones passed to `createComponent` (relative to `alignX`/`alignY`); `<img src="img://...">` in a label; the hit-state events arriving before the matching damage event (the 2 s merge window); `vehicleType.maxHealth` on every vehicle info at `battle_ready`; `arena.periodEndTime` against `BigWorld.serverTime()`; `SoundGroups.g_instance.playSound2D` with a mod bank's event; that `onPlayerSummaryFeedbackReceived` fires on Lesta;
- in-game UI: OpenWG Gameface's Python API on Lesta (`ModDynAccessor`, `gf_mod_inject`, `ViewModel._addStringProperty/_addCommand/_setString`, `WindowImpl(wndFlags=WindowFlags.WINDOW)`), that `mods/configs/res_map/*.json` is read from inside a `.mtmod`, the command argument shape (`{message}`), `viewEnv.getClientSizePx()`, rem scaling and the CSS Gameface supports (flex, `rgba()`), the hangar host views in `BUTTON_HOSTS`, how the injected `button.js` reaches its model (`window.subViews` / `window.model`), the ModsList `addModification` keywords, `InputHandler.g_instance.onKeyDown`, `BigWorld.wg_openWebBrowser`, and the `Warhelios` font name;
- client-settings components: the setting names and value formats `minimapSize`, `minimapAlpha`, `showVehModelsOnMap`, `minimapMaxViewRange`, `zoomSteps` (assumed a list of multipliers), `dynamicCamera`, `horStabilizationSnp`, `carouselType`, `doubleCarouselType`, the `arcade`/`sniper` reticle dicts with their part names and style indexes, `useServerAim`;
- hangar quick actions: `Vehicle.optDevices.installed`, `OptionalDevice.isRemovable`, `getInstallerProcessor(vehicle, device, slot, install=False)`, `TankmanUnload(vehicle)`, `Processor.request(callback)`, `IItemsCache.items.stats.tankmenBerthsCount/tankmenCount`;
- replay upload: `BattleReplay.g_replayCtrl._BattleReplay__replayDir`, the `replayEnabled` setting name and values, when the client appends the results block to the replay file, and that the header `dateTime` is local time (the replay auto names rely on the same header);
- round-2 components, checked against the RU 1.45 source but not run in the client: the chat layout overrides (`BattleLayout.addMessage/addCommand`, `_ChannelController._formatMessage`) and that a GUIFlash `<font>` stamp renders in the battle chat; `NotificationsModel.addNotification` being the only entry for server notifications; the Hangar view's name-mangled `_Hangar__onTeaserReceived` / `_Hangar__updateCarouselEventEntryState` and `IOffersBannerController.showBanners` (overrides apply from the next hangar view); `VehicleAuto*Processor.request` answering through the callback with `result.success`; `TankmanReturn` for a vehicle with `lastCrew`; `IServerStatsController.getStats()` in the hangar, `g_preDefinedHosts.getHostPingData(url)` for the current server; `VEHICLE_VIEW_STATE.FIRE`/`DEVICES` reaching `onVehicleStateUpdated` for the own vehicle; `items.vehicles.getVehicleType(cd).shortUserString`.

### Live-client smoke checklist

1. The Python log (`python.log`) shows `[OTMETKI] started <version>` and `[OTMETKI] feature <id> attached` for every installed feature.
2. The mod appears in the ModsSettingsAPI window, and binding with a code from the site succeeds.
3. After a random battle, `outbox_<id>.json` empties within about 15 s and the API shows the battle.
4. Selecting a tier 5+ vehicle sends a `moe_snapshot`. The in-battle panel appears when GUIFlash is installed.
5. With the network off, events stay in the outbox and are sent after reconnect.
6. With GUIFlash installed, a random battle shows the damage log, hit log, clock, team HP panels; shots at an enemy add hit-log lines; Ctrl-dragging a panel and re-entering battle keeps its position (`components.json`); the sixth-sense text appears with the vanilla lamp; after the battle a «Три отметки: победа/поражение…» notification appears in the hangar.
7. Round-2 components: in the hangar the clock/server/ping/online label appears (GUIFlash) and ticks; the marks history label shows the selected tier 5+ tank after one battle and the window's «История отметок» page lists it with details; the battle summary page shows the session row and a battle's details after a random battle; «Применить к выбранному танку» with auto repair «Включено» changes the ammunition panel's flag; «Вернуть прежний экипаж» after «Экипаж в казарму» brings the crew back; with `hide_promo` a promo pop-up no longer lands in the notification centre; the promo teaser and offer banners do not show after re-entering the hangar; in battle a repeated chat line from another player shows once, every line carries a time stamp, and with `battle_sounds.fire` set to a loaded Wwise event the sound plays when the own tank burns; with `auto_rename` on, the new replay gets the template name about 15–30 s after the results arrive, and the replay upload still finds it.
8. Hangar ratings (bound mod, GUIFlash): the «Мои рейтинги» label appears in the hangar with the account line; selecting another tank adds its line within a few seconds (`python.log` has no `hangar ratings` errors); after a random battle the session line changes about 20 s after the results; switching `metric_wn8` off in the window removes WN8 at once; «Обновить» re-reads; with the network off the label keeps the last values; after revoking the device on the site the next read shows the rebind notice.
9. With OpenWG Gameface installed (its Lesta build): after the one-time restart the hangar shows the «///» button (or the ModsList entry / Ctrl+Shift+T opens the window); switching a component off, choosing a minimap size and saving/loading a profile change `config.json`, the game's own minimap setting and `profiles.json`; the HUD editor moves a panel and the next battle shows it there; the replay manager lists own replays and «На сайте» opens the uploaded one.

## TODO

- A Gameface HUD backend (`core/client/hud/BACKENDS`) so the battle panels no longer need GUIFlash.
- A flash-free in-battle fallback when GUIFlash is absent. `GUI.Text` no longer exists in the 1.45 client stubs. Candidates are a Gameface (OpenWG) view or the battle `messages` controller.
- A smoke import of the client glue against the stubs from `IzeBerg/wot-src`. The smoke test uses hand-written stubs today.
- Profile sync with the site: a contract and endpoint for `profiles.json` (the settings-share contract excludes mods by design).
