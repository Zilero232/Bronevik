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

export const CONDITION_METRIC_RULES: readonly (readonly [RegExp, MissionMetric])[] = [
  [/^(?:blocked|topByBlocked|damageDealtReceivedAndBlocked|hitsReceived)/, 'blocked'],
  [/^(?:assist|spot|stun)/, 'spotting'],
  [/^(?:kills|topByKills)/, 'frags'],
  [/^(?:damage|topByDamage|totalDamagePercent|hits|piercing)/, 'damage'],
  [/^(?:xp|topByExp)/, 'xp'],
  [/^(?:alive|noCrits)/, 'survival']
];

export const MISSION_PLAN = {
  telegramNextLimit: 5
} as const;

export const MISSION_CONDITION = {
  headerDisplay: 'header'
} as const;

export const MISSION_TIERS = {
  min: 1,
  max: 11
} as const;
