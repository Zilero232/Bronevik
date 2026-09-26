import type { EquippedCosmetics } from '@otmetki/schemas';

import type { TankChallengeDefinition } from '../progression.types';

import { FEATURES } from '../../../config';

export const PROGRESSION_QUEUE = {
  name: 'progression',
  jobs: { run: 'run' }
} as const;

export const PROGRESSION_SCHEDULES = [
  {
    id: 'progression-run',
    queue: PROGRESSION_QUEUE.name,
    name: PROGRESSION_QUEUE.jobs.run,
    repeat: { pattern: '*/20 * * * *' },
    enabled: FEATURES.progression
  }
] as const;

export const PROGRESSION_RUN = {
  maxAccountsPerRun: 5000,
  modLookbackDays: 30
} as const;

export const TANK_XP = {
  perBattle: 10,
  perWin: 8,
  perFrag: 3,
  perSpot: 2,
  damagePerTierPoint: 25,
  minTier: 1
} as const;

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

export const SHELL_LEDGER = {
  recentEntries: 30,
  lockNamespace: 'shells'
} as const;

export const PROGRESS_LIST = {
  limit: 200
} as const;

export const NO_COSMETICS: EquippedCosmetics = { badge: null, frame: null, banner: null };
