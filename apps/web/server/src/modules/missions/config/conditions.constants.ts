import type { MissionMetric } from '@otmetki/schemas';

export const CONDITION_METRIC_RULES: readonly (readonly [RegExp, MissionMetric])[] = [
  [/^(?:blocked|topByBlocked|damageDealtReceivedAndBlocked|hitsReceived)/, 'blocked'],
  [/^(?:assist|spot|stun)/, 'spotting'],
  [/^(?:kills|topByKills)/, 'frags'],
  [/^(?:damage|topByDamage|totalDamagePercent|hits|piercing)/, 'damage'],
  [/^(?:xp|topByExp)/, 'xp'],
  [/^(?:alive|noCrits)/, 'survival']
];

export const MISSION_CONDITION = {
  headerDisplay: 'header'
} as const;
