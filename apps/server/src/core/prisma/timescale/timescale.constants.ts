export const HYPERTABLE = {
  accountSnapshot: 'account_snapshot',
  tankSnapshot: 'tank_snapshot',
  tankBattleDelta: 'tank_battle_delta'
} as const;

export const CONTINUOUS_AGGREGATE = {
  tankDailyStats: 'tank_daily_stats'
} as const;

export const TANK_DAILY_STATS_REFRESH = {
  startOffset: '7 days',
  endOffset: '1 hour'
} as const;

export const TIMESCALE_SQL = {
  extension: '.sql',
  extensionsFile: '001_extensions.sql',
  policiesLabel: 'policies',
  refreshLabel: 'refresh'
} as const;
