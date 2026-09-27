import { BATTLE_CORROBORATION } from '../../mod';

export const HONEST_RNG_QUEUE = {
  name: 'honest-rng',
  jobs: { aggregate: 'aggregate' }
} as const;

export const HONEST_RNG_SCHEDULES = [
  {
    id: 'honest-rng-aggregate',
    queue: HONEST_RNG_QUEUE.name,
    name: HONEST_RNG_QUEUE.jobs.aggregate,
    repeat: { pattern: '20 */3 * * *' }
  }
] as const;

export const RNG_PERIODS = ['d7', 'd30', 'all'] as const;

export const HONEST_RNG_AGGREGATE = {
  periodDays: { d7: 7, d30: 30, all: null },
  chunk: 2000,
  settleHours: BATTLE_CORROBORATION.windowHours + 1,
  watermarkKey: 'honest-rng-watermark',
  scopes: { server: 'server', tier: 'tier', shell: 'shell' },
  cacheKey: 'honest-rng:view:v1',
  cacheSeconds: 600
} as const;

export const RNG_THEORY = {
  sigmaShare: 0.5
} as const;

export const RNG_LUCK = {
  minShots: 30,
  evenBand: 0.015
} as const;
