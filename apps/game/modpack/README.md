# Three Marks modpack

Game-client modpack for «Мир танков» (Lesta, RU realm): Python 2.7 scripts the client loads from `mods/<client version>/`. It ships as `.mtmod` packages (Lesta 1.35+; `.wotmod` for WG clients): the core runtime, the companion, and one package per feature. The pre-split single package is still available as a build option.

It does the following, plus one opt-in:

- after each battle, it sends the player's own battle results to Three Marks in signed batches;
- it records marks-of-excellence (MoE) percentages for the player's own vehicles;
- in battle, it shows a movable MoE panel: the percent at the start and projected after the battle, the damage to 65/85/95%, the damage for +0.5% and the battles to the next mark (see [marks_panel](#marks_panel--moe-panel-in-battle));
- in the hangar, it shows the marks of the selected tank: the damage per battle to each mark and a battles forecast at the player's pace (see [hangar_marks](#hangar_marks--marks-in-the-hangar));
- in the hangar, it shows a session panel with battles, win rate, average damage and WN8;
- in the hangar, once bound, it shows the player's own site ratings (account, latest session, selected tank) read over signed `/mod/me` requests (see [hangar_ratings](#hangar_ratings--own-ratings-in-the-hangar));
- in battle, optional HUD components on a shared draggable panel layer: damage log (with the last-hit pop-up), hit log, clock and battle timer, team HP, sixth-sense alert, the tank's personal best, the «Основной калибр» counter, the battle's efficiency, the own consumables, the own gun's reload, the hits on the own tank, the card of the own death, the own equipment and the own gun's traverse limits; plus event sounds for the player's own vehicle, a battle chat filter, a streamer mode and the 15 m circle (see [Battle HUD](#battle-hud) and [Battle extras](#battle-extras));
- in the hangar and in battle, once bound, the goals the player set on the site (see [session_goals](#session_goals--goals-from-the-site));
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
      durable/                the settings files mirrored into %APPDATA%\TriOtmetki (see "Durable settings")
      codec/                  JSON on the stdlib: canonical form, request/response bodies, Retry-After
      net/                    transport/ (fetch-free HTTP on a worker thread, BackgroundRunner), signing/ (HMAC v2,
                              clock offset), backoff/ (exponential retry with jitter)
      i18n/ log/              string catalog and translator; [OTMETKI] log lines (native str on both Pythons) and safe();
                              an identical traceback is written once a minute, then with the count held back
      format/                 panel text: GUIFlash <font>, the shared palette (and the marks colour ramp), numbers, percentages, times,
                              strip_tags/single_spaces
      moe/                    marks-of-excellence maths the marks views share: EMA and its inverse, ThresholdCurve, moe_state (every
                              value a view shows), moe_macros/moe_color, PaceBook (the pace of the last own battles), ThresholdCache
      me/                     the bound account's own /mod/me reads: request bodies, answer parsing that drops other accounts
                              (ratings, career records, WN8 expected values), retry delays, ReadState (keyed read bookkeeping)
      teams/                  TeamHp: both teams' HP as the client shows it (team HP panel, «Основной калибр» counter)
      classes/                vehicle class tags -> the short keys the features' strings use
      templates/              {macro} panel templates (string.Template)
      hud/                    battle HUD layer: panel/ (per-panel schema), config/ (components.json), backend/ (renderer
                              interface, BackendChain), layer/ (HudLayer), edit/ (HudPreview: the panels' side of hud_edit/
                              hud_describe), surface/ (HudSurface: the labels as the Gameface HUD page's state, its messages back)
      shells/                 shell types from the battle feedback (1.45 IntEnum, name or index) -> short codes
      native_settings/        component values -> the player's own client settings ('native' keeps the game's value)
      replay_file/            JSON header blocks of the client's own replay files (upload and manager)
      vendor/                 pinned py2.7 libraries (six 1.17.0, blinker 1.5, attrs 21.4.0, enum34 1.1.10) + licenses/;
                              written by tools/vendor/vendor.py, never edited by hand
      client/                 client glue: ui/ (hangar labels, system messages), transport/ (BigWorld.fetchURL), game/
                              (client version, language, vehicle and map reads, client_attr, service, values_by_name,
                              selected_vehicle), component/ (FeatureComponent: strings, components.json section, switch),
                              hud/ (shared HudLayer, gameface/ and guiflash/ backends, space/, panel/ BattlePanel), moe/ (moe_service: the site curves and the pace), battle/ (session reads, waiting
                              subscriptions, teams/ TeamTracker), native/ (settings core, NativeSettingsComponent), garage/ (lock flags, the
                              client's item processors), timer/ (Ticker on BigWorld.callback, elapsed() for countdowns), hotkey/
                              (Hotkey on InputHandler.onKeyDown), chat/ (the battle chat classes, is_own), replays/, me/ (post_signed, tank_ratings:
                              the shared /mod/me/tanks read), sound/ (play_sound, play_mp3: our MP3 through the custom-MP3 event)
    ui/                     -> gui/mods/otmetki/ui              in-game UI (own package net.triotmetki.ui, see "In-game UI")
      protocol/ fields/ components/ profiles/ hud_edit/ bridge/ i18n/   pure: the whole window as state out, messages in
      client/                 glue: Gameface window, hangar button, ModsList entry, hotkey, the bridge context
      gameface/               the built ui-web bundles (committed; `bun run ui:build` rewrites them)
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
    marks_panel/            in-battle MoE panel: a BattlePanel with styles, templates and every target (core/moe does the maths)
    hangar_marks/           the selected tank's marks in the hangar: damage per target, battles forecast
    session_stats/          hangar session panel and the session id on battle results
    replay_upload/          opt-in replay auto-upload (model/: queue, upload, files lookup/multipart, constants)
    damage_log/ hit_log/ battle_clock/ team_hp/ sixth_sense/ battle_results/ personal_best/ main_gun/ battle_efficiency/
    consumables/ reload_timer/ received_hits/ death_card/ battle_loadout/ gun_arc/
                            battle HUD components (see "Battle HUD"); each is model/ client/ settings/ i18n/ packages
    battle_sounds/ chat_filter/ streamer_mode/ bush_circle/
                            battle extras without a panel (see "Battle extras")
    replay_manager/ hangar_tweaks/ minimap/ camera/ crosshair/ hangar_info/ marks_history/ auto_resupply/
    notification_filter/ hangar_cleaner/ hangar_ratings/ hangar_marks/ session_goals/ personal_missions/ platoon_helper/ tilt_guard/
    battle_hits/
                            hangar and client-settings components (see "Hangar and client-settings components")
  ui-web/                   source of the Gameface page and hangar button (preact, nanostores, zod/mini, clsx, SCSS modules; Vite)
  tools/
    build/                  build.py (CLI), layout.py (what goes where), archive.py (zip + meta.xml), compilers.py,
                            setupkit/ (the component catalogue build: components.json + previews for the manager and МОСТ)
    vendor/vendor.py        re-vendors packages/core/vendor from the pinned PyPI wheels (sha256); --check compares
    testing/_support.py     maps the repo onto the otmetki package; fixtures, schema validators
    tests/                  cross-package tests: py2.7 compat scan, layout, client import smoke
    run_tests.py            runs every suite with the standard library only (also on Python 2.7)
  catalog/                  the component catalogue: catalog.json (titles, presets, fair-play notes), previews/, screenshots/ (catalog/README.md)
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

| What                    | Hook                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Learnt from                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Own battle results      | `PlayerEvents.g_playerEvents.onBattleResultsReceived(isPlayerVehicle, results)`. After an early exit the mod never requests results itself: it reads what the game already saved on disk (`account_helpers.BattleResultsCache.load(account.name, arenaUniqueID)` + `convertToFullForm`, no server call) on `IBattleResultsService.onResultPosted` and every 10 s in the hangar for arenas of this run. `battleResultsCache.get` is never called: it sends `CMD_REQ_BATTLE_RESULTS` and makes the game's own results window fail with `RES_COOLDOWN` while it waits. | wotstat-analytics `onBattleResultLogger.py` (same two-path approach), RU client source            |
| Result fields           | `results['personal'][<intCD>]`: `damageDealt`, `damageAssistedRadio`/`Track`/`Stun`, `damageBlockedByArmor`, `spotted`, `kills`, `shots`, `directEnemyHits`, `piercingEnemyHits`, `xp`, `credits`, `lifeTime`, `deathReason`, and post-battle `marksOnGun`/`damageRating`/`movingAvgDamage` (VEHICLE_SELF). `results['common']` holds arena and duration.                                                                                                                                                                                                           | `battle_results/battle_results_common.py` in the RU client source mirror                          |
| Hangar MoE              | `g_currentVehicle.getDossier().getRecordValue(ACHIEVEMENT_BLOCK.TOTAL, 'damageRating' / 'movingAvgDamage' / 'marksOnGun')`, refreshed on `g_currentVehicle.onChanged`                                                                                                                                                                                                                                                                                                                                                                                               | spoter `mod_marksOnGunExtended` (WTFPL), `dossiers2/custom/records.py`                            |
| MoE distribution        | not requested. The account command `CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION` exists in `common/AccountCommands.py` but no RU 1.45 client code sends it, so it is a private, unverifiable call. MoE thresholds come from public data: the own dossier (`moe_snapshot`), own battle results and the site's aggregates.                                                                                                                                                                                                                                                    | wotstat-analytics `moeLogger.py`                                                                  |
| In-battle damage/assist | `guiSessionProvider.shared.feedback.onPlayerFeedbackReceived`, using `BATTLE_EVENT_TYPE.DAMAGE/RADIO_ASSIST/TRACK_ASSIST/STUN_ASSIST` and `extra.getDamage()`. It only counts while the controlled vehicle is the player's own.                                                                                                                                                                                                                                                                                                                                     | spoter `mod_marksOnGunExtended`, `feedback_adaptor.py`                                            |
| MoE formula             | EMA with k = 2/(100+1) over `damage + max(radio, track, stun)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | spoter `mod_marksOnGunExtended`                                                                   |
| Queue time              | `g_playerEvents.onEnqueued(queueType)`, `onDequeued(queueType)`, `onArenaCreated()`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `Account.py` / `PlayerEvents.py`, RU client                                                       |
| Battle start/end        | `g_playerEvents.onAvatarReady`, `onAvatarBecomeNonPlayer`. Replays are skipped with `BattleReplay.isPlaying()`.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `Avatar.py`, RU client                                                                            |
| Account                 | `BigWorld.player().databaseID` on `onAccountShowGUI`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `Account.py`, `connection_mgr.py`                                                                 |
| HTTP                    | `BigWorld.fetchURL(url, cb, headers=, timeout=, method=, postData=)`, which is asynchronous on the main thread; the response's headers are a method, `response.headers()` (RU 1.45 `gui/platform/base/request.py`), read by `core.net.transport.response_headers`. Fallback: `core.net.transport.ThreadTransport`, a urllib daemon thread (a `BackgroundRunner`) whose results the main-thread tick drains, so no BigWorld call ever runs off the main thread.                                                                                                      | wotstat-analytics `asyncResponse.py`                                                              |
| Settings                | `gui.modsSettingsApi.g_modsSettingsApi`: `getModSettings`, `setModTemplate`, `registerCallback`, a `TextInput` with a button for the binding code                                                                                                                                                                                                                                                                                                                                                                                                                   | izeberg/modssettingsapi example + `templates.py`                                                  |
| Panels                  | OpenWG Gameface first: one wulf `WindowImpl(wndFlags=WindowFlags.WINDOW, layer=WindowLayer.WINDOW)` with the ui package's `hud.html` (`openwg_gameface.res_id_by_key('otmetki/ui/hud')`), state pushed through a `ViewModel` string property; else `gui.mods.gambiter.g_guiFlash.createComponent(alias, COMPONENT_TYPE.LABEL, props, battle=, lobby=)`/`updateComponent`/`deleteComponent`                                                                                                                                                                          | GambitER/GUIFlash (MIT)                                                                           |
| Panel drag              | `gui.mods.gambiter.flash.COMPONENT_EVENT.UPDATED(alias, props)`, fired by GUIFlash's `py_update` when the player drags a label; the HUD layer saves `x`/`y` to components.json                                                                                                                                                                                                                                                                                                                                                                                      | GUIFlash `flash.py`                                                                               |
| Damage log              | `feedback.onPlayerFeedbackReceived`: `BATTLE_EVENT_TYPE.DAMAGE/RADIO_ASSIST/TRACK_ASSIST/STUN_ASSIST/TANKING/RECEIVED_DAMAGE`, `extra.getDamage()`, `extra.getShellType()` (a `BATTLE_LOG_SHELL_TYPES` IntEnum member); `feedback.onPlayerSummaryFeedbackReceived` (`getTotalDamage/AssistDamage/BlockedDamage/StunDamage`)                                                                                                                                                                                                                                         | `feedback_events.py`, `feedback_adaptor.py`, RU 1.45                                              |
| Hit log                 | `feedback.onVehicleFeedbackReceived(eventID, vehicleID, value)` with the marker hit states `FEEDBACK_EVENT_ID.VEHICLE_HIT/RICOCHET/ARMOR_PIERCED/CRITICAL_HIT*/ARMOR_SCREEN_BLOCKED/TRACK_BLOCKED/WHEEL_BLOCKED/ARMOR_MISSED` (the client sends them only for the controlling vehicle's own shots: `Vehicle.showDamageFromShot` → `updateMarkerHitState`), `VEHICLE_HEALTH`; `BATTLE_EVENT_TYPE.DAMAGE/CRIT` with `extra.isShot()`                                                                                                                                  | `Vehicle.py`, `feedback_adaptor.py`, `battle_constants.MARKER_HIT_STATE`, RU 1.45                 |
| Team HP                 | `sessionProvider.getArenaDP().getVehiclesInfoIterator()` (`vehicleID`, `team`, `vehicleType.maxHealth`, `isAlive()`); `feedback.onVehicleFeedbackReceived` `VEHICLE_HEALTH` `(newHealth, attackerInfo, reason)` / `VEHICLE_DEAD`; own vehicle `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.HEALTH, hp)`; `arena.onVehicleKilled`, `arena.onVehicleAdded`                                                                                                                                                                                                  | `arena_dp.py`, `arena_vos.py`, `battle_session.setVehicleHealth`, `ClientArena.py`                |
| Battle clock            | `BigWorld.player().arena.period` / `periodEndTime` (`constants.ARENA_PERIOD`), `BigWorld.serverTime()`                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `ClientArena.py`, `constants.py`, RU 1.45                                                         |
| Sixth sense             | `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.OBSERVED_BY_ENEMY, isObserved)` (what the vanilla lamp listens to; `SWITCHING` resets); sound `SoundGroups.g_instance.playSound2D(event)`                                                                                                                                                                                                                                                                                                                                                                    | `Avatar.onObservedByEnemy`, `indicators.py`, `SoundGroups.py`, RU 1.45                            |
| Battle summary          | the companion's own `battle_event(event, now)` bus event (built from the `personal` block) and `marks.hangar_moe` from before the battle; map label `ArenaType.g_cache[...].name`; `SystemMessages.pushMessage`                                                                                                                                                                                                                                                                                                                                                     | companion `payload.py`                                                                            |
| Battle sounds           | `vehicleState.onVehicleStateUpdated(VEHICLE_VIEW_STATE.FIRE, bool)` and `(VEHICLE_VIEW_STATE.DEVICES, (deviceName, 'critical' / 'destroyed' / 'repaired' / 'normal', actualState))` (what the damage panel shows); `arena.onVehicleKilled(victimID, killerID, ...)` (the kill feed)                                                                                                                                                                                                                                                                                 | `Avatar.__showDamageIconAndPlaySound`, `damage_panel.py`, RU 1.45                                 |
| Chat filter             | overrides of `messenger.gui.Scaleform.channels.layout.BattleLayout.addMessage(message, doFormatting)` / `addCommand(command)` and `bw_chat2.battle_controllers._ChannelController._formatMessage`; own lines by `messenger.ext.player_helpers.isCurrentPlayer(avatarSessionID)` / `command.isSender()`                                                                                                                                                                                                                                                              | `layout.py`, `battle_controllers.py`, RU 1.45                                                     |
| Notification filter     | override of `notification.NotificationsModel.NotificationsModel.addNotification(notification)`, `notification.getType()` against `notification.settings.NOTIFICATION_TYPE` names; a number shared by two names (1.45: `AUCTION_STAGE_START` = `TRADING_CARAVAN_REFILL` = 19) is told apart by the notification's decorator class                                                                                                                                                                                                                                    | `NotificationsModel.py`, `settings.py`, `decorators.py`, RU 1.45                                  |
| Hangar cleaner          | overrides of `Hangar._Hangar__onTeaserReceived` (promo teaser) and `Hangar._Hangar__updateCarouselEventEntryState` (`as_updateCarouselEventEntryStateS(False)`), installed only on a client version listed in `model.VERIFIED_CLIENTS` (1.45) and only when the class itself defines them, else left alone with a startup log line; `IOffersBannerController.showBanners` (`skeletons.gui.offers`) and `OfferBannerWindow.tryLoad(offerID, controller)` (`gui.impl.lobby.offers.offer_banner_window`, the end of every banner load path)                            | `lobby/hangar/Hangar.py`, RU 1.45                                                                 |
| Hangar info             | `IConnectionManager.serverUserNameShort` / `.url` (`skeletons.connection_mgr`), `predefined_hosts.g_preDefinedHosts.requestPing()` / `getHostPingData(url).value` (-1 = unknown), `IServerStatsController.getStats()` -> `(cluster, region, type)`                                                                                                                                                                                                                                                                                                                  | `connection_mgr.py`, `predefined_hosts.py`, `game_control/ServerStats.py`, RU 1.45                |
| Auto-resupply           | `Vehicle.isAutoRepair` / `isAutoLoad` / `isAutoEquip` (properties), `isAutoBattleBoosterEquip()`; `gui.shared.gui_items.processors.vehicle.VehicleAutoRepairProcessor` / `VehicleAutoLoadProcessor` / `VehicleAutoEquipProcessor` / `VehicleAutoBattleBoosterEquipProcessor(vehicle, value).request(cb)`; `IItemsCache.items.getVehicles(REQ_CRITERIA.INVENTORY)`                                                                                                                                                                                                   | `gui_items/Vehicle.py`, `processors/vehicle.py`, `requesters/ItemsRequester.py`, RU 1.45          |
| Crew quick actions      | `processors.tankman.TankmanUnload(vehicleInvID)`, `TankmanReturn(vehicle)` (the "return crew" button, needs `vehicle.lastCrew`); `processors.module.getInstallerProcessor(vehicle, item, slotIdx, install=False)`                                                                                                                                                                                                                                                                                                                                                   | `processors/tankman.py`, `processors/module.py`, RU 1.45                                          |
| Personal best           | `g_currentVehicle.getDossier().getRandomStats()` `getMaxDamage` / `getMaxAssisted` / `getMaxFrags` / `getMaxXp` (the dossier's `max15x15` block, random battles); `BATTLE_EVENT_TYPE.KILL` for the live frags                                                                                                                                                                                                                                                                                                                                                       | `gui/shared/gui_items/dossier/stats.py`, `dossiers2/custom/battle_statistics_layouts.py`, RU 1.45 |
| Damage source, last hit | the own `RECEIVED_DAMAGE` extra's `isShot` / `isFire` / `isRam` / `isWorldCollision` / `isDeathZone`; the attacker's `vehicleType.classTag` from the arena data; the own `VEHICLE_VIEW_STATE.DEVICES` `('ammoBay', 'critical'/'destroyed', …)` within 1.5 s marks the ammo-rack hit                                                                                                                                                                                                                                                                                 | `feedback_events._DamageExtra`, `arena_vos.py`, `damage_panel.py`, RU 1.45                        |
| High Caliber            | `arena_achievements.ACHIEVEMENT_CONDITIONS['mainGun']` (`minDamage` 1000, `minDamageToTotalHealthRatio` 0.2); enemy HP as for team HP                                                                                                                                                                                                                                                                                                                                                                                                                               | `common/arena_achievements.py`, RU 1.45                                                           |
| Consumables, reload     | `guiSessionProvider.shared.equipments`: `getOrderedEquipmentsLayout()`, `onEquipmentAdded/Updated(intCD, item)`, `item.getDescriptor().userString`, `getQuantity()`, `isReady`, `getTimeRemaining()`; `shared.ammo`: `getOrderedShellsLayout()`, `onShellsAdded/Updated`, `getGunSettings().clip.size`, `getCurrentShellCD()`, `getShells(intCD)`, `onGunReloadTimeSet(shellCD, snapshot, skipAutoLoader)` with `snapshot.getTimeLeft()` / `getBaseValue()`                                                                                                         | `consumables/equipment_ctrl.py`, `consumables/ammo_ctrl.py`, RU 1.45                              |
| Hangar vehicle info     | `Tankman.getNextSkillXpCost()`, `roleUserName`; `lobbyContext.getServerSettings().getRandomBattleLevelsForDemonstrator()` (by vehicle name, else `[type][level - 1]`); accelerated training = `isPremium or isElite`                                                                                                                                                                                                                                                                                                                                                | `gui_items/Tankman.py`, `DemonstratorWindow.py`, `crew_widget.py`, RU 1.45                        |
| Style removal           | `processors.common.OutfitApplier(vehicle, ((Outfit(component=CustomizationOutfit(), vehicleCD=…), SeasonType.ALL),))`, `Vehicle.isStyleInstalled`                                                                                                                                                                                                                                                                                                                                                                                                                   | `customization/context/styled_mode._sellItem`, RU 1.45                                            |
| Interface scale         | settings core `interfaceScale`, written as the index into `settingsCore.interfaceScale.getScaleOptions()`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `settings_core/options.InterfaceScaleSetting`, `InterfaceScaleManager.py`, RU 1.45                |
| Own MP3 sounds          | `WWISE.WW_prepareMP3('<name>.mp3')` (from `res/audioww/`), then `SoundGroups.g_instance.getSound2D('sixthSense').play()`                                                                                                                                                                                                                                                                                                                                                                                                                                            | `SoundGroups.prepareMP3`, `indicators.__playSoundEvent`, RU 1.45                                  |

Client source reference: [IzeBerg/wot-src](https://github.com/IzeBerg/wot-src), branch `RU` (Lesta client 1.45.0.8259 at the time of writing).

### References and licences

- [wotstat/wotstat-analytics](https://github.com/wotstat/wotstat-analytics) has **no licence**. We studied its patterns (hooks, batching, `fetchURL`, build script) and copied no code.
- [spoter/spoter-mods](https://github.com/spoter/spoter-mods) is **WTFPL**. We re-implemented the MoE EMA formula and the feedback-event accumulation as small pure functions.
- [izeberg/modssettingsapi](https://github.com/IzeBerg/modssettingsapi) is **CC BY-NC-SA 4.0**. It is an optional runtime dependency: we call its API and do not bundle it. Its `build.py` showed the `.wotmod` layout: stored zip, explicit directory entries, `meta.xml`.
- [wot-public-mods/mods-list](https://gitlab.com/wot-public-mods/mods-list) (poliroid, **MIT**) is a transitive dependency of ModsSettingsAPI. It needs OpenWG Gameface.
- [GambitER/GUIFlash](https://github.com/GambitER/GUIFlash) is **MIT**. Its last release, 0.3.1 (2019; the [spoter fork](https://github.com/spoter/GUIFlash) carries the same code and the same MIT licence), does not import on Lesta 1.45: `flash.py` imports `ViewTypes` from `gui.Scaleform.framework`, which 1.45 replaced with `WindowLayer`. The maintained fork [CH4MPi/GUIFlash](https://github.com/CH4MPi/GUIFlash) (MIT, © GambitER, CH4MPi, Kurzdor, StranikS_Scan) ships `gambiter.guiflash_0.6.6.mtmod` (2026-09-01, sha256 `a0b6dc2e75663008a4ced9e0c00449be84b3c3d5d932f8bbcaa2b334ae3d1cb5`), imports `WindowLayer` and draws labels in the hangar too. It is an optional runtime dependency, the second HUD renderer. MIT allows redistribution with the copyright and licence notice, so the manager may install that release file as is (with its LICENSE); we do not vendor it into our packages.
- [openwg/wot.gameface](https://gitlab.com/openwg/wot.gameface) (`openwg_gameface`, **MIT**) registers the ui package's pages on Lesta (`mods/configs/res_map/*.json`, one client restart) and injects scripts into client views. It has no battle overlay of its own: the HUD window is the client's wulf `WindowImpl`. Optional runtime dependency, the first HUD renderer.

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
5. **MoE panel.** When a vehicle is selected in the hangar, the mod fetches `GET /v1/moe/{tank_id}` (`core/client/moe`, shared by the panel and the hangar view) and caches it for 6 h (a failed read is retried after 10 min and keeps the older curve). In battle, the panel shows (see [marks_panel](#marks_panel--moe-panel-in-battle)):
   - the percent at the start of the battle from the dossier, and the projection: the dossier percent plus the curve's change between the EMA before and after this battle;
   - the combined damage still needed this battle for 65/85/95% (and 100% when it is next), and for +0.1/0.5/1%;
   - the battles to the next mark at the pace of the player's own last battles on the tank.

## Payload contract (summary)

The API team implements the full contract in [contract/](contract):

- [contract/ingest.schema.json](contract/ingest.schema.json)
- [contract/bind.schema.json](contract/bind.schema.json)
- [contract/moe-thresholds.schema.json](contract/moe-thresholds.schema.json)
- [contract/settings.schema.json](contract/settings.schema.json)
- [contract/replay-upload.schema.json](contract/replay-upload.schema.json)
- [contract/ratings.schema.json](contract/ratings.schema.json) (the own-ratings reads `/mod/me/overview` and `/mod/me/tanks`, a tank row with its optional `records` and `expected`)
- [contract/goals.schema.json](contract/goals.schema.json) (`/mod/me/goals`), [contract/replay-analysis.schema.json](contract/replay-analysis.schema.json) (`/mod/me/replays`), [contract/session-share.schema.json](contract/session-share.schema.json) (`/mod/me/session-share`, `/mod/me/session-share/send`)
- the examples [contract/examples/ingest.example.json](contract/examples/ingest.example.json), [ratings-overview.example.json](contract/examples/ratings-overview.example.json), [ratings-tanks.example.json](contract/examples/ratings-tanks.example.json), [goals.example.json](contract/examples/goals.example.json), [replay-analysis.example.json](contract/examples/replay-analysis.example.json) and [session-share.example.json](contract/examples/session-share.example.json)

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
  - `platoon` (optional, null when solo): `{size}` — the size of the own platoon after the battle, counted from the players with the own `prebattleID` on the own team. No other player's account id or name leaves the client (`test_payload.test_platoon_counts_own_team_mates_and_sends_no_ids`).
  - `shots` (optional, null when off or none): own shots that damaged an enemy, from the player feedback events — `damage`, `nominal` (armour damage of the own shell), `shell`, `outcome`, `distance_m` (null: the mod reads no enemy positions), `fatal`. Feeds «Честный рандом».
- **`moe_snapshot`:** `tank_id`, `damage_rating`, `moving_avg_damage`, `marks_on_gun`, `battles`.
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

## Session report sharing (opt-in)

Switches: `share_session_report` (off by default; does nothing until the mod is bound) and `share_session_channel` (`telegram` (default), `discord`, `both`), in the session panel's card. Profiles and codes never carry `share_session_report`. Contract: [contract/session-share.schema.json](contract/session-share.schema.json). A 409 `channel_not_linked` on the switch shows one notice («привяжите выбранный канал на сайте») and the mod stops asking until the switch or the channel changes (or the next game session); other failures retry after 5 minutes.

- **Server flag:** when the player turns it on (or changes the channel), the hangar posts `POST /mod/me/session-share` `{device_id, account_id, enabled, channels}`; while the flag is on, the server posts the session card to the player's own Telegram / Discord linked on the site when the live session ends. Turning it off posts `enabled: false`. A failed post is retried every 5 min in the hangar; the last value the server took is kept in `state.json` (`session_share_synced`), and nothing is posted before the player turned it on once.
- **Button:** «Отправить отчёт о сессии» (confirmed) posts `POST /mod/me/session-share/send` `{device_id, account_id, session_id, channels}` for the current session (at least one random battle).
- The mod sends no battle data here: the server builds the card from the account's own battles it already has.

## Replay auto-upload

Switches: `upload_replays` (off by default; does nothing until the mod is bound) and `publish_replays` (off by default: uploads are private). Feature `features/replay_upload`: pure logic in `model/` (`files` lookup and multipart, `queue`, `upload`, `constants`; the header reader is `core/replay_file`); client glue in `client/`. Contract: [contract/replay-upload.schema.json](contract/replay-upload.schema.json).

1. **Respecting the game setting.** The mod never enables recording. If the client's replay setting (`replayEnabled` in the settings core) reads as off, nothing is queued; if it cannot be read, the mod just looks for a file and gives up when none appears.
2. **Queue.** When the player's own battle results arrive (the same hook as `battle_result`, never during replay playback), the battle is queued in `replays_<account_id>.json`: `arenaUniqueID`, account, local start time (from `onAvatarReady`, else `arenaCreateTime` corrected by the clock offset). The queue deduplicates by `arenaUniqueID` against pending items and the last 500 finished ones, holds at most 50 battles and forgets a battle after 7 days. It survives a client restart.
3. **Finding the file.** From 30 s after the battle, in the hangar only, the mod scans the client replay folder (`BattleReplay`'s replay dir, else `replays/`) for `.wotreplay`/`.mtreplay` files, skipping `temp.wotreplay` and anything older than the battle. It reads only the JSON header blocks: the file matches when `playerID` is the bound account and the results block names the same `arenaUniqueID`; a replay without a results block (left before the end) matches by its `dateTime` within 5 minutes of the battle start. A file modified in the last 5 s is still being written and is retried in 15 s. With the "last battle only" setting the file is overwritten by the next battle, and the header check then refuses it. No match within 30 minutes drops the battle.
4. **Upload.** One upload at a time, on a background thread (`BackgroundRunner` + blocking `SyncTransport`, 120 s timeout); the main thread only starts jobs and applies results. The file is refused above **50 MiB** (`max_bytes` in the contract, same as the server) before it is read. It is posted as `multipart/form-data` (one part named `file`) to `POST /replays/mod`, with the `/mod/ingest` headers, `X-Otmetki-Visibility` and `signing.signed_request`; the HMAC covers the raw file bytes (`"v2\nPOST\n/replays/mod\n<timestamp>\n<nonce>\nx-otmetki-visibility:<visibility>\n" + file`), because that is what the server verifies. A 428 re-syncs the clock from `X-Otmetki-Server-Time` or `Date` and re-signs once. The server has no chunked or resumable upload, so the file goes in one request. Entering a battle pauses the uploader: nothing new starts, and a running upload stops at its next 8 KiB block (`core.net.transport.StoppableBody`, sent with a Content-Length); it is sent again from the hangar without a backoff. A replay renamed between the search and the read is searched for again by its header once.
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

Sixteen components (the MoE panel and fifteen others; the damage log's last-hit pop-up is a second panel of its package), each its own feature package (`features/<id>/`, own `.mtmod`, depends on core and companion) with a switch in `config.json` (on by default) and its own section in `mods/configs/otmetki/components.json`. They follow the research's "who does it best": XVM for template-formatted logs, Battle Observer for team HP and the clock (Battle Observer does not run on Lesta), everyone's sixth-sense lamp without the forbidden "nearest enemy".

### The HUD layer (core)

- **`core/hud/`** (pure): `HudLayer` (`register(panel_id, schema)`, `show(panel_id, text)`, `hide`, `hide_all`, `update_settings`, `on_moved`), `ComponentConfig` (components.json: one schema-checked section per component; sections of components that are not installed are kept), `panel_schema(...)` (the common layout keys plus the panel's own), `HudBackend` (the renderer interface), `render(template, values)` (`{macro}` templates on the standard library's `string.Template`; `{{` is a literal brace, an unknown macro stays as written).
- **Common panel keys** (every panel section): `x`, `y` (-4000..4000), `align_x` (`left`/`center`/`right`), `align_y` (`top`/`center`/`bottom`), `alpha` (0..100), `font_size` (8..48), `drag`, `border`. The on/off switch stays in `config.json` (the companion schema), so the settings window keeps working while a component is not installed.
- **Dragging:** hold Ctrl for the cursor and drag a panel; the renderer reports the new position (the Gameface page sends `moved` with the nearest anchor, GUIFlash fires `COMPONENT_EVENT.UPDATED` with `x`/`y`) and the layer writes `x`/`y` (and `align_x`/`align_y` when sent) into the panel's section, so it comes back there next battle.
- **Updates:** `show()` sends a text only when it changed; `place(panel_id, x, y)` moves a shown panel for now without touching components.json (the crosshair mark follows the reticle through it).
- **Renderer:** `core/client/hud/` builds a `BackendChain` of the installed backends in `BACKENDS` order, **OpenWG Gameface, then GUIFlash**; the layer and the hangar labels (`app.ui`) share it. Each label goes to the first backend available when it is created and stays there. The log names what was installed and why a backend was left out (`HUD: GUIFlash: No module named ...`).
  - **Gameface** (`core/client/hud/gameface`): available when `frameworks.wulf`, `gui.impl.pub` and `openwg_gameface` import and `res_id_by_key('otmetki/ui/hud')` resolves (the ui package ships the page; OpenWG Gameface validated its res_map). It opens one transparent `WindowImpl` (`WindowFlags.WINDOW`, `WindowLayer.WINDOW`) with `hud.html` while a label of the current space exists and closes it when none is left. `core/hud/surface.HudSurface` keeps the labels with the GUI space they were created in (a hangar label never shows in battle) and encodes `{v, cursor, panels: [{id, text, x, y, align_x, align_y, alpha, drag, border, visible}]}` into the view model's `state`; the page answers `ready` and `moved`. `cursor` is true in the hangar and while the battle cursor is shown (`GameEvent.SHOW_CURSOR`/`HIDE_CURSOR`), and only then can a draggable panel take the mouse. A window that fails to open marks the backend broken and the chain moves on to GUIFlash.
  - **GUIFlash** (`core/client/hud/guiflash`): CH4MPi's 0.6.x (see [References and licences](#references-and-licences)); a label is created with `battle=`/`lobby=` for the space it belongs to, and with `isHtml`/`multiline` so several lines render. A pre-0.6 build (no `lobby` argument) draws in battle only, so hangar labels fall back to system messages there.
  - **None:** `NullBackend` keeps every panel hidden; the battle summary still works (system messages).
- **Settings UI:** a settings window reads `hud_layer(app).schemas` / `.panels` and writes through `hud_layer(app).update_settings(panel_id, values)` (a shown panel moves at once).
- Components start on the app's `battle_ready` (own battles, never replays; the clock on `battle_enter`) and hide on `battle_leave`: each panel is a `core/client/hud/panel.BattlePanel` (`start`, `stop`, `render`; the base registers the panel, its `HudPreview` and the lifecycle). Battle-session events are subscribed through its `hooks` (`core/client/battle.BattleHooks`), which retries for 20 s while the session is not ready and unsubscribes everything on leave; tick loops use `core/client/timer.Ticker` (a countdown subtracts `ticker.elapsed()`, the game time since the previous tick, never the interval).

### marks_panel — MoE panel in battle

- **What:** a `BattlePanel` (`marks_panel`, movable in the HUD editor, preview in the edit mode): the dossier percent at the start of the battle, the projection after it and the change, the combined damage this battle (damage + the best of radio, track and stun assist) and the average before and after, the damage still needed this battle for 65/85/95% (✓ once reached; 100% when it is next), the damage for +`step` percent, and the battles to the next mark at the player's pace (`∞` when the pace never gets there, `-` before three own battles on the tank). The maths are `core/moe` (shared with [hangar_marks](#hangar_marks--marks-in-the-hangar)).
- **Data:** the tank's dossier snapshot from the hangar (`app.marks.hangar_moe`), the site curve (`GET /v1/moe/<tank_id>`), the player's own `onPlayerFeedbackReceived` events (they carry only the player's own events, so assist earned after death while the camera follows an ally still counts) raised to the client's end-of-life summary (`getTotalDamage`, `getTotalStunDamage`), and the pace: the combined damage of the last 20 own battles per tank from the companion's `battle_event` (kept in `state.json` as `moe_pace`).
- **Fair play:** own damage and assist only, as in the battle results. Team damage is not counted.
- **Switch:** `battle_moe_panel`. **Section `marks_panel`:** `style` (`extended`, `compact`, `minimal`, `custom`), `template` (for `custom`), `show_targets`, `show_battle`, `show_step`, `show_battles`, `step` (`0.1`, `0.5`, `1`), `color_mode` (`delta`: green up / red down; `mark`: the colour of the mark the percent is at; `off`), plus the common panel keys. Default position: top centre.
- **Macros:** `{title}` `{percent}` `{projected}` `{delta}` `{damage}` `{ema}` `{ema_projected}` `{marks}` `{stars}` `{next}` `{need_next}` `{target_next}` `{need65}` `{need85}` `{need95}` `{need100}` `{target65}` `{target85}` `{target95}` `{target100}` `{step}` `{step_need}` `{battles}` `{pace}`.
- **Against «Три отметки на стволе» (ПРОТанки, spoter/Yusha «Marks on Gun Extended»):** the same movable, colour-coded panel with every target, the start percent, the step damage and templates; on top of it the battles forecast, the hangar twin, the settings window and the HUD editor, and the curve from the site instead of a bundled table.

### damage_log — damage log

- **What:** totals of the player's own damage dealt, damage blocked by armour, assistance (radio + track + stun) and damage received, plus the latest entries (kind, amount, vehicle short name, shell). The client's own end-of-life summary (`onPlayerSummaryFeedbackReceived`) raises the totals to at least its values.
- **Fair play:** the same feedback events that drive the vanilla damage log and ribbons (`onPlayerFeedbackReceived` carries only the player's own events, so assist earned after death still counts). Damage to allies is not counted as dealt.
- **Received damage:** the source from the own event's extra (`shot`, `fire`, `ram`, `world` for a fall or a death zone, `other`), the ammo rack when the own damage panel reports `ammoBay` damaged within 1.5 s of the hit (either order), and the attacker's class glyph (`class_light` … `class_spg`, `assets/otmetki/damage_log`; the dealt entries carry the target's class the same way).
- **Last hit (`last_hit`):** a second panel of the package, fed by the damage log: the last hit the player took (class glyph, attacker, damage, shell, source), hidden after `timeout_s`. Its own card and section (`enabled`, `timeout_s` 1..15, `show_class`, `template` with `{class}`, `{vehicle}`, `{amount}`, `{shell}`, `{source}`); it runs while `battle_damage_log` is on. Default position: centre, above the reticle.
- **Switch:** `battle_damage_log`. **Section `damage_log`:** `style` (`full`, `compact`, `minimal`, `custom`), `template` (for `custom`), `show_log`, `log_lines` (0..15), `log_kinds` (`all`, `dealt`, `received`), `entry_template` (empty = built-in), `palette` (`classic`, `graphite` (default, design tokens), `contrast`, `colorblind` (Okabe-Ito)), `kind_icons` (our glyphs before each entry, `assets/otmetki/damage_log`), `kind_colors` (each entry in its kind's colour), `color_damage`, `color_assist`, `color_blocked`, `color_received` (`#RRGGBB`; empty = the palette's colour). Default position: bottom left.
- **Macros:** totals `{dealt}`, `{blocked}`, `{assisted}`, `{assist_radio}`, `{assist_track}`, `{assist_stun}`, `{received}`, `{hits}`, `{blocked_hits}`, `{received_hits}`, palette colours `{c_dealt}`, `{c_blocked}`, `{c_assisted}`, `{c_received}`; entries `{index}`, `{icon}`, `{class}`, `{amount}`, `{kind}`, `{vehicle}`, `{shell}`, `{source}`, `{color}`.

### hit_log — own hits

- **What:** each of the player's own shots that hit an enemy: penetration, critical, no penetration, ricochet, spaced armour, tracks/wheels, missed armour, with the damage and shell when the server reports damage, crits, and the target's HP after the hit. Optionally grouped by target (hits and damage per vehicle). A damage event arriving within 2 s after a hit result is merged into it.
- **Fair play:** the hit result is exactly the one the client draws on the enemy marker after the player's own shot (the client only sends it for the controlling vehicle's shots); HP is what the enemy's marker shows, taken only from a `VEHICLE_HEALTH` whose attacker (`value[1].vehicleID`) is the player's own vehicle. No armour analysis, nothing predictive.
- **Switch:** `battle_hit_log`. **Section `hit_log`:** `show_header`, `header_template`, `line_template` (empty = built-in), `lines` (0..20), `group_by_target`, `palette` (`classic`, `graphite` (default), `contrast`, `colorblind`: the outcome colour). Default position: bottom right.
- **Macros:** header `{hits}`, `{pens}`, `{no_pens}`, `{ricochets}`, `{damage}`, `{crits}`; lines `{index}`, `{vehicle}`, `{outcome}`, `{c_outcome}`, `{damage}`, `{crits}`, `{hp}`, `{shell}`, `{hits}` (grouped).

### battle_clock — clock and battle timer

- **What:** local time (and optionally the date) with the time left in the current arena period (countdown before the battle, then the battle timer).
- **Fair play:** the arena period and its end time are what the client's own timer shows.
- **Switch:** `battle_clock`. **Section `battle_clock`:** `clock_format` (`%H:%M`, `%H:%M:%S`, `%I:%M %p`), `date_format` (none, `%d.%m`, `%d.%m.%Y`, `%Y-%m-%d`), `show_timer`, `template` (`{time}`, `{date}`, `{timer}`, `{period}`). Default position: top right.

### team_hp — team HP and score

- **What:** the HP sum of each team against its maximum, as bars and/or numbers, the frag score and the HP difference. Styles `full`, `numbers`, `bars`, `compact`, and `icons`: a short HP bar per vehicle of each team in arena order (dead ones grey) with the score between the rows (Battle Observer's strip, same data). The tracking itself is `core/teams` + `core/client/battle/teams`, shared with the «Основной калибр» counter.
- **Fair play:** max HP comes from the arena data behind the player panels; current HP from the health updates the client already receives for markers and panels (an enemy the client has not seen keeps its last known HP, exactly as on its marker); deaths from the arena. The client already tracks the same values for its own HUD (the `battleField` controller in `battle_session.setVehicleHealth`); this panel only sums and restyles them.
- **Switch:** `battle_team_hp`. **Section `team_hp`:** `style`, `bar_width` (5..60), `icon_width` (1..8, the per-vehicle bar of `icons`), `show_score`, `show_diff`, `ally_color`, `enemy_color` (`#RRGGBB`), `template` (`{allies_hp}`, `{allies_max}`, `{allies_alive}`, `{enemies_hp}`, `{enemies_max}`, `{enemies_alive}`, `{allies_frags}`, `{enemies_frags}`, `{diff}`). Default position: top centre, under the vanilla score.

### sixth_sense — sixth-sense alert

- **What:** when the client's own sixth-sense lamp lights, a text or icon (with seconds since it lit) and, optionally, a custom sound; hidden when the lamp goes out or after `hide_after_s`.
- **Fair play:** it listens to the same vehicle-state event as the vanilla lamp, for the player's own vehicle only. No "nearest enemy", direction or distance (forbidden, item 8/9 of the rules).
- **Switch:** `battle_sixth_sense`. **Section `sixth_sense`:** `text` (empty = built-in; an icon replaces it), `color`, `icon_set` (`lamp` (default), `eye`, `badge`, `marks` — our icons in `gui/maps/icons/otmetki/sixth_sense/icons/<name>[_dim]_<64|128>.png` — or `custom`), `icon` (for `custom`: a client image path, shown as `img://<path>`; letters, digits, `_./-` only), `icon_size` (16..256), `pulse` (swap the icon and its dimmed frame every 0.5 s while lit), `lamp_sound` (`native` (default), `lightbulb`, `lightbulb_02`, `otmetki`: the game's own detection-sound setting, see below), `sound_event` (an extra Wwise event already loaded by the client or a sound mod; letters, digits, `_` only; empty = none), `show_timer`, `hide_after_s` (0 = while lit).
- **Sound, Wwise-free:** battle sounds are Wwise banks; a new event needs the Wwise authoring tool (proprietary, licensed per project) and a bank loader (openwg/wot.wwise). The client's one exception is `SoundGroups.CUSTOM_MP3_EVENTS`: with Settings > Sound > detection alert = user sound (`bulbVoices` index 2, `'sixthSense'`), it plays `audioww/sixthSense.mp3` and `sixthSense_off.mp3` through `WWISE.WW_prepareMP3` (RU 1.45 `SoundGroups.prepareMP3`, `options.DetectionAlertSound`). The package ships our CC0 chime at `res/audioww/`; `lamp_sound: otmetki` sets that option in the hangar, on the player's change only. Another sound mod shipping the same two files overrides ours (or ours it, by load order).

### personal_best — personal best on the tank

- **What:** in battle, one line per shown metric against the tank's record: «рекорд (урон) 6 812, осталось 1 200», then «Новый рекорд (урон): 7 050 (+238)» once beaten (damage, assist = radio + tracking, frags; XP is only known after the battle). After a random battle that beat a record, a hangar notification «новый рекорд на T-34 — урон 7 050 (было 6 812), опыт 2 900 (было 2 740)» and our chime (`otmetki_record.mp3`, `core/client/sound.play_mp3`).
- **Data:** the best of three own sources per tank, kept in `personal_best_<account>.json`: the selected vehicle's dossier (`getRandomStats().getMax*`, random battles), the own battle results (`battle_event`, random battles), and the site's career records (`records` of the tank row from `/mod/me/tanks`, the shared core read). A tank without a known record shows no line and gets no card after its first battle.
- **Fair play:** own data only.
- **Switch:** `battle_personal_best`. **Section `personal_best`:** `show_damage`, `show_assist`, `show_frags`, `show_card`, `sound`, `template` (`{metric}`, `{record}`, `{current}`, `{left}`, `{over}`). Default position: left, centre.

### main_gun — «Основной калибр» counter

- **What:** the own damage against the medal threshold, 20% of the enemy team's total HP and at least 1 000 (`arena_achievements`, RU 1.45): «Основной калибр 1 850 / 2 940, осталось 1 090», then «порог пройден»; optionally the team's damage (the HP the enemies lost) and the own share of it.
- **Fair play:** the own damage from the own feedback; the enemy HP exactly as team_hp reads it (arena max HP, the health the markers show). Who else dealt damage stays unknown, so the counter never says the medal is won: the team's top damage is the server's to decide.
- **Switch:** `battle_main_gun`. **Section `main_gun`:** `show_team`, `template` (`{damage}`, `{need}`, `{left}`, `{team}`, `{share}`). Default position: top right, under the clock.

### battle_efficiency — live battle efficiency

- **What:** «WN8 боя ≈ 2 340 (на танке 2 105)» and «Урон 2 150 / ср. 1 720 (+25%)», green above the own number and red below. WN8 is the standard formula over this battle's own damage, spotted vehicles, frags and capture points reset against the tank's expected values, with a neutral win ratio (the outcome is unknown until the end).
- **Data:** the tank row the shared core read (`/mod/me/tanks`) took in the hangar when the vehicle was selected: `avg_damage`, `wn8` and the optional `expected` values (without them only the damage line shows). Nothing is requested in battle.
- **Fair play:** own events and own averages only.
- **Switch:** `battle_efficiency`. **Section `battle_efficiency`:** `show_wn8`, `show_damage`, `colored`, `template` (`{wn8}`, `{tank_wn8}`, `{damage}`, `{average}`, `{delta}`). Default position: top right.

### consumables — own consumables and shells

- **What:** one line of the own consumables («Аптечка ✓ · Ремкомплект 12 с · Огнетушитель ✓», ×N for several charges, grey when spent) and one of the shells left per type («ББ 32 · БП 12 · ОФ 6»); cooldowns count down between the client's own updates.
- **Fair play:** the own vehicle's controllers the vanilla consumables panel reads; nothing about other vehicles.
- **Shell stats** (`show_shell_stats`, off by default): «ББ: 258 мм · урон 390 · 1 000 м/с» for the loaded shell (`shell_stats: current`, follows `onCurrentShellChanged`) or one line per type (`all`). The numbers are the vanilla battle shell tooltip's (`consumables_panel._makeShellTooltip`, RU 1.45): `gunSettings.getPiercingPower(intCD)[0]`, the shell descriptor's `avgDamage`, `getShotSpeed(intCD) / projectileSpeedFactor` (`items.vehicles.g_cache.commonConfig['miscParams']`).
- **Switch:** `battle_consumables`. **Section `consumables`:** `show_consumables`, `show_shells`, `show_shell_stats`, `shell_stats` (`current`, `all`). Default position: bottom centre.

### reload_timer — own gun reload

- **What:** «Перезарядка 3.2 с» with a bar while the own gun reloads, «Кассета 3/4» for a magazine gun, optionally «Орудие готово».
- **Fair play:** the own gun only, the reload the vanilla reticle already shows (Lesta's rule 3 forbids the reload of enemies, which is never read).
- **Switch:** `battle_reload_timer`. **Section `reload_timer`:** `show_bar`, `show_ready`, `show_clip`, `template` (`{left}`, `{total}`, `{clip}`, `{in_clip}`). Default position: centre, under the reticle.

### received_hits — hits on the own tank

- **What:** a log of every hit on the own tank, newest first: «СТ Pz. IV · ББ · −390 +1 крит.», «ТТ KV-1 · ОФ · не пробил, заблокировано 240», «рикошет»; a header «По вам: 3, пробитий 1, урон 390, заблокировано 240». The crits of a shot (RECEIVED_CRIT within 1 s) join its line.
- **Data:** the own feedback (`onPlayerFeedbackReceived`): RECEIVED_DAMAGE (shots only: fire and rams are the damage log's), TANKING (blocked by armour) and RECEIVED_CRIT; for these the target id is the attacker the vanilla damage log names. A ricochet is told apart only when the extra has `isRicochet()` (UNVERIFIED on Lesta 1.45; otherwise it shows as «не пробил»).
- **Fair play:** own tank only; no position, aim or anything the client does not already show about the attacker.
- **Switch:** `battle_received_hits`. **Section `received_hits`:** `show_header`, `show_class`, `show_shell`, `lines` (0..15), `line_template` (`{attacker}`, `{class}`, `{shell}`, `{outcome}`, `{damage}`, `{crits}`). Default position: bottom left, above the damage log.

### death_card — the card of the own death

- **What:** after the own tank is destroyed, a card for `show_s` seconds (0 = until the battle ends): «Вас уничтожил: СТ Pz. IV», «ББ · урон 390» (or the cause: fire, ram, a fall), «Повреждено: двигатель, боеукладка» and «↙ выстрел сзади слева».
- **Data:** the last RECEIVED_DAMAGE of the own feedback within 3 s of the death, the damage panel's own device states (VEHICLE_VIEW_STATE.DEVICES, critical or destroyed) within 1.5 s of that shot, the killer the kill feed names (`arena.onVehicleKilled`) when the shot is unknown, and the side: `PlayerAvatar.showOwnVehicleHitDirection(hitDirYaw, ...)` is overridden (the original always runs first) to keep the yaw the game's own hit indicator gets, turned into one of eight hull sides with the own vehicle's yaw (UNVERIFIED on Lesta 1.45: that `hitDirYaw` is a world yaw).
- **Fair play:** nothing is drawn while the tank is alive; the card names only what the damage panel, the kill feed and the hit indicator already showed. No position of the shooter, no trajectory, no minimap mark. A built-in kill cam is not hooked: whether Lesta 1.45 has one could not be checked without the client (live checklist item 11).
- **Switch:** `battle_death_card`. **Section `death_card`:** `show_modules`, `show_direction`, `show_s` (0..60). Default position: centre, above the reticle.

### battle_loadout — own equipment in battle

- **What:** the own tank's equipment with the game's item icons, a ★ on a device in a slot of its own category (the hangar's bonus frame), the field modifications and the directives; `compact` (icons in a row) or `detailed` (names by group).
- **Data:** read in the hangar when the vehicle is selected (the battle client has no gui items) and kept for the last 8 tanks: `Vehicle.optDevices.installed` and `.slots[i].categories` against the device's `descriptor.categories`, `Vehicle.battleBoosters.installed`, the items' `userName` and `icon` (`../maps/icons/artefact/*.png`, drawn as `img://gui/maps/...`), `VehicleDescriptor.modifications` through `postProgression().modifications` (`locName`, else the internal name; UNVERIFIED on Lesta 1.45).
- **Fair play:** own tank only. The client does not tell anything about other vehicles' equipment and the mod does not guess it.
- **Switch:** `battle_loadout`. **Section `battle_loadout`:** `style` (`compact`, `detailed`), `show_devices`, `show_modifications`, `show_directives`, `show_icons`, `icon_size` (12..48). Default position: bottom centre.

### gun_arc — own gun traverse limits

- **What:** «УГН ◄ 12° ├──────●───┤ 8° ►»: the degrees the own gun can still turn to each side before its traverse limits, a bar with its position, a side in warning colour under `warn_deg` and in red at the stop. Shown only on vehicles with limits (tank destroyers, SPGs, some tanks); a turret that turns all the way round shows nothing. Read ten times a second while the camera follows the own vehicle.
- **Data:** `VehicleDescriptor.gun.turretYawLimits` (radians, RU 1.45 `vehicle_getter.getYawLimits`) and `VehicleGunRotator.turretYaw`. UNVERIFIED on Lesta 1.45: that a negative yaw is to the left.
- **Fair play:** the own vehicle's parameters and the own turret; aims nothing, changes nothing (Lesta's items 4 and 10), reads nothing about others.
- **Switch:** `battle_gun_arc`. **Section `gun_arc`:** `show_bar`, `show_degrees`, `warn_deg` (0..30). Default position: centre, under the reticle.

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
- **Fair play:** it only hides or annotates chat the client already received. A hidden line skips the client's own `addMessage` entirely, so it is also left out of the channel history and of the replay's chat (`g_replayCtrl.onBattleChatMessage`); that is intended: the replay shows the chat as the player saw it.
- **Switch:** `battle_chat_filter`. **Section `chat_filter`:** `timestamp_format` (none, `%H:%M`, `%H:%M:%S`), `filter_duplicates`, `duplicate_window_s` (5..300), `rate_limit` (0..20, 0 = off), `rate_window_s` (5..60), `filter_commands`, `block_words` (comma-separated, case-insensitive).

### streamer_mode — streamer mode

- **What:** a hotkey (`ctrl_shift_h` by default; `ctrl_shift_s`, `f9`, `f10`, `f11` or none) takes every panel of the mod and every hangar label off the screen and brings them back with their latest text (`HudLayer.set_muted`, `Ui.set_muted`: the features keep updating, the layer holds the texts); `keep_hidden` keeps them off in the next battle. The private mode (`private`) hides the battle chat of other players (`BattleLayout.addMessage/addCommand`, the own lines stay) and blocks the hangar labels with the player's own numbers (ratings, session, goals, personal missions, marks history).
- **Fair play:** hides only; reads nothing.
- **Left out:** hiding the name and clan in the game's own interface (the players panel, the carousel header, the battle loading screen) needs patching Scaleform views; there is no verifiable Python API for it.
- **Switch:** `streamer_mode`. **Section `streamer_mode`:** `hotkey`, `keep_hidden`, `private`, `hide_chat`, `hide_hangar_stats`.

### bush_circle — the 15 m circle

- **What:** a 15 m circle on the ground around the own tank (the bush rule: farther than 15 m from the bush the shot reveals the tank), by a hotkey (`ctrl_shift_b` by default; `ctrl_shift_c`, `f7`, `f8` or none) or always (`mode`), in `white`, `green`, `yellow` or `cyan`; removed when the own tank is destroyed and at the end of the battle. The radius is the game's rule, not a setting.
- **How:** the game's own ground marker (RU 1.45 `CombatSelectedArea`): a `BigWorld.PyTerrainSelectedArea` with `content/Interface/CheckPoint/CheckPoint.visual`, 0.5 m over the terrain, on an empty `BigWorld.Model` added to the player and driven by `BigWorld.Servo(<own vehicle>.matrix)`, so it follows the tank without a tick. UNVERIFIED on Lesta 1.45: the visual and the servo on the vehicle matrix (live checklist item 12). On the minimap: left out, the minimap is a Scaleform view with no Python API for our own shapes.
- **Fair play:** the own tank's position and a fixed radius; nothing about other vehicles. A 15 m circle is not in Lesta's forbidden list (research 2026-09-29 §0).
- **Switch:** `battle_bush_circle`. **Section `bush_circle`:** `mode` (`hotkey`, `always`), `hotkey`, `color`.

## In-game UI

Package `packages/ui` (`net.triotmetki.ui`, depends on core and companion; registers through the core registry as `ui`, so it attaches in any load order). Without OpenWG Gameface it logs one line and the ModsSettingsAPI window / `config.json` stay the settings UI.

- **HUD page:** `hud.html` (ui-web `src/app/hud`, widget `hud-overlay`) is the Gameface HUD renderer's page, registered as `otmetki/ui/hud` in `res_map/net.triotmetki.ui.json`. It draws each label from its anchor in rem (1rem = 1px of the design, the GUIFlash coordinates), renders the panels' GUIFlash HTML subset (`<font color size>`, `<b>`, `<i>`, `<u>`, `<br>`, `\n`, `<img src="img://...">`) through `shared/lib/rich-text` into spans, never as HTML, and lets the player drag a panel while the cursor is shown (`shared/lib/hud-geometry`, the editor's anchor maths). The protocol is `core/hud/surface` on the Python side and `shared/api/hud-protocol` on the page; `packages/core/tests/test_hud_backends` writes the state fixture the page's zod schema parses and checks both command lists.
- **Window:** a Gameface `WindowImpl` + `ViewImpl` whose `ViewModel` has one string property `state` (the whole UI state as JSON) and one command `send` (`{message: '<json>'}`). The page is `ui-web` built into `packages/ui/gameface/index.html` (one self-contained file: styles inlined in the head, the script inlined as a classic IIFE `<script>` at the end of the body, the way the client's own Gameface pages load theirs; no ES module loader) and shipped at `res/gui/gameface/mods/triotmetki/ui/`; `res_map/net.triotmetki.ui.json` registers it for OpenWG Gameface (Lesta needs its Lesta-compatible build; the first start after install restarts the client once).
- **Entry points:** a «///» button injected into a hangar Gameface view (`client/constants.BUTTON_HOSTS`, `setChildView` + `gf_mod_inject` of `button.js` and `button.css`; `button.html`, a static file in `ui-web/public/`, is the child view's empty layout), a ModsList entry when a Lesta-compatible ModsList is installed, and the hotkey Ctrl+Shift+T (hangar only; it also ends the on-screen HUD edit mode). The window closes on `battle_enter`.
- **Bridge (pure, `ui/bridge`):** `SettingsBridge.state()` and `handle(message)`; the glue only moves JSON. Messages: `ready`, `close`, `set {component, key, value}`, `action {component, action, row?, value?}`, `language`, `bind {code}`, `open {path}` (site-relative paths only, joined to the site next to `server_url`), `profile_save/load/rename/delete/export/import`, `hud_edit {active}`, `hud_move {panel, x, y, align_x?, align_y?}`, `hud_reset {panel}`. A test checks the command list against `ui-web/src/shared/api/protocol`, and the page's zod schema parses a state fixture the Python tests write (`OTMETKI_UPDATE_FIXTURES=1` regenerates it).
- **Cards (`ui/components`):** the companion's data switches (`COMPANION_KEYS`) first, then every attached feature, then HUD panels no feature claims. A page row may carry `details: [{label, value}]`; the page shows them behind a «Подробнее» toggle (the battle summaries and the marks history use it). A card's switch is the feature's config.json switch (`settings.SETTINGS`); its fields come from its components.json section (`settings.SCHEMA`) or its companion keys; field type, limits and choices are derived from the `Schema` (bool, int with min/max, choice, text). Panel position keys (`x`, `y`, `align_*`, `drag`) are left to the HUD editor. A feature instance may add buttons and a list page with duck-typed `ui_actions()`, `ui_page()` and `ui_action(action, row, value)` (the replay manager and hangar tweaks do). Group: `GROUP` in the feature's settings (`data`, `hangar`, `battle`).
- **Labels:** from the shared catalog, most specific first: `component_<id>` / `component_<id>_hint`; field `<id>_<key>`, `setting_<key>`, then the bare key (the companion labels its switches that way); hints with `_hint`; choices `<id>_<key>_<value>`, then `choice_<value>`. A feature adds these to its `i18n` STRINGS.
- **Profiles (`ui/profiles`):** `mods/configs/otmetki/profiles.json` `{version: 1, active, profiles: [{id, name, created, updated, data: {config, components}}]}`, at most 12. `data.config` is config.json without the connection and the privacy and network switches (`server_url`, `bind_code`, `settings_action`, `settings_target`, `settings_anonymous_stats`, `share_settings`, `upload_replays`, `publish_replays`, `send_*`, `settings_include_*`), which a profile or a code never carries or applies; `data.components` is the whole components.json (sections of components that are not installed included: they are stored as is and merged through their schema once installed). The manager reads and writes the same file. Profile codes `TM1.<base64url(zlib(json))>` copy a profile between players. **Site sync is not wired:** the settings-share contract (`contract/settings.schema.json`) is a strict whitelist of standard client settings and excludes mods by design, so syncing profiles to the site needs its own contract and endpoint.
- **HUD edit mode:** the window's editor draws the screen (the client size from `viewEnv.getClientSizePx()`) with every registered panel from `hud_layer(app).panels`; dragging (or the arrow keys) sends `hud_move` with the nearest anchor (`align_x`/`align_y` by screen third), throttled to 150 ms, and the bridge writes it through `hud_layer(app).update_settings`, so a shown panel moves live. «Edit on screen» emits `hud_edit(True)` on the bus and closes the window: every HUD panel (damage log, hit log, clock, team HP, sixth sense) shows itself with preview data in the hangar when its switch is on, and GUIFlash lets the player drag it (Ctrl); `hud_edit(False)` (hotkey, window reopened, battle) hides the previews, and a panel's own battle start ends its preview. `hud_describe(collect)` asks panels for the editor's miniature: `collect(panel_id, preview=None, width=None, height=None)`. A panel answers both through `core.hud.HudPreview(layer, panel_id, render_preview, is_enabled, can_show, size).attach(app.bus)`; its preview text comes from the feature's pure `model/preview.py`.
- **Look:** the site's design v4 tokens from `@otmetki/design-tokens` (`packages/design-tokens`, the same SCSS maps the site emits as CSS variables), dark theme. Each component has its own SCSS module (`<Component>.module.scss`, classes named `otmetki-<Component>__<class>`); `token(name)` from `src/shared/styles/_gameface.scss` inlines the static value, so the CSS carries no `var()`. Lengths are written in px and shipped as rem (`postcss-pxtorem`, 1rem = 1px of the design, because Gameface scales rem); esbuild's CSS minifier lowers `rgb(r g b / a)` to `rgba()` for `chrome58`. The «///» mark (header, hangar button) is `LOGO_SHAPES` from `@otmetki/icons/shapes`; the ModsList `icon.png` is the same mark on the tile colours, rasterised at build time with resvg.
- **Code layout (`ui-web/src`, feature-sliced):** `app/` the two entries and the dev mock (`app/settings/main.tsx` and `app/button/main.tsx` are one line each: `onDomReady(() => mountOnce({ id, node }))`; `app/settings/ui/App` with its `use-app` hook subscribes to the bridge and picks the section); `widgets/` the window's blocks (`header`, `sidebar`, `component-card` with its fields and list page, `profiles`, `hud-editor` with `lib/geometry`, `notice`); `features/hangar-button`; `entities/window-state` (the nanostores store, `setSetting`/`toggleSwitch`, `useT`); `shared/` (`api/gameface`: the one typed adapter over the Gameface globals `model`, `engine`, `viewEnv`, `subViews`, plus `api/gameface/mock`; `api/protocol`: zod/mini schemas, inferred types, `parseState`, `send`; `i18n`; `lib/dom` (`onDomReady`, `mountOnce`), `lib/throttle`, `lib/clamp-int`, `lib/testing/render-hook`; `ui/` the kit: button, input, toggle, segmented, card, confirm, action bar, div-based list and detail list). Components only render; state, handlers and derived values come from each slice's `model/hooks/use-*`, constants from its `config/`.
- **Gameface HTML:** no `ul`/`ol`/`li`, `dl`/`dt`/`dd`, `select`/`option` (polyfill-only in Gameface) and no `radio`/`range`/`checkbox` inputs: lists are `div` with `role="list"`/`"listitem"` (`shared/ui/list`), choices are buttons with `aria-pressed` (`shared/ui/segmented`), switches are buttons with `role="switch"` (`shared/ui/toggle`). ESLint (`otmetki/modpack-gameface` in the root `eslint.config.mjs`) bans the JSX elements, `ui-web/stylelint.config.mjs` the selectors, and the bundle test checks the built files.
- **Build and tests:** `bun run ui:build` (in `apps/game/modpack`) runs Vite three times (`ui-web/vite.config.ts`, `@preact/preset-vite`): the default mode builds `index.html` as one IIFE chunk with `vite-plugin-singlefile`, and `config/vite/classic-script` moves the inlined script to the end of the body as a classic script; `public/button.html` is copied and `icon.png` rendered. `--mode button` builds `src/app/button/main.tsx` as a library IIFE (preact included, ~14 KB) with its own `button.css`, the two files `gf_mod_inject` loads. `--mode hud` builds `src/app/hud` into `hud.html` the same way as the settings page (one classic IIFE script), next to it in the same folder. JS targets `es2017`: the client's own Gameface bundles (wotstat/wot-src, `sources-gameface/_dist`) are compiled down to that level (optional chaining and object spread lowered), and Coherent documents only "V8" without a version. The output is deterministic and committed; `config/vite/_tests/gameface-bundle.test.ts` rebuilds into a temp folder and fails when `packages/ui/gameface` is stale, when the page has a module script or anything but one classic script at the end of the body, when `button.js` is not an IIFE, or when a list or select element is rendered. `bun run ui:dev` serves the page in a browser; `config/vite/dev-mock` (serve only) puts `src/app/dev/main.ts` in front of it, which installs the Gameface globals from `shared/api/gameface/mock` over the Python state fixture (`set` and `language` change it, other messages come back as a notice). `bun run ui:test` (and the repo's Vitest project `modpack-ui`, which runs on the same Vite config; hook and DOM tests use jsdom) runs the `_tests`; `bun run typecheck` covers `ui-web`.
- **Gameface CSS** (`ui-web/stylelint.config.mjs`, run by the repo's `bun run lint:css`). Sources: Coherent's [CSS properties](https://docs.coherent-labs.com/cpp-gameface/content_development/supported_features_tables/cssproperties/), [selectors](https://docs.coherent-labs.com/cpp-gameface/content_development/supported_features_tables/cssselectors/), [media queries](https://docs.coherent-labs.com/cpp-gameface/content_development/mediaqueries/) and [SVG](https://docs.coherent-labs.com/cpp-gameface/content_development/supported_features_tables/svgsupport/) tables (current Gameface; the client ships an older build, so treat them as a ceiling) and the Lesta client's own Gameface CSS (rem lengths, `rgba()`, no `var()`, `calc()`, `gap` or combinators). Banned:
  - layout: `display` other than `flex`/`none`, grid, `gap`, columns, `flex-flow` (write `flex-direction` + `flex-wrap`), `order`, `float`, `position: sticky`, `inset`, logical `margin-/padding-/border-inline|block`, `justify-items|self`, `place-*`; `align-*` beyond `stretch|flex-start|flex-end|center` (`auto` for `align-self`), `justify-content` beyond `flex-start|flex-end|center|space-between|space-around`;
  - borders and outlines: styles other than `solid|none|hidden`, `outline*`, `border-collapse|spacing`;
  - text: `white-space` beyond `normal|nowrap|pre|pre-wrap`, `text-overflow` beyond `clip|ellipsis`, `word-break`, `word-spacing`, `text-indent`, `writing-mode`, `direction`, `font-variant*`, `font-kerning`, `font-stretch`, `list-style*`, `quotes`, counters;
  - values: `var()` (fallbacks and `@keyframes` unsupported), `calc()` (no `%` mixed with lengths), `min|max|clamp|env|attr`, `color-mix`, conic and repeating gradients, `image-set`, modern colour spaces, named colours («limited color names»), `#rrggbbaa`, units other than `px rem em % vw vh s ms deg`, `max-width|height: none`, `user-select: all`, `visibility: collapse`;
  - other properties: `object-fit|position`, `will-change`, `background-attachment|blend-mode|origin`, `clip`, `resize`, `scroll-behavior`, `touch-action`, `container*`, `tab-size`, table layout;
  - selectors: any combinator or nested rule (child, descendant and sibling selectors need `EnableComplexCSSSelectorsStyling`), pseudo-classes other than `:hover :active :focus :first-child :last-child :only-child :nth-child :root`, pseudo-elements other than `::before ::after ::selection`;
  - at-rules: `@supports @container @layer @property @page @counter-style @font-feature-values @scope`; media features other than width/height/aspect-ratio/orientation, and range notation (`width < 640px`).

## Hangar and client-settings components

Each is a feature package with a config.json switch (on by default) and a components.json section. The four client-settings components write **only standard client settings the game's own settings window offers**, through the settings core (`core/client/native`), only in the hangar, and only when the player changes a value in the window or loads a profile (`component_settings`): the value `native` («Как в игре») never touches the game's setting, and a later change in the game's own settings window is never overridden.

### replay_manager — replay manager

- **What:** the player's own replays in the client's replay folder (the header's recorder must be the logged-in account), with map, vehicle, date, the own result and damage (the recorder's own results entry) and size; search (map, vehicle, file name) and filters (result, period) with an order (newest, oldest, damage, size) in the card; rename (Windows-safe names, same extension), delete (with a confirmation), open the folder; replays the mod uploaded link to `/replays/<id>` on the site (the upload's `replay_uploaded` event stores the site id per arena in `replay_manager_<account>.json`), plus «Мои реплеи на сайте».
- **Auto names (opt-in):** with `auto_rename` on, the replay of each own battle is renamed after the battle from `name_template` (macros `{date}`, `{time}`, `{map}`, `{vehicle}`, `{tier}`, `{result}`, `{damage}`, `{xp}`, `{frags}`, `{arena}`; Windows-safe, same extension). The file is matched by its header (the results block's arenaUniqueID, else the start time within 5 min), never by its name; checked every 15 s in the hangar once the file has not changed for 10 s; a battle without a replay is dropped after 30 min; an existing target name is never overwritten. The replay upload matches by header too, so a renamed file still uploads.
- **Analysis notice:** for the replays this game session uploaded (`replay_uploaded`), the hangar asks `POST /mod/me/replays` every 60 s for up to 6 h (at most 20 ids, signed like `/mod/ingest`); when the site reports `parsed`, a notification «разбор реплея готов на сайте (точность 83%, урон 2 150, пробитий 7)» and the row's badge «Разбор готов». A server without the endpoint answers 404, which stops the polling for the session ([contract](contract/replay-analysis.schema.json)).
- **Switch:** `hangar_replay_manager`. **Section:** `search`, `filter_result` (`all`, `win`, `loss`, `draw`, `unknown`), `period` (`all`, `today`, `week`, `month`), `sort` (`newest`, `oldest`, `damage`, `size`), `notify_analysis`, `max_rows` (10..200), `uploaded_only`, `auto_rename` (off by default), `name_template`.
- **Left out:** playing a replay from the hangar (no verified client API).

### hangar_tweaks — hangar

- **What:** the carousel options of the client (`carouselType` one/two rows, `doubleCarouselType` tile size) and three free quick actions on the selected vehicle, with confirmations: demount every piece of equipment the client marks removable, send the crew to the barracks (refused when the barracks are known to be full), and bring the previous crew back (the client's own «Вернуть экипаж», refused without a remembered crew). All refuse while the vehicle is in battle, in the queue or in a platoon, and run the client's own item processors (signatures checked against the RU 1.45 source: `TankmanUnload` takes the vehicle's inventory id). Demounting goes one slot at a time: each request is built from the vehicle as `IItemsCache.items.getVehicle(invID)` holds it after the previous answer, and stops at the first failure; each answer's own text is shown through `SystemMessages.pushMessagesFromResult`, as the hangar's buttons do. The barracks check is `IItemsCache.items.freeTankmenBerthsCount()`.
- **Style removal:** «Снять стиль» (confirmed) takes the style off the selected vehicle the way the customization window does (an empty outfit for every season through the client's `OutfitApplier`); the style goes back to the depot. Refused without a style or while the vehicle is locked.
- **Interface scale:** `interface_scale` (`native`, `auto`, `x1`, `x1_25`, `x1_5`, `x1_75`, `x2`), the game's own option, written as the index of that scale in the screen's scale list; a scale the screen does not offer is left alone.
- **Switch:** `hangar_tweaks`. **Section:** `carousel_rows`, `carousel_tiles`, `interface_scale`, `quick_actions`.
- **Left out:** a three-row carousel (needs patching the Flash carousel), hiding the hangar tutorial hints (no side-effect-free client API could be verified for Lesta 1.45) and an accelerated crew training switch: on 1.45 the crew widget turns it on by itself for elite and premium vehicles and no client button sends the `XP_TO_TMAN` vehicle flag, so hangar_info shows the state instead.

### minimap — minimap

- **What:** size (`AccountSettings` `minimapSize` 0..5, what the battle minimap and its +/- keys use; it is not a settings-core option), transparency (`minimapAlpha`), vehicle names on the map (`showVehModelsOnMap`: never / Alt / always) and the player's own range circles (`minimapViewRange`, `minimapMaxViewRange`, `minimapDrawRange`).
- **Switch:** `minimap_tweaks`. **Fair play:** vanilla options only; a test checks that no setting name concerns enemies, directions, tracers, destroyed objects or spotting. **Left out:** zoom beyond the client's own size range (Flash patch); lost-enemy markers, gun directions, arty tracers (forbidden).

### camera — camera

- **What:** camera presets (`preset`: `sniper` = enter the sight at x8 without the dynamic camera, `balanced` = at x4, `dynamic` = at x2 with the dynamic camera; all with horizontal stabilisation), the zoom on entering sniper mode (`sniperZoom`, the game's own option: remember the last one, x2, x4, x8; the client has no option for the list of zoom steps), the dynamic camera and horizontal stabilisation. A preset only fills the fields left at «Как в игре»; a field set by hand wins.
- **Switch:** `camera_tweaks`. **Left out until Lesta/МОСТ confirms them in writing:** camera distance and zoom beyond the client's own options, free-look / pitch limits, the commander camera and sway removal. All of them override the camera configuration (PMOD-style) rather than a setting the game exposes.

### crosshair — crosshair presets

- **What:** presets (`classic`, `minimal`, `contrast`, `clean`) over the client's own reticle settings (`arcade` / `sniper`: opacity and style index of the net, centre mark, gun mark, mixing, reload, condition, cassette and zoom indicator; the player's other parts are kept), for arcade, sniper or both; and the client's server-reticle switch (`useServerAim`).
- **Switch:** `crosshair_presets`. **Fair play:** looks only; nothing computes lead, penetration, distance or anything about enemies.
- **Centre mark:** `mark` (`none` (default), our `dot`, `cross`, `ring`, `chevron`, `streamer`, `colorblind`, `triad`, our one-colour `tint_dot`, `tint_cross`, `tint_ring`, `tint_brackets`, `tint_diamond` in `mark_color` (`white`, `green`, `yellow`, `cyan`, `magenta`, `red`: one rendition per colour, `assets/otmetki/crosshair_tinted`), and Kenney's CC0 `kenney_dotted`, `kenney_cluster`, `kenney_pincer`, `kenney_arrows`, `kenney_scope`), `mark_size` (16..128 px; the 64 or 128 px rendition is scaled), `mark_hides_centre` (also sets the game's own `centralTag` to 0 for the chosen `modes`), `x`/`y` (offset from the reticle centre; the panel is not dragged). The mark is a HUD label with `<img src="img://gui/maps/icons/otmetki/crosshair/...png">`, centre-aligned and moved to `CrosshairDataProxy.getScaledPosition()` minus the screen centre on `onCrosshairPositionChanged` / `onCrosshairScaleChanged`; shown only in the arcade and sniper views (`onCrosshairViewChanged`, `CROSSHAIR_VIEW_ID` 1 and 2). HudLayer has no transient move, so the feature tells the backend the position directly (`hud.backend.update`) and components.json keeps only the player's offset.
- **Vanilla reticle art is not replaced:** the gun marker and the rest of the reticle are the Scaleform `crosshairPanel` and `battleAtlas`. Replacing them means shipping a rebuilt SWF/atlas that contains Lesta's own art, rebuilt after every patch; we stay with the settings the game offers plus the overlay mark.

### hangar_info — clock, server, ping, online

- **What:** a hangar label with the local time and date, the server the player is logged in to, the client's own ping to it (coloured by the client's own bands: up to 59 ms, up to 119 ms, above) and the online counter of the lobby header; redrawn on the app's hangar tick, hidden in battle. Needs GUIFlash like the other hangar panels.
- **Fair play:** hangar only; the player's own connection.
- **«Броня на сайте»:** a window button for the selected tank that opens its 3D armour page on the site, `/t/<slug>/armor`, with the slug the server makes from the tank tag (`ussr:R45_IS-7` → `r45-is-7`, `@sindresorhus/slugify`). Only a link: nothing about armour is computed in the client (Lesta's article 15152 names armour analysis in battle).
- **Selected vehicle:** a third line with its battle tiers in random battles (the server's own table behind the Demonstrator window), the crew XP to the next skill (the crew member closest to it, with the role) and whether accelerated crew training is on (elite or premium vehicle).
- **Switch:** `hangar_info`. **Section:** `clock_format`, `date_format` (none, `%d.%m`, `%d.%m.%Y`, `%Y-%m-%d`), `show_server`, `show_ping`, `show_online`, `show_tiers`, `show_crew`, `show_training`, `template` (`{time}`, `{date}`, `{server}`, `{ping}`, `{online}`, `{region_online}`, `{vehicle}`, `{tiers}`, `{crew}`, `{training}`), `font_size`, `x`, `y`, `align_x`, `align_y`. The ping is what the server selector measured (the client pings at most every 10 min; the panel asks every 60 s).

### battle_hits — battle wounds (hits on the own tank in the hangar)

- **What:** every shot that hit the own tank, recorded in the own battle and shown in the hangar afterwards: a label with the last battle («Боевые раны · T-34», hits, penetrations, no pens, ricochets, per part and side) and a window page per battle with a schematic from above (hull, turret, gun, both tracks; a dot per hit coloured by the outcome) and the list: part and side, outcome, damage, the shooter. The last `keep_battles` battles are kept per account in `mods/configs/otmetki/battle_hits_<account>.json`; «Удалить» per battle.
- **Data:** `Vehicle.showDamageFromShot(attackerID, points, …)` overridden (the original always runs first), only on the own vehicle (`isPlayerVehicle`); each encoded point is decoded in pure Python as the client's `DamageFromShotDecoder.decodeSegment` does (RU 1.45): the part index (0 chassis, 1 hull, 2 turret, 3 gun, higher = tracks), the hit effect (pierced, critical, not pierced, ricochet, pierced without damage) and the point as fractions of the part's bounding box; the last point of a shot is the one the client draws. The damage comes from the own feedback's RECEIVED_DAMAGE of the same shooter within 1 s, in either order. The shooter is the name the vanilla damage log shows.
- **3D:** drawing the points on the hangar's 3D model would need the hangar vehicle's collision boxes and a decal per point; it could not be checked without the client, so the hangar shows the 2D schematic (fractions of each part's box on a fixed silhouette, so a point's side is exact but its spot is approximate). UNVERIFIED on Lesta 1.45: the model axes (+z the front, +x the right side).
- **Fair play:** the own tank only, shown only after the battle; where the shooter was, the trajectory or the direction are never recorded (Lesta's items 1 and 6); nothing is drawn in battle.
- **Switch:** `hangar_battle_hits`. **Section `battle_hits`:** `show_panel`, `show_attacker`, `keep_battles` (1..30).

### marks_history — marks of excellence history

- **What:** per vehicle, the MoE percent, marks and moving-average damage after each own battle (the `moe` of the companion's own battle_result event) and the hangar dossier snapshots in between (only when they changed: battles played without the mod), with the date each mark was reached. A hangar label for the selected vehicle (percent, stars, the last battle's change, the trend over `trend_battles`); the window page lists the vehicles, most recent first, with their latest entries in the details and a «Очистить» per vehicle; «Прогресс на сайте» opens `/me/progress`. Stored per account in `mods/configs/otmetki/marks_history_<account>.json` (at most `max_entries` per vehicle, 300 vehicles).
- **Fair play:** the player's own battle results and dossier only.
- **Switch:** `hangar_marks_history`. **Section:** `max_entries` (10..500), `show_panel`, `trend_battles` (1..50), `page_rows` (10..200).
- **Left out:** WN8 and other site ratings per vehicle: the [hangar_ratings](#hangar_ratings--own-ratings-in-the-hangar) label shows them for the selected tank.

### hangar_ratings — own ratings in the hangar

- **What:** a hangar label with the bound player's own site ratings: the account (WN8, EFF, Броня-Индекс, win rate, battles, average damage), the latest session (the mod's live session, else the latest day the site counted: WN8, Броня-Индекс, win rate, battles, average damage) and the selected tank (WN8, win rate, battles, average damage, MoE percent with its marks, mastery badge). Values are coloured by the rating scale's tier. The window card has «Обновить» and «Аналитика на сайте» (`/me/analytics`). Hidden in battle and until the mod is bound.
- **Requests:** `POST /mod/me/overview` `{device_id, account_id}` and `POST /mod/me/tanks` `{device_id, account_id, tank_ids}` (the selected tank), signed like `/mod/ingest` (v2, `core.net.signing.signed_request`, the same 428 clock re-sync), through the app's transport. Contract: [contract/ratings.schema.json](contract/ratings.schema.json). The server answers only for the device's bound account (another `account_id` is 403 `account_mismatch`), caches each answer for 30 s and rate-limits the pair.
- **Cache:** in memory for the game session, per account (`model/cache.RatingsCache` for the overview, the core's shared `tank_ratings` read for the tank rows, which personal_best and battle_efficiency use too): each value is read once; after an own battle result the overview and that tank are read again 20 s later (after the ingest flush), or at once when an ingest answer arrives; a failed read waits 2 min (429: its `Retry-After`, 1 min without); 401/403 pauses it like the outbox (`on_auth_failed`, rebind). Nothing is stored on disk.
- **Fair play:** only the bound account's own ratings; an answer naming any other account is dropped by the mod as well.
- **Switch:** `hangar_ratings`. **Section:** `show_account`, `show_session`, `show_tank`, `metric_wn8`, `metric_eff` (off), `metric_brone_index`, `metric_win_rate`, `metric_battles`, `metric_avg_damage`, `metric_moe`, `metric_mastery`, `colored`, `font_size`, `x`, `y`, `align_x`, `align_y`. Needs GUIFlash like the other hangar panels.

### hangar_marks — marks in the hangar

- **What:** a hangar HUD panel (`hangar_marks`, movable in the HUD editor) for the selected tank of tier 5+: the percent and the marks as stars, the average, the pace of the last own battles, the damage for +0.5% and per target (65/85/95%, what one battle needs), and the forecast «до N% (среднее X): ~K боёв». Hidden in battle; refreshed on a vehicle change, a curve read and a settings change.
- **Data:** the same as [marks_panel](#marks_panel--moe-panel-in-battle) (`core/client/moe`): the dossier snapshot, the site curve, the pace book. Nothing extra is requested.
- **Fair play:** hangar only, own data only.
- **Switch:** `hangar_marks`. **Section `hangar_marks`:** `style` (`extended`, `compact`, `custom`), `template` (the marks_panel macros), `show_targets`, `show_forecast`, `color_mode` (`mark`, `off`), plus the common panel keys. Default position: top right.

### session_goals — goals from the site

- **What:** the goals the player set on the site's dashboard (win rate, WN8, average damage, battles, MoE percent, Броня-Индекс; for the account or one tank). A hangar label «Цели» with each goal's current value and progress (✓ once met); in battle one line per goal this battle can move (active, not met, of this tank or of any): for an average-damage goal the damage this battle needs («Ср. урон 3 000: нужно 3 900 урона в этом бою», counting down with the own damage), for a battles goal «это бой 10», else the current value. When the site reports a goal met, a notification and our chime (`otmetki_goal.mp3`), once per goal (the announced ids live in `state.json`; goals already met at the first read are not announced).
- **Requests:** `POST /mod/me/goals` `{device_id, account_id}` in the hangar once bound, once per game session and again 20 s after each own battle, signed like `/mod/ingest`; 401/403 pauses it like the outbox. Contract: [contract/goals.schema.json](contract/goals.schema.json); without an answer nothing shows. Window card: «Обновить», «Цели на сайте» (`/me`).
- **Fair play:** own goals and own progress; in battle only the own damage is added.
- **Switch:** `hangar_session_goals`. **Section `session_goals`:** `show_hangar`, `show_battle`, `sound`, `max_goals` (1..5), plus the common panel keys (the battle line; the hangar label sits on the right, under the hangar marks).

### personal_missions — personal missions helper

- **What:** a hangar label «ЛБЗ: в работе 2, выполнено 5, с отличием 3» with the missions in progress and their main and «with honours» conditions; in battle the same lines for the missions of the tank's class (the hangar's snapshot: the battle client has no missions cache); the window page lists every mission with its state. «Обновить» re-reads.
- **Data:** `IEventsCache.getPersonalMissions().getAllQuests()`: `getUserName()`, `getUserMainCondition()`, `getUserAddCondition()`, `isInProgress()`, `isCompleted()`, `isFullCompleted()`, `getVehicleClasses()` (RU 1.45 source; UNVERIFIED on Lesta 1.45 after the personal missions rework). The live progress counters of the battle are left out until the client's in-battle missions controller is verified.
- **Fair play:** the player's own missions only.
- **Switch:** `hangar_personal_missions`. **Section `personal_missions`:** `show_hangar`, `show_battle`, `show_conditions`, `max_missions` (1..6).

### platoon_helper — platoon helper

- **What:** a hangar label «Взвод: готовы 2 из 3» with the platoon mates and their ready marks, read every 2 s in the hangar, and the own battles of the session in a platoon and in clan modes (CLAN, GLOBAL_MAP, the stronghold modes): battles, win rate, average damage.
- **Data:** `g_prbLoader.getDispatcher().getEntity().getPlayers()` (`name`, `isReady`, `isCurrentPlayer()`; UNVERIFIED on Lesta 1.45) and the own `battle_event` (`platoon`, `bonus_type`, `result`, `stats.damage_dealt`).
- **Fair play:** the names and ready marks the platoon window already shows, and the own battles. No statistics of the mates or of the clan's other members are read (clan attendance beyond the own battles would need them).
- **Switch:** `hangar_platoon_helper`. **Section `platoon_helper`:** `font_size`, `show_members`, `show_session`.

### tilt_guard — break reminders

- **What:** a system message in the hangar «3 поражений подряд. Может, пять минут перерыва?» after `loss_streak` losses in a row, one after `session_battles` battles in a session, and one when the average damage of the last 5 battles falls below 70% of the session's earlier ones; each once per streak or session (a session ends after an hour without battles).
- **Fair play:** the own random battles of this session; nothing is blocked.
- **Switch:** `hangar_tilt_guard`. **Section `tilt_guard`:** `loss_streak` (0..10, 0 = off), `session_battles` (0..200, 0 = off), `damage_drop`.

### auto_resupply — auto-resupply flags

- **What:** the four per-vehicle flags of the game's ammunition panel: auto repair, auto-resupply of shells, of consumables and of directives, each «Как в игре» / on / off. Two buttons: «Применить к выбранному танку» and «Применить ко всем танкам» (confirmed); only the flags that differ are sent, one request after another, vehicles in battle, in the queue or in a platoon are skipped. Nothing is sent without a button press, so a flag changed later in the game is never overridden.
- **Fair play:** hangar only; the client's own vehicle-settings requests.
- **Switch:** `hangar_auto_resupply`. **Section:** `auto_repair`, `auto_load`, `auto_equip`, `auto_boosters`.
- **Left out:** an automatic crew return: RU 1.45 has no such vehicle flag (the crew's return is the hangar tweaks' one-off quick action).

### notification_filter — notification centre

- **What:** hides whole groups of notification-centre entries by the client's own notification types: `hide_promo` (web promo pop-ups, the WoT Plus intro, auction, black market and resource well announcements), `hide_reminders` (recruit, e-mail confirmation, Battle Pass chapter and task reminders, missing events), `hide_friend_requests`, `hide_clan` (clan invites and applications). Plain messages (battle results, purchases, the mod's own) and platoon invites are never hidden. A hidden entry is neither listed nor counted. On 1.45 the auction start and the Trading Caravan refill share type 19; the filter tells them apart by the notification's class (`IntegratedAuctionStageStartDecorator` vs `TradingCaravanRefillDecorator`), so `hide_promo` never hides the caravan refill, and a type-19 notice of an unknown class stays.
- **Fair play:** hangar only; it only hides notifications.
- **Switch:** `hangar_notification_filter`. **Section:** `hide_promo` (on), `hide_reminders`, `hide_friend_requests`, `hide_clan` (off).

### hangar_cleaner — cleaner hangar

- **What:** hides the promo teaser (the hangar's pop-up promo card), the offer banners and, optionally, the event entry points of the carousel. Takes effect the next time the hangar view is created.
- **Private overrides:** the teaser and the event entries have no public seam, so they override the Hangar view's name-mangled methods. That happens only on a client version in `model.VERIFIED_CLIENTS` (the RU 1.45 source was read), only when the `Hangar` class itself defines both methods (and the Flash call for the entries), and before any hangar is populated; on any other client both stay as the game shows them and `python.log` says why (`hangar cleaner: hooks …`). A new client version is added after its `Hangar.py` is checked. The offer banners use public seams only.
- **Fair play:** hangar only and cosmetic.
- **Switch:** `hangar_cleaner`. **Section:** `hide_teaser` (on), `hide_offer_banners` (on), `hide_event_entries` (off).
- **Left out:** CSS injection into Gameface hangar views (banner widgets of the new lobby): the selectors change with every patch and cannot be verified without the live client.

### Left out of the component catalogue (fair play or unverifiable)

From the research's "who does it best" list, these stay out:

| Component                                                                                                                                                                   | Why                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Penetration calculator in the reticle, skins with armour zones                                                                                                              | Lesta's item 12 (in-battle armour analysis, "will be forbidden")                                                                                       |
| Arty trajectory/"artometer", tracer-based positions, lost-enemy markers, gun directions on the minimap, "nearest enemy" at the lamp, enemy reload timers, destroyed objects | Lesta's forbidden list (items 1–10)                                                                                                                    |
| Player panel ratings / "оленемер" (other players' stats in battle)                                                                                                          | the research's decision: conflict-prone, and it reads other players' data; the mod reads only the player's own                                         |
| Player panel and vehicle marker restyling (names, icons, HP on markers)                                                                                                     | needs patching the Scaleform players panel / markers2d; no verifiable Python API                                                                       |
| Safe Shot (blocking the own shot at allies and wrecks)                                                                                                                      | overrides the shooting path in battle; doubtful without a written МОСТ/Lesta answer                                                                    |
| Distance and shell flight time in the reticle, server reticle on a key                                                                                                      | reads the aim point in battle (close to "smart reticle"); writing client settings in battle breaks the hangar-only rule for client settings            |
| Commander camera, zoom beyond x25, sway removal (PMOD), fog removal                                                                                                         | override the camera/graphics configuration beyond the game's options; waiting for Lesta's written confirmation                                         |
| White wrecks, highlighted broken tracks                                                                                                                                     | texture replacement assets in `res_mods`; nothing to ship without our own art                                                                          |
| Damage direction indicator extensions                                                                                                                                       | a longer or larger indicator shows attackers the client no longer shows                                                                                |
| An animated kill cam (the shell flying from the shooter to the hit point), the shooter's direction on the minimap                                                           | a reconstructed trajectory or a minimap mark shows where an unseen shooter was (Lesta's items on tracers and positions); death_card is the fair subset |
| Hiding the own name and clan in the game's interface                                                                                                                        | patching the Scaleform players panel and headers; streamer_mode hides the mod's panels and the chat instead                                            |
| Clan attendance of other members, platoon mates' statistics                                                                                                                 | other players' data; platoon_helper shows the platoon window's ready marks and the own battles only                                                    |
| Hits drawn on the hangar's 3D model                                                                                                                                         | needs the hangar vehicle's collision boxes and decals, unverifiable without the client; battle_hits shows a 2D schematic and a list instead            |
| Voice-overs                                                                                                                                                                 | heavy sound banks; the event-sounds component plays any installed bank instead                                                                         |
| FPS limiter, Reflex, Anti-Lag                                                                                                                                               | OpenWG Common does it; installed as a dependency, not re-implemented; external .exe tweakers are grey                                                  |
| Carousel filters, a three-row carousel, the vertical tech tree                                                                                                              | patching the Flash carousel / tech tree                                                                                                                |
| Auto-accept rewards                                                                                                                                                         | economic actions without the player's confirmation                                                                                                     |

## Assets and licences

Images and sounds the packages ship live in [assets/](assets/README.md), one set per folder with its licence; [assets/assets.json](assets/assets.json) lists every set (feature, author, SPDX licence, source URL, in-game `target`). The build adds a feature's sets to its package with the licence file and [assets/THIRD_PARTY_NOTICES.md](assets/THIRD_PARTY_NOTICES.md) (`res/gui/maps/icons/otmetki/<feature>/THIRD_PARTY_NOTICES.md`). Third-party sets must be under a licence that allows redistribution in a paid product (CC0, CC-BY, CC-BY-SA, MIT, BSD, Apache-2.0, MPL-2.0; never NonCommercial or unclear); `tools/build/tests/test_asset_sets.py` enforces it, that the notices are current and that every source is rendered. Our own artwork is original, (c) Три отметки; popular packs were a visual reference only.

```bash
python tools/build/asset_sets.py --write                   # regenerate assets/THIRD_PARTY_NOTICES.md (--check: fail when stale)
uv run python tools/assets/render.py                       # SVG / third-party PNG sources -> the PNG renditions (resvg-py, Pillow)
uv run --with lameenc python tools/assets/sound.py         # re-synthesise the sixth-sense chime (MP3)
```

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
  - It has no binary releases: build the tag with CMake, as [.github/actions/modpack-release](../../../.github/actions/modpack-release/action.yml) does for `modpack.yml` and `release.yml`. Pass `--owg-compiler PATH` or set `$OWG_PYTHON_COMPILER`.
  - **Unverified:** that `--filename-root scripts` gives `co_filename` `scripts/client/gui/mods/...`. Check a traceback in `python.log` after the first owg-built release.
- **`py27`**: a Python 2.7 interpreter running `py_compile`, with `dfile` set to the in-package path. Looked up as `--python27`, `$OTMETKI_PY27`, `$PYTHON27`, `py -2.7`, `python2.7`, `python2`, `C:\Python27\python.exe`.

Without either, the packages carry `.py` sources and the build prints a warning. They load in development clients only.

### Publishing a release

Releases live on our VPS only (no S3, CDN or GitHub Releases), under `https://triotmetki.ru/downloads/`. Bump `VERSION` (the companion's is the release version) and the CHANGELOG, then run [.github/workflows/release.yml](../../../.github/workflows/release.yml) with that `version` and the supported client versions in `games` (`1.46.*`). It builds the release packages and the catalogue with the steps above, the manager installer around that catalogue, signs the release for the manager and publishes `modpack/<version>/` (the split packages, `otmetki.<version>.mtmod`, `catalog/`), `otmetki.mtmod` (the single package behind the /mod page's manual download), the installer and `releases.json`. The manager installs from that index ([manager README «Releases»](../manager/README.md#releases)); first-time setup is [docs/ops/deploy.md §4](../../../docs/ops/deploy.md#4-game-mod-releases-on-the-vps).

## Tests

```bash
bun run test:modpack                     # from the repo root: python apps/game/modpack/tools/run_tests.py
cd apps/game/modpack && uv sync && uv run pytest && uv run ruff check .
```

- `tools/run_tests.py` needs only the standard library and runs every `tests/` folder (`packages/*`, `features/*`, `tools/**`). It also runs on Python 2.7, where the build tool's own tests are left out.
- pytest runs the same unittest-style tests, with its config in `pyproject.toml`.
- `ui-web`: `bun run ui:test` (or the repo's `bun run test`, Vitest project `modpack-ui`, which runs on the ui-web Vite config). `tools/tests/test_ui_smoke.py` loads the ui with stubbed Gameface, ModsList, InputHandler and settings core, opens the window and drives it with page messages.
- The pre-commit hook runs `test:modpack` when a staged Python file is under `apps/game/modpack`.
- [.github/workflows/modpack.yml](../../../.github/workflows/modpack.yml) runs pytest, the stdlib runner, ruff and vermin on Windows for pull requests.

The tests are pure logic and need no game client:

- payload building, including the "no other players' data" check;
- HMAC signing (RFC 4231 vector, shared with the server's test);
- session aggregation and the session panel;
- MoE maths (`core/moe`: EMA, curve, targets, step, battles forecast, pace, curve cache), the MoE panel and the hangar marks;
- the HUD renderer chain, the text diff and transient placement of the layer, the Gameface surface protocol (with the page's fixture);
- outbox batching and backoff;
- the sender with a fake transport;
- binding;
- config, settings template and i18n;
- the core runtime: event bus, hooks and overrides, the registry in every load order, schema settings, the i18n catalog, storage;
- the thread and sync transports against a local HTTP server;
- replay auto-upload: header matching, lookup, multipart and signed headers, size limit, queue dedupe/persistence/backoff, the background runner, the settings switch and the contract/server limits;
- hangar ratings: the signed request bodies against `contract/ratings.schema.json`, the response examples, dropping an answer about another account, the per-session cache (in flight, backoff, refresh after a battle) and the panel text per metric switch;
- the own /mod/me reads (`core/me`): bodies, the tank rows with records and expected values, dropping other accounts, retry delays, the read state; goals, replay analysis and session share against their contracts and examples;
- personal best (record book, beaten records, the line and the card), goals (progress, the damage an average needs, one announcement per goal), «Основной калибр» (threshold, share), battle efficiency (WN8 of a battle, the damage line), consumables, reload timer, the damage log's sources, ammo rack, class glyphs, colours and last hit, team HP icons, replay search/filters/sorting and the analysis watch, the hangar's interface scale, style removal and vehicle line;
- the package layout and the build: paths, meta.xml, dependencies, single vs split;
- a client import smoke: the entry scripts in shuffled orders against stubbed client modules, then a login and a battle through the hooks; RU 1.45-shaped fakes of the equipment and ammo controllers, the damage extras, the dossier max records, the site answers (tanks with records, goals, replay analysis), the MP3 path, the customization processor and the lobby's battle-level table drive the new panels.

`tools/tests/test_py27_compat.py` guards Python 2.7 compatibility of the game sources (not the tests):

- it scans for syntax Python 2.7 lacks: f-strings, annotations, keyword-only args, `nonlocal`, `print` without `__future__`, unguarded py3-only imports;
- it checks that pure modules never import client modules;
- on Python 2.7 it compiles every source instead of the scan.

Lint and extra checks:

- ruff with `target-version = "py37"` (its oldest) and only the `E`, `F`, `W` rules. pyupgrade and bugbear stay off: they suggest Python-3-only code.
- `vermin --no-tips --violations -t=2.7- -t=3.0- --exclude-regex "tests|tools" packages features` reports minimum versions 2.6 and 3.0. The deliberate py2/py3 import fallbacks are marked `# novermin`.
- `pip install jsonschema` (or `uv sync`) enables the schema tests.

## Install (players)

The modpack manager ([apps/game/manager](../manager/README.md), `otmetki-manager-setup.exe` from triotmetki.ru/mod) finds the client, offers presets and profiles, backs up the mod folders, can roll back and moves the modpack after a client patch. By hand:

1. Copy the packages into `<game>/mods/<client version>/`: `net.triotmetki.core_<v>.mtmod`, `otmetki.companion_<v>.mtmod` and the features you want, or the single `otmetki.<v>.mtmod`. Do not mix the single package with the split ones.
2. Optional: install ModsSettingsAPI (izeberg) with ModsList (poliroid) and OpenWG Gameface to get the settings window and binding UI. ModsList master needs WG 2.4.1+; on Lesta use a release that supports the client. Without them, edit `mods/configs/otmetki/config.json`.
3. Optional: the on-screen panels need a HUD renderer: OpenWG Gameface (its Lesta build) with our ui package, or GUIFlash 0.6.6. The manager installs both from their authors' pinned releases when a component that needs them is selected (catalog `kind: "dependency"`, [catalog README](catalog/README.md#componentsjson)); by hand: OpenWG Gameface from gitlab.com/openwg/wot.gameface/-/releases, GUIFlash 0.6.6 (`gambiter.guiflash_0.6.6.mtmod` from github.com/CH4MPi/GUIFlash; the 2019 0.3.1 build does not load on 1.45). Without one, the session summary comes as a system notification after each battle, and the battle panels are off.
4. Bind: on the site, open Profile → Mod, copy the code, then paste it into the mod settings and press «Привязать».

`mods/configs/otmetki/config.json` (created on first start):

| Key                                                                                                                                                                                                                                               | Default                     | Meaning                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `enabled`                                                                                                                                                                                                                                         | `true`                      | Master switch                                                                                                                              |
| `server_url`                                                                                                                                                                                                                                      | `https://api.triotmetki.ru` | API base. Must be https, or http://localhost / http://127.0.0.1 for development.                                                           |
| `send_battle_results`, `send_moe_snapshots`, `send_queue_times`, `send_loadouts`, `send_shots`                                                                                                                                                    | `true`                      | Per-feature data switches                                                                                                                  |
| `battle_moe_panel`, `hangar_session_panel`                                                                                                                                                                                                        | `true`                      | UI switches                                                                                                                                |
| `battle_damage_log`, `battle_hit_log`, `battle_clock`, `battle_team_hp`, `battle_sixth_sense`, `hangar_battle_results`                                                                                                                            | `true`                      | Battle HUD switches; their look and position live in `components.json` (see [Battle HUD](#battle-hud))                                     |
| `battle_sounds`, `battle_chat_filter`                                                                                                                                                                                                             | `true`                      | Battle extras (see [Battle extras](#battle-extras))                                                                                        |
| `hangar_replay_manager`, `hangar_tweaks`, `minimap_tweaks`, `camera_tweaks`, `crosshair_presets`, `hangar_info`, `hangar_marks_history`, `hangar_ratings`, `hangar_marks`, `hangar_auto_resupply`, `hangar_notification_filter`, `hangar_cleaner` | `true`                      | Hangar and client-settings components (see [Hangar and client-settings components](#hangar-and-client-settings-components))                |
| `battle_personal_best`, `battle_main_gun`, `battle_efficiency`, `battle_consumables`, `battle_reload_timer`, `hangar_session_goals`                                                                                                               | `true`                      | The personal best, «Основной калибр», battle efficiency, consumables and reload panels, the goals from the site                            |
| `battle_received_hits`, `battle_death_card`, `battle_loadout`, `streamer_mode`, `hangar_personal_missions`, `hangar_platoon_helper`, `hangar_tilt_guard`                                                                                          | `true`                      | Hits on you, the death card, the loadout panel, the streamer mode, the personal missions helper, the platoon helper, the break reminders   |
| `hangar_battle_hits`, `battle_gun_arc`, `battle_bush_circle`                                                                                                                                                                                      | `true`                      | Battle wounds in the hangar, the gun traverse readout, the 15 m circle (by its hotkey by default)                                          |
| `share_session_report`                                                                                                                                                                                                                            | `false`                     | Send the session report to your own Telegram / Discord through the site (opt-in, [Session report sharing](#session-report-sharing-opt-in)) |
| `share_session_channel`                                                                                                                                                                                                                           | `telegram`                  | `telegram`, `discord` or `both`                                                                                                            |
| `session_idle_minutes`                                                                                                                                                                                                                            | `60`                        | New session after this idle gap (10–1440)                                                                                                  |
| `flush_interval_seconds`                                                                                                                                                                                                                          | `15`                        | Send interval (5–600)                                                                                                                      |
| `upload_replays`                                                                                                                                                                                                                                  | `false`                     | Upload the game's own replays of your battles (opt-in)                                                                                     |
| `publish_replays`                                                                                                                                                                                                                                 | `false`                     | Make auto-uploaded replays public; off keeps them private (owner only)                                                                     |
| `bind_code`                                                                                                                                                                                                                                       | `""`                        | Fallback binding without ModsSettingsAPI; cleared after use                                                                                |
| `language`                                                                                                                                                                                                                                        | `auto`                      | `ru`, `en` or `auto` (client language)                                                                                                     |

The device secret is stored in plain text in `credentials.json` (and its durable copy, see [Durable settings](#durable-settings-appdatatriotmetki)), as other mods store tokens. It is scoped to one device and one account, and the user can revoke it on the site.

## Durable settings (`%APPDATA%\TriOtmetki`)

МОСТ can delete `mods/configs` ([docs/ops/most-publishing.md](../../../docs/ops/most-publishing.md)), so the files a player cannot recreate by hand have a second copy outside the game folder (`core/durable`, opened with `open_config(config_dir, name)`):

| File               | Written by                        | What                                                                    |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------- |
| `credentials.json` | companion (binding)               | `{accounts: {<account id>: {device_id, secret, account_id, bound_at}}}` |
| `config.json`      | companion (every settings change) | switches and data settings (table above)                                |
| `components.json`  | core HUD / every component        | one schema-checked section per component                                |
| `profiles.json`    | ui (profiles), manager            | `{version: 1, active, profiles: [...]}` (see [In-game UI](#in-game-ui)) |
| `state.json`       | companion (`app.save_state()`)    | the app's small state parts                                             |
| `saved_at.json`    | both sides, one per folder        | `{version: 1, files: {<name>: <unix seconds of the last save>}}`        |

- **Where:** `%APPDATA%\TriOtmetki\` (Windows: `os.environ['APPDATA']`; on Python 2 a value the ANSI code page cannot hold is re-read through `GetEnvironmentVariableW`). Without `APPDATA`: `~\AppData\Roaming\TriOtmetki` on Windows, `~/.config/TriOtmetki` elsewhere; without a home folder the mirror is off and plain `mods/configs/otmetki` files are used. Paths are text on both Pythons, so a Cyrillic user or game folder works.
- **Write-through:** every save writes `mods/configs/otmetki/<name>`, then the `%APPDATA%` copy, with the same stamp in each folder's `saved_at.json` and as the file's mtime. A failing `%APPDATA%` write never fails the save.
- **Restore on load:** each read compares the two copies. A copy's stamp is the later of its `saved_at.json` entry and its mtime, so a hand edit or the manager's write counts as a save. The game-folder copy is rewritten from `%APPDATA%` when it is missing, unreadable or older; the `%APPDATA%` copy is rewritten when it is missing or older; on a tie (within 10 ms) the game-folder copy wins. The newer copy always survives.
- **Credentials:** owner-only mode (`0600`) where the platform has it; on Windows the per-user ACL of `%APPDATA%` is what protects them. The device secret stays revocable on the site.
- **Not mirrored:** outboxes, replay queues, the marks history and the settings backup (per account, rebuilt or re-sent).
- **For the manager app:** it reads the same files from `%APPDATA%\TriOtmetki`. When it writes one, it writes the whole JSON file atomically (temp file + rename) and sets the file's entry in that folder's `saved_at.json` to the current unix time; the mod picks the newer copy up at the next client start. The folder is shared by every client installation of the Windows user.

## Publishing via МОСТ

МОСТ is Lesta's official mod installer. The curators check every mod against the fair-play rules, and МОСТ delivers the files and updates to players. There is no upload API: a mod is proposed in the МОСТ forum topic, and the author still ships a working build within 7 days of each client patch. The researched requirements, the step-by-step checklist and what only the account owner can do are in [docs/ops/most-publishing.md](../../../docs/ops/most-publishing.md).

`tools/most` assembles the submission bundle from a release build:

```bash
python tools/build/build.py --require-pyc                  # dist/*.mtmod with bytecode
bun run most:bundle --game-version 1.45.0.0                # uv run python tools/most --packages dist --release
python tools/most --game-version 1.45.0.0 --only companion marks_panel --strict
```

| Option                      | Meaning                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--game-version` (required) | Client version, `X.Y.Z.W`: the forum title prefix and the `mods/<version>/` folder in the install text                                               |
| `--packages`, `--out`       | Split packages (default `dist`) and the bundle folder (default `dist/most`)                                                                          |
| `--release`                 | `.py` sources in a package are an error (the production client loads only `.pyc`)                                                                    |
| `--changelog`               | Default `CHANGELOG.md`: `## <id> <version>` entries, or `## <version>` for every component at that version; each with `### ru` and `### en` sections |
| `--only ID ...`             | Bundle some components; a left-out dependency is a warning                                                                                           |
| `--skip-images`, `--strict` | No preview rendering; fail on warnings too                                                                                                           |

For every component, `dist/most/<id>/` gets the following. `dist/most/index.json` lists every component and its findings, each with the URL of the rule it comes from (`tools/most/rules`).

- the unchanged `.mtmod` and its extracted `meta.xml`;
- `previews/preview-1280x720.png` and `preview-640x360.png`, rendered from the catalog SVG through setupkit's resvg renderer (needs `uv sync`; without it the SVG is copied and a warning is printed);
- `screenshots/`, copied from `catalog/screenshots/<id>/` (at most 3);
- `description.ru.md` / `description.en.md`, built from the catalog texts, the fair-play note, the data note, the dependencies and the changelog text in the same language (the Russian page falls back to the English text only when an entry has no `### ru`);
- `changelog.md`, the entry with both language sections;
- `submission.json`, with the forum titles, the dependency list, sha256 and size.

The checks:

- the file name and the `meta.xml` id, version and dependencies against `tools/build/layout.py`;
- a zip with `meta.xml` at its root;
- bytecode only;
- the ru texts;
- the screenshot count;
- an https video;
- a changelog entry.

The tool is Python 3 only (it reuses `tools/build` and setupkit). Its tests live in `tools/most/*/tests` and are skipped on Python 2.7.

The companion's `meta.xml` id stays `otmetki.companion` forever, so a new version replaces the old one. Bump `VERSION` on every release. Every `VERSION` bump adds a `## <id> <version>` entry with `### ru` and `### en` sections to [CHANGELOG.md](CHANGELOG.md) (a test checks every catalogued component and both languages).

## Verified and not verified

**Verified on the development machine (Python 3.12, 2026-09-27):**

- the pytest and stdlib-runner suites, including schema validation with `jsonschema`. The stdlib runner also passes on Python 2.7.18 (a portable build, 390 tests without the build tool's own);
- the thread transport works against a real local HTTP server;
- `vermin` confirms the sources are 2.7-compatible;
- `tools/build/build.py` with a Python 2.7 interpreter produces valid stored zips with `.pyc`, for every package and for `--single`;
- not run here: the owg_python_compiler backend (no C++ toolchain on this machine).

**Checked against client sources only (RU branch of IzeBerg/wot-src, 1.45):**

- the names and signatures of `g_playerEvents` events;
- the battle-result field names, dossier record names and the feedback event types;
- `Account.databaseID` and `Account.name`, `BattleResultsCache.load` / `convertToFullForm` and `IBattleResultsService.onResultPosted(reusableInfo, composer, window)`;
- `response.headers()` of `BigWorld.fetchURL` responses; the settings-core write order (`applySettings` → `applyStorages(False)` → `confirmChanges(confirmators)` → `clearStorages()`) and `AccountSettings.getSettings/setSettings`;
- the `SystemMessages.pushMessage` signature.

**Not verified (needs the live client):**

- `onBattleResultsReceived` actually firing on Lesta 1.45 (the on-disk cache read exists for early exits);
- the `BigWorld.fetchURL` keyword arguments with a non-empty headers dict;
- GUIFlash 0.6.6 on the live Lesta 1.45 client (its source imports `WindowLayer` and has a Lesta note; not run here), and its label props (`x`, `y`, `alignX`, `alignY`, `drag`, `border`, `isHtml`, `multiline`);
- the Gameface HUD: that `openwg_gameface.res_id_by_key('otmetki/ui/hud')` resolves after the one-time restart; that a non-modal `WindowImpl(WindowFlags.WINDOW, layer=WindowLayer.WINDOW)` opens over the Scaleform battle page (the client opens Gameface popovers and tooltips in battle, RU 1.45 source), draws above it, takes no keyboard focus and passes the mouse through `pointer-events: none`; whether it survives the hangar-to-battle switch (a destroyed window reopens on the next update); that Gameface's root font size is the interface scale (the page's rem positions); `img://` images in a Gameface `<img>`; `GameEvent.SHOW_CURSOR`/`HIDE_CURSOR` reaching the global event bus in battle;
- the ModsSettingsAPI `TextInput` button callback payload;
- the `.mtmod` packages loading side by side from `mods/<version>/` with their paths merged under `gui/mods/otmetki/`, and whether the client reads the `<dependencies>` block of `meta.xml`;
- `vehicleTypeDescriptor.type.compactDescr` on the avatar;
- `ArenaType.g_cache[...].geometryName`;
- the settings core on Lesta 1.45: `skeletons.account_helpers.settings_core.ISettingsCore`, `getSetting`, the setting names in `companion/client/settings_core.CORE_NAMES` and their value scales (sensitivity, volume);
- the confirm dialog (`DialogsInterface.showDialog` + `SimpleDialogMeta` / `I18nConfirmDialogButtons`);
- battle HUD: GUIFlash on Lesta 1.45 at all; the `alpha` label prop; that the `x`/`y` in `COMPONENT_EVENT.UPDATED` are in the same space as the ones passed to `createComponent` (relative to `alignX`/`alignY`); `<img src="img://...">` in a label; the hit-state events arriving before the matching damage event (the 2 s merge window); `vehicleType.maxHealth` on every vehicle info at `battle_ready`; `arena.periodEndTime` against `BigWorld.serverTime()`; `SoundGroups.g_instance.playSound2D` with a mod bank's event; that `onPlayerSummaryFeedbackReceived` fires on Lesta; the assets: PNG with alpha through `img://gui/maps/icons/otmetki/...` from inside a `.mtmod`, that a centre-aligned GUIFlash label is centred on its anchor (the crosshair mark's position assumes it), `res/audioww/sixthSense.mp3` from a `.mtmod` passing `ResMgr.isFile` and `WW_prepareMP3`, and the `bulbVoices` index order;
- in-game UI: OpenWG Gameface's Python API on Lesta (`ModDynAccessor`, `gf_mod_inject`, `ViewModel._addStringProperty/_addCommand/_setString`, `WindowImpl(wndFlags=WindowFlags.WINDOW)`), that `mods/configs/res_map/*.json` is read from inside a `.mtmod`, the command argument shape (`{message}`), `viewEnv.getClientSizePx()`, rem scaling and the CSS Gameface supports (flex, `rgba()`), `HangarCrewWidget._onLoading` + `setChildView` hosting the button (the only 1.45 host in `BUTTON_HOSTS`), how the injected `button.js` reaches its model (`window.subViews` / `window.model`), the ModsList `addModification` keywords, `InputHandler.g_instance.onKeyDown`, `BigWorld.openWebBrowser` opening the site, and the `Warhelios` font name;
- client-settings components: the setting names and value formats `minimapSize` (AccountSettings), `minimapAlpha`, `showVehModelsOnMap`, `minimapMaxViewRange`, `sniperZoom`, `dynamicCamera`, `horStabilizationSnp`, `carouselType`, `doubleCarouselType`, the `arcade`/`sniper` reticle dicts with their part names and style indexes, `useServerAim`;
- hangar quick actions: `Vehicle.optDevices.installed`, `OptionalDevice.isRemovable`, `getInstallerProcessor(vehicle, device, slot, install=False)`, `TankmanUnload(vehicle)`, `Processor.request(callback)`, `IItemsCache.items.freeTankmenBerthsCount()` and `getVehicle(invID)` returning the updated vehicle after each answer;
- replay upload: the `./replays` folder (the private `_BattleReplay__replayDir` is not read), the `replayEnabled` values, when the client appends the results block to the replay file, and that the header `dateTime` is local time (the replay auto names rely on the same header);
- round-4 components, from the RU 1.45 source, not run in the client: `TANKING` and `RECEIVED_CRIT` carrying the attacker as the target id and an `isRicochet()` on the blocked extra; `PlayerAvatar.showOwnVehicleHitDirection` and the frame of `hitDirYaw`, `BigWorld.entity(playerVehicleID).yaw`; `Vehicle.optDevices.slots[i].categories`, `OptionalDevice.descriptor.categories`, the items' `icon` path and `battleBoosters`; `IEventsCache.getPersonalMissions().getAllQuests()` and its getters on the reworked personal missions; `g_prbLoader.getDispatcher().getEntity().getPlayers()` and `PlayerUnitInfo.isReady`; the clan bonus type ids; `InputHandler.onKeyDown` in battle for the streamer hotkey;
- round-5 components, checked against the RU 1.45 source but not run in the client: `Vehicle.showDamageFromShot` being called for the own vehicle with the encoded points and `isPlayerVehicle` set, the point encoding of `DamageFromShotDecoder.decodeSegment` and the model axes; `gun.turretYawLimits` and `gunRotator.turretYaw` on the avatar and the sign of the yaw; `BigWorld.PyTerrainSelectedArea` with `CheckPoint.visual`, `BigWorld.Servo(vehicle.matrix)`, `player.addModel/delModel`; `gunSettings.getPiercingPower/getShotSpeed`, the shell descriptor's `avgDamage` and `g_cache.commonConfig['miscParams']['projectileSpeedFactor']`; `Vehicle.name` holding `nation:tag` for the armour link;
- round-3 components, checked against the RU 1.45 source but not run in the client: `WWISE.WW_prepareMP3` with a file other than `sixthSense.mp3` and the `sixthSense` event playing it in the hangar; `getRandomStats().getMaxDamage/Assisted/Frags/Xp` on the hangar dossier; the extra's `isFire/isRam/...` on received damage and the `ammoBay` device state reaching `onVehicleStateUpdated` next to the hit; `BASE_CAPTURE_DROPPED` carrying the reset points as its extra; `shared.equipments` / `shared.ammo` events and `getOrderedShellsLayout()` descriptors' `kind`; `OutfitApplier` with an empty outfit taking a style off; `interfaceScale` taking the option index; `getRandomBattleLevelsForDemonstrator()` holding every vehicle class; `Tankman.roleUserName`;
- round-2 components, checked against the RU 1.45 source but not run in the client: the chat layout overrides (`BattleLayout.addMessage/addCommand`, `_ChannelController._formatMessage`) and that a GUIFlash `<font>` stamp renders in the battle chat; `NotificationsModel.addNotification` being the only entry for server notifications; the Hangar view's name-mangled `_Hangar__onTeaserReceived` / `_Hangar__updateCarouselEventEntryState` (version-gated) and `IOffersBannerController.showBanners` / `OfferBannerWindow.tryLoad` (overrides apply from the next hangar view); `VehicleAuto*Processor.request` answering through the callback with `result.success`; `TankmanReturn` for a vehicle with `lastCrew`; `IServerStatsController.getStats()` in the hangar, `g_preDefinedHosts.getHostPingData(url)` for the current server; `VEHICLE_VIEW_STATE.FIRE`/`DEVICES` reaching `onVehicleStateUpdated` for the own vehicle; `items.vehicles.getVehicleType(cd).shortUserString`.

### Live-client smoke checklist

1. The Python log (`python.log`) shows `[OTMETKI] started <version>` and `[OTMETKI] feature <id> attached` for every installed feature.
2. The mod appears in the ModsSettingsAPI window, and binding with a code from the site succeeds.
3. After a random battle, `outbox_<id>.json` empties within about 15 s and the API shows the battle.
4. Selecting a tier 5+ vehicle sends a `moe_snapshot`, and the «Отметка» hangar panel shows the percent, the damage to 65/85/95% and «до N%: ~K боёв» (after three own battles on the tank). In battle the MoE panel shows the start and projected percent; dealing damage raises the projection, spotting after the tank is destroyed still adds; each style and a custom template (`{percent}|{need95}`) render; the panel can be dragged with Ctrl and keeps its place.
   Renderer: `python.log` has `[OTMETKI] HUD renderers: gameface, guiflash` (or the installed subset) and, per missing backend, the reason. With OpenWG Gameface and the ui package: the HUD edit mode shows every panel in the hangar through one Gameface window; in battle the panels draw over the battle page, WASD/mouse control is unaffected, Ctrl shows the cursor and the panels become draggable (framed), and a dragged panel keeps its anchor next battle. Without Gameface (or with it removed) the same happens through GUIFlash 0.6.6; with neither, the panels are off and the log says so.
5. With the network off, events stay in the outbox and are sent after reconnect.
6. With GUIFlash installed, a random battle shows the damage log, hit log, clock, team HP panels; shots at an enemy add hit-log lines; Ctrl-dragging a panel and re-entering battle keeps its position (`components.json`); the sixth-sense text appears with the vanilla lamp; after the battle a «Три отметки: победа/поражение…» notification appears in the hangar.
7. Round-2 components: in the hangar the clock/server/ping/online label appears (GUIFlash) and ticks; the marks history label shows the selected tier 5+ tank after one battle and the window's «История отметок» page lists it with details; the battle summary page shows the session row and a battle's details after a random battle; «Применить к выбранному танку» with auto repair «Включено» changes the ammunition panel's flag; «Вернуть прежний экипаж» after «Экипаж в казарму» brings the crew back; with `hide_promo` a promo pop-up no longer lands in the notification centre; the promo teaser and offer banners do not show after re-entering the hangar; in battle a repeated chat line from another player shows once, every line carries a time stamp, and with `battle_sounds.fire` set to a loaded Wwise event the sound plays when the own tank burns; with `auto_rename` on, the new replay gets the template name about 15–30 s after the results arrive, and the replay upload still finds it.
8. Hangar ratings (bound mod, GUIFlash): the «Мои рейтинги» label appears in the hangar with the account line; selecting another tank adds its line within a few seconds (`python.log` has no `hangar ratings` errors); after a random battle the session line changes about 20 s after the results; switching `metric_wn8` off in the window removes WN8 at once; «Обновить» re-reads; with the network off the label keeps the last values; after revoking the device on the site the next read shows the rebind notice.
9. Round-3 components: in battle the personal best line counts down on a tank with a record and the card and chime come after a battle that beat it; «Основной калибр» grows with own damage; the consumables line follows a used medkit; the reload countdown matches the reticle's; a received ram or fire shows in the damage log and the last-hit pop-up with the attacker's class glyph; team HP `icons` shows a bar per tank. In the hangar the clock label's third line shows the battle tiers and crew XP of the selected tank; «Снять стиль» takes the style off; the interface scale changes the game's option. With the server endpoints live: the goals label, the analysis notice after an upload, and a session report in Telegram after turning `share_session_report` on.
10. With OpenWG Gameface installed (its Lesta build): after the one-time restart the hangar shows the «///» button (or the ModsList entry / Ctrl+Shift+T opens the window); switching a component off, choosing a minimap size and saving/loading a profile change `config.json`, the game's own minimap setting and `profiles.json`; the HUD editor moves a panel and the next battle shows it there; the replay manager lists own replays and «На сайте» opens the uploaded one.
11. Round-4 components: in battle the «По вам» log adds a line per hit taken (a ricochet shows as «рикошет» or, if the client does not tell it apart, as «не пробил»); after the own tank is destroyed the death card names the shooter, the shell, the damaged modules and a side that matches the game's hit indicator (also check whether Lesta 1.45 has a built-in kill cam); the loadout panel shows the icons of the tank's equipment with ★ on the bonus slots; Ctrl+Shift+H hides every panel of the mod in battle and in the hangar and brings them back; the private mode hides the battle chat of others and the ratings and session labels; the ЛБЗ label lists the missions in progress; in a platoon the label shows the mates' ready marks; three losses in a row bring the break reminder; the one-colour centre marks draw in the chosen colour.

12. Round-5 components: after a battle in which the tank was hit, the «Боевые раны» label appears in the hangar and the window page shows the battle with dots on the right part and side (a hit on the upper front plate lands on the hull's front; if left and right come out mirrored, flip the x axis in `battle_hits/model/points`); the damage per hit matches the damage log; on a tank destroyer the УГН readout counts down as the gun turns and turns red at the stop, and shows nothing on a tank with a full turret turn; Ctrl+Shift+B draws a 15 m circle under the tank that follows it and disappears on the next press and when the tank is destroyed; with shell stats on, the loaded shell's penetration, damage and velocity match the game's shell tooltip and follow a shell switch; «Броня на сайте» opens the tank's armour page.

## TODO

- Confirm the Gameface HUD window on the live client (checklist item 4, «Renderer»). If wulf windows turn out to take input or stay under the battle page, keep GUIFlash 0.6.6 as the battle renderer and use Gameface for the hangar only (the chain already supports that split by availability).
- The marks forecast from the site: `/mod/me` could return the site's `next-mark` forecast per tank (a contract change); the mod estimates locally today.
- Hide the HUD page while the full stats (Tab) or the radial menu are open, as GUIFlash does.
- A smoke import of the client glue against the stubs from `IzeBerg/wot-src`. The smoke test uses hand-written stubs today.
- Profile sync with the site: a contract and endpoint for `profiles.json` (the settings-share contract excludes mods by design).
