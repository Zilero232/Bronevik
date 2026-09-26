import type { BuildMode } from '@otmetki/schemas';

export const BUILD_MODE_BONUS_TYPES = {
  random: [1],
  ranked: [22],
  frontline: [27],
  onslaught: [43]
} as const satisfies Record<BuildMode, readonly number[]>;

export const BUILD_USAGE_AGGREGATE = {
  maxBattlesPerTank: 20_000,
  cohortMinBattles: 30,
  cohortShares: { top10: 0.1, top1: 0.01 },
  maxPicks: 12,
  unknownVersion: 'unknown'
} as const;
