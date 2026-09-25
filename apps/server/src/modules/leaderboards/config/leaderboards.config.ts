import type { RatingKind, RatingPeriod } from '@bronevik/schemas';

export const LEADERBOARD_MIN_BATTLES = {
  overall: 1_000,
  '24h': 5,
  '7d': 20,
  '30d': 50,
  '60d': 100,
  '1000': 500
} as const satisfies Record<RatingPeriod, number>;

export const ACCOUNT_RATING_COLUMN = {
  wn8: 'wn8',
  eff: 'eff',
  broneIndex: 'brone_index',
  winRate: 'win_rate',
  avgDamage: 'avg_damage'
} as const satisfies Record<RatingKind, string>;

export const TANK_RATING_COLUMN = {
  wn8: 'wn8',
  eff: 'wn8',
  broneIndex: 'wn8',
  winRate: 'win_rate',
  avgDamage: 'avg_damage'
} as const satisfies Record<RatingKind, string>;

export const CLAN_SNAPSHOT_COLUMN = {
  wn8: 'avg_wn8',
  eff: 'avg_wn8',
  broneIndex: 'avg_wn8',
  winRate: 'avg_win_rate',
  avgDamage: 'avg_wn8'
} as const satisfies Record<RatingKind, string>;

export const RISING_STARS = {
  fallbackPeriod: '30d'
} as const;
