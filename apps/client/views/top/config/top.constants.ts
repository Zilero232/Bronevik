import type { LeaderboardScope, RatingKind, RatingPeriod } from '@otmetki/schemas';

import { TANK_CLASSES } from '@otmetki/icons';
import { ratingKindSchema } from '@otmetki/schemas';
import { parseAsInteger, parseAsStringLiteral } from 'nuqs';

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

export const TOP_PARAMS = {
  scope: parseAsStringLiteral(TOP_SCOPES).withDefault('players'),
  metric: parseAsStringLiteral(ratingKindSchema.options).withDefault('wn8'),
  period: parseAsStringLiteral(TOP_PERIODS).withDefault('30d'),
  tier: parseAsInteger,
  type: parseAsStringLiteral(TANK_CLASSES),
  tank: parseAsInteger
};

export const TOP_BOARD = {
  podiumSize: 3,
  anyOption: 'all'
} as const;
