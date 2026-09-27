import { LEAGUE_METRICS } from '@otmetki/schemas';

export const LEAGUE = {
  minBattles: 5,
  metrics: LEAGUE_METRICS
} as const;

export const LEAGUE_DIVISION = {
  metric: 'wn8',
  minBattles: 10,
  groupSize: 30,
  zoneShare: 0.2,
  minRanked: 5,
  batchSize: 1_000
} as const;
