import type { LeaderboardScope, RatingKind, RatingPeriod } from '@bronevik/schemas';

import type { TopFilterState } from '../lib/top-filter';

export const TOP_SCOPES: readonly LeaderboardScope[] = ['players', 'clans', 'risingStars', 'marks', 'streamers'];

export const TOP_METRICS: Record<LeaderboardScope, readonly RatingKind[]> = {
  players: ['wn8', 'broneIndex', 'eff', 'winRate', 'avgDamage'],
  clans: ['wn8', 'winRate'],
  risingStars: ['wn8', 'broneIndex', 'winRate', 'avgDamage'],
  marks: [],
  streamers: ['wn8', 'broneIndex', 'winRate', 'avgDamage']
};

export const TOP_PERIODS: readonly RatingPeriod[] = ['overall', '24h', '7d', '30d', '60d', '1000'];

export const TOP_TANK_SCOPES: readonly LeaderboardScope[] = ['players', 'streamers'];

export const TOP_BOARD = {
  medals: ['gold', 'silver', 'bronze'],
  initialFilter: { scope: 'players', metric: 'wn8', period: '30d', tier: 'all', type: 'all', tank: null } satisfies TopFilterState
} as const;
