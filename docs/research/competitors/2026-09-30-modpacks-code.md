# Competitor modpacks: code study (research 2026-09-30)

What the popular Lesta 1.45 modpacks and mods do under the hood, and what we should take for our modpack ([apps/game/modpack](../../../apps/game/modpack/CLAUDE.md)). Follows [modpacks round 3](2026-09-29-modpacks-round3.md) (features and installers) and the [client 1.45 hooks reference](../client/2026-09-29-client-1.45-hooks.md); it covers implementation, not feature lists. It describes patterns only: no code or assets were copied.

## 0. What was studied and how

Everything was downloaded and extracted into a scratch folder outside the repo (called `R/` below). No installer, `.exe`, `.pyc` or `.swf` from a modpack was run.

| Package | Version | Source | Extracted to |
| --- | --- | --- | --- |
| Jove's Mod Pack [Lesta] Extended | 1.45.0.0 v100.5 (19.09.2026) | Yandex Disk link on joves-modpack.ru | `R/x/jove/` (innoextract 1.9, Inno 5.5); 96 `.mtmod` unzipped to `R/x/jove_mods/<mod>/` |
| Lebwa modpack | 2026.09.23.01 | `scdn.lebwa.tv` link on lebwa.tv/hub | `R/x/lebwa/mods/<id>_<version>/`, `R/x/lebwa/loose/` |
| Near_You (NYT) modpack | 2026.09.24.01 | nearyou.team/modpack → Yandex Disk | `R/x/nearyou/mods/<id>_<version>/`, `R/x/nearyou/loose/` |
| Battle Observer (Armagomen, WG) | master 23.09.2026, release 1.43.44 | GitHub source | `R/src/battle_observer/` |
| ModsSettingsAPI (izeberg; Aslain fork), Aslain Mod Menu, ModsList | izeberg 20.09.2026, Aslain 19.08.2026, modmenu 27.09.2026, mods-list 1.8.0 | GitHub / GitLab | `R/izeberg-msa`, `R/aslain-msa`, `R/modmenu`, `R/modslist` |
| Earlier refs | OpenWG Gameface 1.2.2, GUIFlash 0.6.6, client 1.45 sources, wotstat, poliroid, openwg common | see [client hooks §0](../client/2026-09-29-client-1.45-hooks.md) | `D:\Project\personal\refs\` |

Standalone mods came inside the packs: kurzdor `battleequipment` 3.10.00 and `advancedconsumablespanel` 1.3.1, poliroid `pmod` 1.81.x, `replaysmanager` 3.8.5/3.8.7, `battlehits` 2.2.6, `modslistapi` 1.6.01, izeberg `modssettingsapi` 1.7.0, XVM 13.1.0.0089/0090, `wotstat.widgets` 2.1.0, `mod.wotStat` 1.6.3.4, protanki `sessionlog`/`gunmarkscalc`/`lasthits`/`smartequipment` 8.1.x, `net.openwg.gameface` 1.1.6, `net.openwg.common` 2.8.x, Lebwa's and Near_You's own mods.

**Aslain's WG modpack** was not downloaded: the download topic on aslain.com renders only for a logged-in browser. Its settings pieces (the MSA fork, Mod Menu) are covered from GitHub.

**Tooling notes** (for the next round):

- Lebwa and Near_You ship **Inno Setup 7.0** installers, which neither innoextract 1.9 nor innounp 2.67 reads. The format is still simple: each file is a chunk behind the `zlb\x1a` magic holding a raw **LZMA2** stream (first byte = dictionary property). The setup header follows the second `Inno Setup Setup Data (7.0.0.3)` string: CRC32, a 64-bit size, a compression flag, then 4 KiB blocks each behind a CRC32, LZMA1 inside. Decoding the chunks with Python `lzma` (`FORMAT_RAW`, `FILTER_LZMA2`) and naming each `.mtmod` by its `meta.xml` id was enough; loose files keep no names.
- Python: `uncompyle6` 3.9.2 on Python 3.8 (3.12 breaks xdis) decompiled 939 of 972 readable `.pyc`, `pycdc` the rest. **About 150 files are PjOrion-protected** (`<pjorion_protected>`: a zlib + bit-reversed first layer, then a control-flow-flattened XOR/`eval` layer) and were not unpacked: pmod, all `tv.lebwa.*`, most `tv.nearyou.*`, kurzdor, several protanki, `damagePanel`. For them we read the AS3 and the configs.
- AS3: JPEXS FFDec 26.3 exported all 93 non-crosshair SWFs (`<name>.as3/` next to each `.swf`).

---

## 1. HUD placement at interface scale and resolution

| Pattern | Who | Where |
| --- | --- | --- |
| Lay out in design pixels (`App.appWidth/appHeight`) and re-lay out on the battle page or stage `Event.RESIZE` | almost every Scaleform panel | e.g. Lebwa `LebwaTopPanel.as`, protanki panels |
| Hook `settingsCore.interfaceScale.onScaleChanged` explicitly | only wotstat widgets | `R/x/jove_mods/wotstat.widgets_2.1.0/.../main/MainView.dec.py:95,393-408` |
| **Follow the live stock panel** instead of a fixed anchor: read the consumables panel's private `_bottomPadding` and `_basePanelWidth`, re-position on `ConsumablesPanelEvent.UPDATE_POSITION` and resize | kurzdor battleequipment | `R/x/lebwa/mods/me.kurzdor.battleequipment_3.10.00/.../BattleEquipment.as:185-296` |
| **Store position as a 0..1 fraction of the free space** (screen minus widget size), snap to physical pixels on render | Near_You comp7 widget | `Comp7WidgetView.as:689-701`, `WidgetMetrics.as:108-117` (in `R/x/nearyou/mods/zip_chunk_0008_*`) |
| Store the offset in physical pixels and multiply/divide by `appScale` | Lebwa gunmarks | `GunMarksLebwaBattle.as:109-151` |
| Pin centre widgets to the crosshair via `onCrosshairPositionChanged` | Battle Observer | `R/src/battle_observer/mod/res/scripts/client/armagomen/battle_observer/battle/` |

### Recommendations

1. Replace the fixed `DOCK_ANCHORS` table ([core/hud/panel/constants.py](../../../apps/game/modpack/packages/core/hud/panel/constants.py)) with **live stock rects** where the client exposes them: the consumables panel (slot count and width), the damage panel, the minimap size, the players panels. Keep the table as the fallback. This is what makes kurzdor's equipment row sit correctly with 3, 4 or 5 consumable slots.
2. Add a **crosshair anchor** for centre widgets (`onCrosshairPositionChanged`), useful for main gun, sixth sense and arty meter.
3. Store positions as **normalised fractions of the free space plus an anchor**, not pixels. Re-clamp on every resolution or scale change so a panel never ends up off-screen after switching from 4K to 1080p.
4. React to events (Gameface `clientResized`, Python `interfaceScale.onScaleChanged`) instead of polling the screen size every second.

## 2. Drag and edit in battle

- **No mod has its own edit hotkey.** All reuse the stock **Ctrl cursor** in battle: while Ctrl is held the cursor is visible and panels become draggable.
- Two techniques: the stock drag protocol `App.cursor.registerDragging` with `DragType.SOFT` (kurzdor, GUIFlash), or manual `startDrag(bounds)` with `forceSetCursor` for the cursor shape (Lebwa, Near_You).
- Bounds: the drag rectangle is the screen minus the panel size; nobody snaps to edges or to other panels.
- Persistence: wotstat keeps **one position per control mode** (arcade / sniper / strategic) in `WidgetStorage.dec.py:117-129`; most others keep one position per panel.
- Anti-pattern: `R/x/jove_mods/dragBattleDamageLogPanel` checks the panel position every frame on `ENTER_FRAME`.

### Recommendations

1. Keep our explicit HUD edit mode ([packages/ui/hud_edit](../../../apps/game/modpack/packages/ui/hud_edit/)), but also allow **quick drag while Ctrl is held** in a live battle, as players expect from every other pack.
2. Add **snapping** to screen edges, the centre lines and other panels (8 px threshold, Alt disables). Nobody has it; it is a cheap differentiator.
3. During a drag, cache the screen size and scale at press time; clamp with the panel's real size.
4. Offer **per-mode positions** (sniper vs arcade) for centre panels, as wotstat does.
5. Pass `limit: true` in the GUIFlash fallback so dragged panels stay on screen.

## 3. Hiding and replacing stock panels, team HP bar

All three replacements are Scaleform and all take over the stock `fragCorrelationBar` area.

| Who | How the stock strip goes | Data source |
| --- | --- | --- |
| Battle Observer | sets the stock parts' alpha to 0 and switches off the stock `ScorePanelStorageKeys`; adds its components to `_blToggling` so they hide with the stock UI on V | `IBattleFieldListener.updateTeamHealth` (`battle/teams_hp.py`; AS3 `TeamsHealthUI.as:39-53`) |
| pmod (Lebwa and NYT styles) | removes the bar's children, inserts its panel at index 0, keeps the stock class icons; moves the team bases panel and quest progress down | protected Python; AS3 `TopBarLeBwaBase.as`, `TopBarDefault.as` in `pmodBattle.as3` |
| Lebwa toppanel | removes the whole bar and redraws the markers itself | `LebwaTopPanel.as:33-52`, `MarkersRenderer.as` |
| XVM | hooks `FragCorrelationBar.updateTeamHealth` and `FragsCollectableStats.getTotalStats` | `R/x/jove/app/res_mods/configs/xvm/py_macro/xvm/total_hp.py` |

Every one reads team totals from the client's `BattleFieldCtrl` (`refs/wot-src-ru/.../gui/battle_control/controllers/battle_field_ctrl.py`), which is exactly the number the stock bar shows, so it is fair play.

**Recommendations for `team_hp`** ([features/team_hp](../../../apps/game/modpack/features/team_hp/)):

1. Take the totals from `BattleFieldCtrl` / `updateTeamHealth` so they always match the stock bar.
2. When replacing the stock strip, **move the team bases and quest progress panels** instead of covering them, and respect the stock tier-grouping setting.
3. Add an alive-count toggle and the V-key hide group (`_blToggling` equivalent).
4. **Main gun**: add the "unreachable" state (Battle Observer: `max(1000, ceil(0.2 × enemy team max HP))`) and the "failed" state after damage to an ally (XVM `total_hp.py:223-243`, pmod `TopBarDefault.as:278-296`). Skip per-ally damage races.

## 4. Equipment and consumables in battle

kurzdor `battleequipment` is the reference (Python protected; the behaviour is read from AS3 and config):

- **Icons**: 45×45 from the stock `../maps/icons/artefact/<name>.png`, one row next to the stock consumables panel, placed from the panel's live width (§1).
- **Extras**: the directive slot with a compatibility mark, the field-modification set 1/2 badge, a highlight for devices that are active, and a show-on-key mode.
- **Tooltips** only on the set badge and the hide button (`App.toolTipMgr.showComplex`), none on the equipment slots; they appear only while the Ctrl cursor is shown.
- `advancedconsumablespanel` adds no slots: it restyles the stock count and cooldown text and labels the shell buttons with the shell type.

None reads other players' equipment.

**Recommendations for `battle_loadout` and `consumables`**:

1. Place the loadout row from the stock panel's slot count (left or right of it), not a fixed centre offset ([battle_loadout/settings/constants.py](../../../apps/game/modpack/features/battle_loadout/settings/constants.py) notes the fixed anchor).
2. Add the directive slot, the set badge and the active highlight.
3. Clear our tooltip when the battle cursor hides (Ctrl released while hovering) so it cannot stay stuck.
4. Add an option to hide our consumables rows that duplicate the stock panel.

## 5. Logs, sixth sense, clock, marks

- **Damage and hit logs.**
  - XVM's hit log is `Vehicle.onHealthChanged` filtered to the player as attacker, with crits from decoded hit points (`py_macro/xvm/hitLog.py:357-957`). Jove's defaults group by player, 10 lines; the received log shows hits without damage and groups fire and ramming (`damageLog.xc`).
  - Battle Observer colours values by the player's own career average on the tank, and its extended log groups per vehicle, shows the shell type and gold colour, and switches template while **Alt** is held (`battle/damage_log.py`, `extended_damage_logs.py`).
  - Take: the Alt template, colouring by own average, no-damage hits, grouping on by default.
- **Sixth sense.**
  - Battle Observer listens to `g_playerEvents.onObservedByEnemy` and counts down 10 s, 8.5 s with the radio equipment, 8 s in its improved slot, with separate Onslaught values, plus a tick sound; it hides on round end and death (`battle/sixth_sense.py`).
  - XVM and pmod patch `GUI_SETTINGS.sixthSenseDuration`; Near_You just replaces the stock `sixthSense.swf`.
  - Take: an equipment- and mode-aware duration instead of our fixed `LAMP_DURATION_S` ([sixth_sense/model](../../../apps/game/modpack/features/sixth_sense/model/)), plus the tick.
- **Clock.** Battle Observer gets per-second ticks from `IAbstractPeriodView.setTotalTime` and turns red near the end; Lebwa adds date and a phase icon. Take the end-of-battle colour.
- **Marks panels.** protanki, Near_You and Lebwa share one engine: predicted moving damage, delta, damage for the next mark and for +1 %, validity flags, an Alt-expanded mode and a minimiser (`GunMarksPanelNew.as:52-135`). wotStat asks the server for the damage distribution (`CMD_GET_VEHICLE_DAMAGE_DISTRIBUTION`, `moeLogger.dec.py`); we decline that on purpose ([companion/marks/client](../../../apps/game/modpack/packages/companion/marks/client/__init__.py)) and should keep doing so. Take: the validity badge, Alt expand, minimise, "damage for +1 %".
- **Fair play, skip:** Jove's `infopanel` (shows enemy reload), pmod's enemy-spotted indicator, distance to enemies, XVM `xmqp`, Battle Observer's per-ally damage race.

## 6. Settings windows

| | MSA (izeberg, Aslain fork) | Aslain Mod Menu | ModsList 1.6.01 | Ours |
| --- | --- | --- | --- | --- |
| Tech | Scaleform window | Scaleform | Scaleform button in the messenger bar row (bottom right, from AS3) | Gameface page via OpenWG |
| Open | ModsList entry | ModsList / own button | the button | ModsList entry or our floating Gameface button |
| Window | fixed, full screen | fixed | — | movable, resizable, zoomable, position saved |
| Esc | Aslain's fork and Mod Menu **step back one level first**; MSA cancels a key capture on Esc | same | — | always closes the whole window |

Findings:

- **ModsList 1.6.01 works on Lesta 1.45.** Only 1.7+ is WG-only; Jove and Near_You ship 1.6.01. Our README says only that ModsList master needs WG 2.4.1+ and that Lesta needs «a release that supports the client»; it should name 1.6.01. Our code already calls `addModification` when it is present.
- Nobody offers settings in battle.
- The 1.45 client blurs the hangar behind its own windows with `CachedBlur(ownLayer=layer-1)`.
- MSA captures hotkeys in Python (`hotkeys.py`), not in the page.

### Recommendations

1. **Esc unwinds.** Keep Python's `EscapeGuard` to swallow the key, but send an `escape` event to the page instead of closing. The page closes, in order, the confirm dialog, an open choice list, focus in the search field, and only then asks to close the window. Today both `EscapeGuard → host.on_escape` and `bindEscapeClose(document)` ([ui-web/src/app/settings/lib/escape-close](../../../apps/game/modpack/ui-web/src/app/settings/lib/escape-close/)) close it.
2. Recommend ModsList 1.6.01 in the manager and name it in the README; keep our floating button as the fallback.
3. Blur the hangar behind our window with `CachedBlur`.
4. Scrolling: ease the wheel, round scroll positions to whole pixels (Coherent blurs text on fractional offsets), remember the scroll position per page for the session.
5. Ctrl+F focuses search; a multi-step undo stack with a pending-changes counter; «new» badges on newly added options.
6. Hotkey fields, when we add them, capture keys in Python like MSA.

## 7. Session stats and replays

- **wotStat session stats** live in memory with no reset. Results come from `onBattleResultsReceived` plus a 3 s check; it replaces the client's `BattleResultsCache` class to skip the "results unavailable" cooldown. It ranks the player against teammates; if we copy anything, show only the player's own place.
- **poliroid Replays Manager** is a Scaleform window opened from the ModsList button, the login screen and the context menu of stock replay items. It caches **whole parsed replays** in a `shelve` database keyed by file mtime, which is heavy on large folders. "Show results" feeds the stock results screen through private APIs. `net.openwg.fix.battleresultsreplays` writes battle results back into replays of the last hour.
- **Take**:
  - `session_stats`: a manual reset, a last-10 win/loss strip and a "results pending" count.
  - `replay_manager`: cache only headers, keyed by path + size + mtime; add a nation filter; an opt-in, atomic "add my battle results to the latest replay".

## 8. Performance

- **Invalidation, not per-frame work.** CLIK invalidation lays out at most once per frame; Battle Observer keeps only the latest value per widget and renders on the next frame.
- **Save rarely.** wotstat writes positions to disk at most once a second and only when something changed.
- **Avoid** `ENTER_FRAME` polling (the drag damage-log mod) and full replay parsing on open (Replays Manager).
- For us: batch HUD updates per frame on the Python side before crossing into Gameface (our `ui-web` already sends only diffs, commit `7575d171c`); debounce position saves; never poll the screen size.

## 9. Frameworks and libraries to adopt

FRAMEWORKS_PLACEHOLDER

## 10. Backlog from this study

| # | What | Where | Effort |
| --- | --- | --- | --- |
| 1 | Esc unwinds instead of closing the window | `packages/ui`, `ui-web` settings | S |
| 2 | Live stock anchors (consumables width, damage panel, minimap) with the table as fallback; re-clamp on scale/resolution change | `core/hud`, `core/client/hud/stock` | M |
| 3 | Ctrl-held quick drag in battle + snapping to edges, centre and other panels | `core/hud`, `ui-web` hud | M |
| 4 | Team HP from `BattleFieldCtrl`; move bases and quest panels; main gun unreachable/failed | `team_hp`, `main_gun` | S |
| 5 | Loadout placed from the stock slot count; directive slot, set badge, active highlight; tooltip cleared when the cursor hides | `battle_loadout` | S |
| 6 | Sixth sense duration by equipment and mode, tick sound | `sixth_sense` | S |
| 7 | Marks panel: validity badge, Alt expand, minimise, damage for +1 % | `marks_panel` | S |
| 8 | Logs: Alt template, colour by own average, no-damage hits | `damage_log`, `hit_log`, `received_hits` | S |
| 9 | Recommend ModsList 1.6.01, name it in the README | manager, modpack README | S |
| 10 | Session reset and last-10 strip; replay header cache keyed by path+size+mtime | `session_stats`, `replay_manager` | S |
