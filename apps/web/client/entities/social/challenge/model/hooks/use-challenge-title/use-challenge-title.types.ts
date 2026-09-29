import type { WeeklyChallenge } from '../../../api';

export type ChallengeRule = Pick<WeeklyChallenge, 'metric' | 'target' | 'threshold' | 'vehicleType'>;
