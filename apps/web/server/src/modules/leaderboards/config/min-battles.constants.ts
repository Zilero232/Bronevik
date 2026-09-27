import type { RatingPeriod } from '@otmetki/schemas';

export const LEADERBOARD_MIN_BATTLES = {
  overall: 1_000,
  '24h': 5,
  '7d': 20,
  '30d': 50,
  '60d': 100,
  '1000': 500
} as const satisfies Record<RatingPeriod, number>;
