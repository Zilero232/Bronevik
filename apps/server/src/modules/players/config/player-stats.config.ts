import type { RecentPeriod } from '@bronevik/schemas';

export const PLAYER_STATS = {
  snapshotMode: 'random',
  recentPeriods: ['24h', '7d', '30d', '60d', '1000'] satisfies RecentPeriod[],
  serverReference: { mode: 'random', period: 'd30', cohort: 'all' },
  insightsMinBattles: { overall: 30, recent: 5 }
} as const;

export const HISTORY = {
  defaultDays: 90,
  maxDays: 730
} as const;

export const PLAYER_MARKS = {
  minTier: 5,
  combinedDamageBattles: 100
} as const;
