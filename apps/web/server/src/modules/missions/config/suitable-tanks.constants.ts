import type { MissionMetric } from '@otmetki/schemas';

import type { TankServerStats } from '../../../../generated';

export const MISSION_TANKS = {
  mode: 'random',
  cohort: 'average',
  fallbackCohort: 'all',
  minBattles: 50,
  garagePeriod: '30d',
  fallbackMetric: 'winRate'
} as const;

export const MISSION_METRIC_FIELD = {
  damage: 'avgDamage',
  frags: 'avgFrags',
  spotting: 'avgSpotted',
  blocked: 'avgBlocked',
  survival: 'survivalRate',
  xp: 'avgXp',
  accuracy: 'accuracy',
  winRate: 'winRate'
} as const satisfies Record<MissionMetric, keyof TankServerStats>;

export const MISSION_TIERS = {
  min: 1,
  max: 11
} as const;
