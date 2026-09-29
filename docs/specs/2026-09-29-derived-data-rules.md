# Derived data rules: replay tags, tank × map, fine mark curve

Three features compute numbers from battles we already store. None of them invents a value: where the data is too thin, the API returns the sample size and leaves the rate out, and the site says why.

## Replay tags

Computed by `replayTags` (`apps/web/server/src/modules/replays/lib/replay-tags`) from the parsed replay summary, stored in `replay.tags` together with the recorder's clan tag, blocked damage and mastery badge, and searchable through `GET /replays?tags=`. The thresholds live in `REPLAY_TAG_RULES` (`@otmetki/schemas`), so the site's explanations and the server's checks read the same numbers.

Common rules:

- only a **win** of the recorder can carry a tag;
- every player in the summary must have a battle result, otherwise no tag is set (an incomplete replay cannot prove any of them);
- a player's moment of death is their `lifeTimeSeconds` when they did not survive; a survivor is alive until the end;
- "alive at moment T" means "not destroyed at or before T", so a vehicle destroyed in the same second as another is already counted as dead.

| Tag | Key | Rule |
|---|---|---|
| Колобанов | `kolobanov` | The recorder survived, every ally was destroyed, and when the last ally fell at least `minEnemiesAlive` (5) enemies were alive. |
| Камбэк | `comeback` | At some death moment the enemy had at least `minDeficit` (4) more vehicles alive than the recorder's team. |
| Рейдер | `raider` | The battle ended by base capture (finish reason 2) and the recorder earned at least `minCapturePoints` (50) capture points. |
| Основной калибр | `highCaliber` | The recorder dealt strictly more damage than any other player and at least `minShareOfEnemyHealth` (20%) of the enemy team's total hit points; no tag when any enemy's hit points are unknown. |
| Воин | `warrior` | The recorder destroyed at least `minFrags` (6) vehicles and no ally destroyed more. |

The tag names borrow the in-game medals, but the rules are ours and computed from the replay only; they are not the game's medal conditions.

`REPLAY_TAGGING.version` (server `replays/config`) is stored on every tagged replay. The `replays` queue runs `tag-backfill` every 10 minutes: it retags up to `backfillBatch` parsed replays whose `tags_version` is older, so changing a rule means bumping the version. A stored summary that no longer parses is marked done with no tags rather than guessed.

The other new search filters are exact: recorder clan tag (case-insensitive), tier, class and nation (through the vehicle catalogue), minimum damage, assist, blocked damage and kills, mastery badge (1–4) and game version (`GET /replays/versions` lists the versions of public replays).

## Tank × map

`GET /tanks/:id/maps` and `GET /maps/:idOrSlug/tanks` (`maps` module, `mapSamplesSql`) count random battles (`battle_type = '1'`) of the last `TANK_MAPS.windowDays` (90) days from two sources:

- battles from the game mod (`battle`), one row per player and battle;
- public and unlisted parsed replays, skipped when the same player's battle already came from the mod.

Each sample is one player in one battle. Win rate and average damage are shown only when a tank-map pair has at least `TANK_MAPS.minBattles` (30) samples; below that the API returns the battle count with `isEnough: false` and null rates, and the site says "too few battles".

## Fine mark curve

`GET /marks/:tankId/curve` answers "how much combined damage for X%" from two real sources only:

- the 65/85/95/100% thresholds we already store (`tank_threshold`);
- pairs of *(mark percent, moving-average damage)* that the mod reports after each random battle of the last `MOE_CURVE.windowDays` (14) days.

For each step from 20% to 100% by 5, a battle counts when its percent is within `bandPercent` (±1 point) of the step. Each player contributes the median of their own battles at that step; the step's value is the median across players, published only when at least `minPlayers` (5) distinct players reached it. A missing step is never interpolated, and where the official threshold exists it takes precedence over the mod estimate. The marks drawer offers the calculator only over the steps the response carries and explains when only the four thresholds are available.
