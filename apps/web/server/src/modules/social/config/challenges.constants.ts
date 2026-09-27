import type { WeeklyChallengeMetric } from '@otmetki/schemas';

import type { VehicleType } from '../../../../generated';

export const WEEKLY_CHALLENGES = [
  { code: 'battles-50', metric: 'battles', target: 50 },
  { code: 'wins-25', metric: 'wins', target: 25 },
  { code: 'spotted-40', metric: 'spotted', target: 40 },
  { code: 'damage-3000', metric: 'bigDamageBattles', target: 3, threshold: 3000 },
  { code: 'heavy-4000', metric: 'bigDamageBattles', target: 3, threshold: 4000, vehicleType: 'heavyTank' },
  { code: 'mark-1', metric: 'marks', target: 1 }
] as const satisfies readonly {
  code: string;
  metric: WeeklyChallengeMetric;
  target: number;
  threshold?: number;
  vehicleType?: VehicleType;
}[];

export const CHALLENGE_BADGES = {
  prefix: 'weekly-',
  accountsPerPage: 1_000
} as const;
