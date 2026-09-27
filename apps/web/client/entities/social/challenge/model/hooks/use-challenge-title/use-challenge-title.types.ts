import type { Challenges } from '@/shared/api/generated';

export type ChallengeRule = Pick<Challenges['challenges'][number], 'metric' | 'target' | 'threshold' | 'vehicleType'>;
