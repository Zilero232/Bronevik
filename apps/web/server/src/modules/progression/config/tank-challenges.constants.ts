import type { TankChallengeDefinition } from '../progression.types';

export const TANK_CHALLENGE_POOL = [
  { metric: 'damageBattles', target: 3, thresholdPerTier: 380, minTier: 1, needsMod: false },
  { metric: 'wins', target: 5, minTier: 1, needsMod: false },
  { metric: 'spotted', target: 15, minTier: 1, needsMod: false },
  { metric: 'frags', target: 10, minTier: 1, needsMod: false },
  { metric: 'blocked', targetPerTier: 900, minTier: 1, needsMod: false },
  { metric: 'survived', target: 5, minTier: 1, needsMod: false },
  { metric: 'moeBattles', target: 2, minTier: 5, needsMod: true },
  { metric: 'battles', target: 10, minTier: 1, needsMod: false }
] as const satisfies readonly TankChallengeDefinition[];

export const TANK_CHALLENGE_ROUNDING = {
  threshold: 100,
  target: 500
} as const;

export const PROGRESS_LIST = {
  limit: 200
} as const;
