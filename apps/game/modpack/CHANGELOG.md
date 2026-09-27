# Changelog

The modpack's release notes. Every package has its own entry, `## <id> <version>`, where `<id>` is its key in `installer/catalog/catalog.json` and `<version>` the `VERSION` of its package. A modpack-wide `## <version>` entry describes a release as a whole. `tools/most` copies a component's entry into its МОСТ submission (`dist/most/<id>/changelog.md` and the «Изменения» section of the page), and `tools/most/texts/tests/test_most_changelog.py` fails when a catalogued component has no entry for its current version.

Add the new entry on top of the component's previous ones when you bump a `VERSION`.

## 0.1.0

The first release of Три отметки for «Мир танков» 1.45 (Lesta), as split `.mtmod` packages: the core, the companion, the in-game UI and 22 components. Nothing is sent before the player binds the mod with a code from triotmetki.ru, every component has its own switch, and nothing reads or shows enemy information.

- Battle results, marks of excellence and session stats of the player's own battles, sent to the site in signed batches.
- Battle HUD on a shared draggable layer (GUIFlash): damage log, hit log, clock and battle timer, team HP, sixth-sense alert; event sounds and a battle chat filter.
- Hangar components: battle summary, marks history, own ratings, clock and server, replay manager, quick actions, auto-resupply flags, notification filter, cleaner hangar.
- Client-settings presets (minimap, camera, crosshair) that only set the game's own options, in the hangar, on the player's change.
- The Gameface settings window with profiles and an on-screen HUD editor; ModsSettingsAPI stays the fallback.
- Settings survive a wiped `mods/configs`: the binding, config.json, components.json, profiles.json and the app state are mirrored into `%APPDATA%\TriOtmetki` and restored on the next start.

## core 0.1.0

- The shared runtime of every package: the event bus, guarded client hooks and overrides, the lazy feature registry (any load order), schema-checked settings, i18n, logging, JSON storage with atomic writes, request signing and the HTTP transport.
- The battle HUD layer with `components.json` (one schema-checked section per component) and the HUD edit protocol.
- Durable settings: the files a player cannot recreate are mirrored into `%APPDATA%\TriOtmetki`, and a missing or older copy in `mods/configs/otmetki` is restored on load.
- Pinned Python 2.7 libraries: six, blinker, attrs, enum34.

## companion 0.1.0

- Binding to triotmetki.ru with a one-time code from the site; nothing is collected or sent before it.
- After each own battle: the `personal` block of the battle results, MoE snapshots and distribution, queue times, the loadout and shots, sent in signed batches through an outbox that survives a restart and backs off on errors.
- Per-feature data switches in `config.json`, the ModsSettingsAPI window as the fallback settings UI, and the streamer settings share (export, apply with a confirmation, restore).

## ui 0.1.0

- The Gameface settings window (OpenWG Gameface): a card per installed component built from its own schema, list pages, profiles (save, load, rename, export and import as a code) and the on-screen HUD editor.
- Entry points: the «///» button in the hangar, a ModsList entry and the hotkey Ctrl+Shift+T.

## marks_panel 0.1.0

- In battle: the current MoE percentage, the projection after the battle and the damage still needed for the next mark; team damage is not counted.

## session_stats 0.1.0

- In the hangar: battles, win rate, average damage and WN8 of the current session; a new session starts after `session_idle_minutes` of idle time.

## replay_upload 0.1.0

- Opt-in, off by default: uploads the replays the game itself recorded of the player's own battles, matched by the replay header, private unless `publish_replays` is on. Never turns replay recording on; files above 50 MiB are refused.

## damage_log 0.1.0

- In battle: totals of damage dealt, blocked, assisted (radio, track, stun) and received, with the latest entries (kind, amount, vehicle, shell). Styles `full`, `compact`, `minimal` and a custom template.

## hit_log 0.1.0

- In battle: each own hit on an enemy (penetration, critical, no penetration, ricochet and the rest) with damage, shell, crits and the target's HP after the hit, exactly as the enemy marker shows it; optionally grouped by target.

## battle_clock 0.1.0

- In battle: the local time, optionally the date, and the time left in the current arena period.

## team_hp 0.1.0

- In battle: each team's HP against its maximum as bars and/or numbers, the frag score and the HP difference, from the values the client already shows on markers and team panels.

## sixth_sense 0.1.0

- In battle: a text or icon with the seconds since the client's own sixth-sense lamp lit, and an optional sound from a sound mod. No direction, distance or "nearest enemy".

## battle_results 0.1.0

- In the hangar: a notification after each own battle with the result, XP and credits, combat stats and the MoE change; the mod window lists the session's battles with details.

## battle_sounds 0.1.0

- In battle: a Wwise event of the player's choice for fire, module damage, the ammo rack, injured crew, first blood, the own frag and the own vehicle's destruction. Ships no sound bank.

## chat_filter 0.1.0

- In battle: time stamps on chat lines and hiding of repeats, flood, quick-command spam and lines with blocked words. The player's own lines are never hidden.

## replay_manager 0.1.0

- In the hangar: the player's own replays with map, vehicle, date and size; rename, delete, open the folder, and a link to the uploaded replay on the site. Optional auto names from a template.

## hangar_tweaks 0.1.0

- The client's own carousel options (rows, tile size) and three confirmed quick actions on the selected vehicle: demount removable equipment, crew to the barracks, return the previous crew.

## minimap 0.1.0

- The game's own minimap options: size, transparency, vehicle names and the player's own range circles.

## camera 0.1.0

- The game's own camera options: presets, sniper zoom steps, the dynamic camera and horizontal stabilisation.

## crosshair 0.1.0

- Presets over the game's own reticle settings for arcade and sniper modes, and the server-reticle switch.

## hangar_info 0.1.0

- In the hangar: local time and date, the current server, the client's own ping to it and the online count.

## marks_history 0.1.0

- The MoE percent, marks and moving-average damage after each own battle per vehicle, with the date each mark was reached: a hangar label for the selected tank and a list in the mod window.

## hangar_ratings 0.1.0

- In the hangar, once bound: the player's own site ratings for the account, the latest session and the selected tank, read over signed requests and cached for the game session.

## auto_resupply 0.1.0

- The game's own auto repair and auto-resupply flags (shells, consumables, directives), applied to the selected tank or the whole garage only when the player presses the button.

## notification_filter 0.1.0

- Hides promo, reminders, friend requests and clan invites in the notification centre by the client's own notification types. Plain messages and platoon invites are never hidden.

## hangar_cleaner 0.1.0

- Hides the hangar's promo teaser and offer banners, and optionally the event entry points of the carousel.
