import type { RatingTier } from '@otmetki/schemas';

import type { VehicleType } from '../../../../generated';

import { FEATURES } from '../../../config';

export const SOCIAL_QUEUE = {
  name: 'social',
  jobs: { challenges: 'challenges' }
} as const;

export const SOCIAL_SCHEDULES = [
  {
    id: 'social-challenges',
    queue: SOCIAL_QUEUE.name,
    name: SOCIAL_QUEUE.jobs.challenges,
    repeat: { pattern: '35 * * * *' },
    enabled: FEATURES.weeklyChallenges
  }
] as const;

export const FEED = {
  days: 14,
  lookbackDays: 45,
  limit: 50,
  maxFollows: 500,
  aceMastery: 4
} as const;

export const LEAGUE = {
  minBattles: 5,
  metrics: ['damage', 'wn8', 'marks', 'battles'] as const
} as const;

export const WEEKLY_CHALLENGES = [
  { code: 'battles-50', metric: 'battles', target: 50 },
  { code: 'wins-25', metric: 'wins', target: 25 },
  { code: 'spotted-40', metric: 'spotted', target: 40 },
  { code: 'damage-3000', metric: 'bigDamageBattles', target: 3, threshold: 3000 },
  { code: 'heavy-4000', metric: 'bigDamageBattles', target: 3, threshold: 4000, vehicleType: 'heavyTank' },
  { code: 'mark-1', metric: 'marks', target: 1 }
] as const satisfies readonly {
  code: string;
  metric: 'battles' | 'bigDamageBattles' | 'marks' | 'spotted' | 'wins';
  target: number;
  threshold?: number;
  vehicleType?: VehicleType;
}[];

export const CHALLENGE_BADGES = {
  prefix: 'weekly-',
  category: 'weekly',
  maxAccountsPerRun: 5000
} as const;

export const SIGNATURE = {
  width: 468,
  height: 100,
  cacheSeconds: 1800,
  cachePrefix: 'sig:v1:',
  fontFiles: { display: 'tektur-700.ttf', body: 'onest-500.ttf' },
  fontNames: { display: 'Tektur', body: 'Onest' },
  background: '#16181c',
  foreground: '#f3f1ea',
  muted: '#9aa0a6',
  accent: '#ff7a1a',
  brand: 'otmetki.app',
  locale: 'ru',
  missing: '—'
} as const;

export const TIER_COLORS = {
  very_bad: '#a3342f',
  bad: '#d14b2e',
  below_avg: '#e08a2c',
  avg: '#d8c23a',
  good: '#6fb33a',
  very_good: '#3a9a4a',
  great: '#3b8fd6',
  unicum: '#8a4fd6',
  super_unicum: '#5a2aa6'
} as const satisfies Record<RatingTier, string>;

export const WRAPPED = {
  minYear: 2023,
  topTanks: 5
} as const;
