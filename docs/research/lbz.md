# ЛБЗ — personal missions in the client files

Spike for competitors-v2 WP-2. Where the «личные боевые задачи» live in the client mirror, what each file holds, and how the importer reads them. Everything below is game data from the Lesta client; no text, picks or rankings are taken from third-party sites.

## Sources

| Mirror                                     | Path                                                              | What                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `unicum-gg/wot.src@RU` (the importer's)    | `sources/res/scripts/item_defs/personal_missions/seasons.xml`     | Campaigns («сезоны»): `id`, `userString`, `description`                                   |
|                                            | `…/personal_missions/tiles.xml`                                   | Operations («тайлы»), plus `<quests><tokenQuest>` with the reward vehicle of each one     |
|                                            | `…/personal_missions/list.xml`                                    | Every mission: numeric id, tags, tier range, unlock chain, localization keys             |
|                                            | `…/personal_missions/<branch>/tile_<t>/chain_<c>/<name>.xml`      | Server quest definitions (bonuses, a few XML conditions, Python scripts for PM2/PM3)      |
|                                            | `sources/res/scripts/common/personal_missions_config.py`          | The client's condition config: every progress id with its goal, params, main/honors flag |
| `izeberg/wot-src@RU` (localization only)   | `sources/res/text/ru/lc_messages/personal_missions_details.po`   | Russian strings for missions, operations and condition texts                              |

`unicum-gg/wot.src` ships no `.mo`/`.po` files; `izeberg/wot-src` carries the decompiled `.po` catalogs. Only Russian (and Belarusian) exist — there is no English client text, so the English UI shows the Russian game strings next to our own translated labels.

## Structure

- **Campaign** = season (`seasons.xml`): 1 «Долгожданное подкрепление» (`regular`), 2 «Второй фронт» (`pm2`), 3 (`pm3`, «Новые горизонты» — no season string in the catalog, the client names it elsewhere).
- **Operation** = tile (`tiles.xml`, elements are spelled `tail_N`): `seasonID`, `nextTileIDs`, `chainsCount`, `questsInChain` (15, or 25 for PM3), `chainsCountToUnlockNext`, `iconID`, `tokens`. The reward vehicle is the `bonus/vehicle` text (`germany:G104_Stug_IV`) of the token quest `pt_final_s<season>_t<tile>`; the campaign-wide reward of season 3 is `pt_final_rewards_s3`. Tiles 8–10 have no name string, so the API names them after the reward tank.
- **Branch** = chain inside an operation. The mission tags decide what it is:
  - `regular` — a vehicle class tag (`lightTank`, `mediumTank`, `heavyTank`, `AT-SPG`, `SPG`);
  - `pm2` — an alliance tag; `nations.py` maps `Alliance-USSR` → ussr, china; `Alliance-Germany` → germany, japan; `Alliance-USA` → usa, uk, poland; `Alliance-France` → france, czech, sweden, italy, intunion. A few PM2 missions add `SPG` on top of the alliance;
  - `pm3` — `LevelGroup1..3` (tiers VI–VII, VIII–IX, X–XI), any class and nation.
- **Mission** — `list.xml` element `<branch>_<tile>_<chain>_<n>`: `id` (stable numeric quest id, used as the API id and the progress key), `tags` (`initial`, `final`, `withoutAdd` = no «с отличием», `withoutPawn`), `minLevel`/`maxLevel`, `requiredUnlocks` (quest ids that must be done first), `rewardByDemand` on the final one, and `#personal_missions_details:<key>` strings for the title, short title, description and advice.

## Conditions

`personal_missions_config.py` is a decompiled Python module with three dict literals — `_config` (season 1), `_config_pm2`, `_config_pm3` — keyed by mission name, then by progress id:

```python
'regular_1_1_6': {'assistedHits': {'type': PROGRESS_TEMPLATE.VALUE,
                                   'config': {'goal': 2, 'isMain': True, 'isAward': True,
                                              'params': {'assistTypes': [ASSIST_TYPES.TRACK, ASSIST_TYPES.RADIO]}},
                                   'description': DESCRIPTIONS.REGULAR(iconID=CONDITION_ICON.ASSIST)}, …}
```

- `isMain` — main condition (`True`) or the «с отличием» part (`False`); `isAward: False` marks a helper sub-condition (for example the `alive` a multiplier reads);
- `goal` (or `uniqueGoal`/`totalGoal` for counters) and `params` fill the text placeholders;
- `DESCRIPTIONS.HEADER(displayType=…)` entries are series/limit counters («в 5 боях подряд»), not standalone conditions.

The text is `<mission>_title_<progressId>` and `<mission>_description_<progressId>` in `personal_missions_details.po`, with `%(goal)s`, `%(vehicleHealthFactor)s`, `%(desiredPosition)s`… placeholders. The importer renders them with the config values. Generic conditions (`win`, `alive` in season 1) have no per-mission string; the client labels them itself.

The per-mission XML files are server-side: season 1 still carries `postBattle` conditions, PM2/PM3 only a Python `scripts` block. The config above is what the client shows, so the importer reads the config and skips the scripts.

## Import

`bun run gamedata:import` builds the missions after the vehicle catalog (`--skip-missions` turns it off) and writes, per game version:

| Table                   | Key                                        |
| ----------------------- | ------------------------------------------ |
| `mission_campaign`      | `game_version_id`, `campaign_id`           |
| `mission_operation`     | `game_version_id`, `operation_id`          |
| `mission_branch`        | `game_version_id`, `operation_id`, `chain_id` |
| `mission`               | `game_version_id`, `quest_id`; `conditions` JSON |
| `user_mission_progress` | `user_id`, `quest_id` (manual tracker, `source` = `manual` / `mod`) |

Reward tanks are resolved to `tank_id` by nation and tag against `vehicle`. The Python literal is read by a small parser (`gamedata/lib/python-literal`) — no npm package reads Python literals with named constants and keyword calls; `.po` files go through `gettext-parser`.

## Recommendations

Each condition maps to one of our `TankServerStats` metrics (`missions/lib/condition-metrics`): damage, frags, spotting (spotting and assist — we have no separate assist aggregate), blocked, survival, XP; anything without a matching stat (`win`, captures, medals, crits, equipment) ranks by win rate. Eligible tanks are the catalog vehicles in the mission's tier range, class (season 1, SPG-tagged PM2 missions) and alliance nations (PM2), ranked in the average-player cohort (whole server when that cohort is empty) with a 0–100 fit score by position.

## Mod

The game mod does not report personal-mission progress today, so progress is the manual tracker only; `source = mod` is reserved for when it does.
