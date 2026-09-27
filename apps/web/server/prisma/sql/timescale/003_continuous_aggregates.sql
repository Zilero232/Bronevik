-- Server-wide tank statistics per Moscow day, tank, stats mode and skill cohort.
-- Built from tank_battle_delta, which the collector writes whenever a tank's battle count changes.
-- Exposed to Prisma as the read-only `view TankDailyStats`.
-- WR diff = sum(wins) / sum(battles) - sum(player_wins_weighted) / sum(battles).

CREATE MATERIALIZED VIEW IF NOT EXISTS tank_daily_stats
WITH (timescaledb.continuous, timescaledb.materialized_only = FALSE) AS
SELECT
  time_bucket(INTERVAL '1 day', captured_at, 'Europe/Moscow') AS day,
  tank_id,
  mode,
  cohort,
  count(*) AS samples,
  sum(battles)::BIGINT AS battles,
  sum(wins)::BIGINT AS wins,
  sum(damage_dealt)::BIGINT AS damage_dealt,
  sum(damage_blocked)::BIGINT AS damage_blocked,
  sum(frags)::BIGINT AS frags,
  sum(spotted)::BIGINT AS spotted,
  sum(xp)::BIGINT AS xp,
  sum(survived_battles)::BIGINT AS survived_battles,
  sum(hits)::BIGINT AS hits,
  sum(shots)::BIGINT AS shots,
  sum(account_win_rate * battles)::DOUBLE PRECISION AS player_wins_weighted
FROM tank_battle_delta
GROUP BY 1, 2, 3, 4
WITH NO DATA;

CREATE INDEX IF NOT EXISTS tank_daily_stats_tank_day_idx ON tank_daily_stats (tank_id, day DESC);
CREATE INDEX IF NOT EXISTS tank_daily_stats_day_idx ON tank_daily_stats (day DESC);
