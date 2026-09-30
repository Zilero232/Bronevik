# MoE thresholds in production

How the marks-of-excellence thresholds (`tank_threshold`, `kind = moe`) get filled, how to check them and how to trigger the fill by hand. The site's `/marks` table and the modpack's marks panel (`GET /v1/moe/:tankId`) read the same rows.

## Where the thresholds come from

| Source (`tank_threshold.source`) | Job (`collector.reference` queue) | Needs | Status |
|---|---|---|---|
| `otmetki` — our own estimate from the mod's battle reports | `moe-estimate` (`moe-estimate-daily`, 06:10 Moscow, and once on every worker boot) | Mod battles in the last `MOE_CURVE.windowDays` (14) days with a MoE percent and the client's moving-average damage; at least `MOE_CURVE.minPlayers` (5) distinct players within ±`MOE_CURVE.bandPercent` (1) of 65, 85 and 95 % per tank | On; no Lesta key needed |
| `poliroid` — poliroid.me's undocumented gunmarks API | `moe-thresholds` (`moe-thresholds-daily`, 06:15 Moscow) | `FEATURES.moePoliroid = true` (`apps/web/server/src/config/features.constants.ts`) and Poliroid's written permission ([research/tooling/packages.md](../research/tooling/packages.md) §3) | Off until the permission arrives |
| `manual`, `kttc` | none | — | Reserved in the enum |

The estimate is the median moving-average combined damage of the players whose gun sat at each official percent (the same maths as `/marks/:tankId/curve`), per tank, replaced daily under today's date; `sample_size` keeps the smallest player count of the three levels. `THRESHOLD_SOURCE_PRIORITY` (`modules/reference/config`) prefers `manual`, then `otmetki`, then `poliroid`. The Lesta API has no MoE percentages (`tanks/mastery` percentiles are not thresholds), so there is nothing to seed from without mod players.

Until enough players report battles through the mod, `/v1/moe/:tankId` answers `200` with `is_enough: false`, an empty `thresholds` object and whatever `curve` points already exist; the modpack interpolates from the curve and logs «no usable thresholds» when there is nothing yet. A `404` from this endpoint now means only a malformed tank id (`400`) or an outage.

## Check

```sh
# The last successful fill (moeImport covers both jobs) and the latest mod battle the API ingested.
curl -s https://api.triotmetki.ru/health | jq '{jobs: .collector.jobs, lastModBattleAt: .collector.lastModBattleAt, worker: .info.worker}'

# One tank (IS-7). is_enough=false with an empty curve = no mod data for it yet.
curl -s https://api.triotmetki.ru/v1/moe/7169 | jq '{is_enough, thresholds, curve: (.curve | length), source, updated_at}'
```

On the VPS (`cd $DEPLOY_PATH`):

```sh
# Rows per source and day.
docker compose exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "SELECT source, date, count(*) AS tanks FROM tank_threshold WHERE kind = 'moe' GROUP BY 1, 2 ORDER BY 2 DESC, 1 LIMIT 10;"

# How much mod data the estimate can see: tanks with enough players near the 95 % level in the window.
docker compose exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "SELECT tank_id, count(DISTINCT account_id) AS players FROM battle WHERE battle_type = '1' AND started_at >= now() - interval '14 days' AND moe_percent BETWEEN 94 AND 96 AND moe_moving_avg > 0 GROUP BY 1 HAVING count(DISTINCT account_id) >= 5 ORDER BY 2 DESC LIMIT 20;"

# The worker's own log line of the last run.
docker compose logs --since 24h worker | grep -i "moe-estimate"
```

## Trigger by hand

The estimate runs on every worker boot (`runOnBoot` on its schedule), so a deploy or a restart is a trigger:

```sh
docker compose restart worker
curl -s https://api.triotmetki.ru/health | jq '.collector.jobs[] | select(.job == "moeImport")'
```

Or from bull-board, without a restart: the API serves it at `/admin/queues` when `BULL_BOARD_PASSWORD` is set, and the public host answers 404 for it on purpose, so reach the server container through an SSH tunnel ([deploy.md §1](deploy.md)). In the `collector.reference` queue add a job named `moe-estimate` with data `{}`; the `moeImport` entry in `/health` moves once it succeeds.

The job is idempotent: it deletes and rewrites today's `otmetki` rows, keeps older days for the history charts and never touches the other sources. With no qualifying tank it writes nothing and leaves the last rows in place.

## Related

- Retention: `tank_threshold` rows older than 730 days are dropped by the `retention` purge job (`RETENTION` in `modules/collector/purge/config`).
- Enabling poliroid after permission: flip `FEATURES.moePoliroid`, deploy; the `moe-thresholds-daily` schedule registers itself on the next worker boot.
