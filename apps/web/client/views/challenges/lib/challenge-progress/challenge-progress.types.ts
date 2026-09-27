import type { WeeklyChallenge } from '../../api';

export type ChallengeMetric = WeeklyChallenge['metric'];

export type ChallengeRow = Pick<WeeklyChallenge, 'badgeCode' | 'code' | 'metric' | 'target' | 'threshold' | 'vehicleType'> & {
  value: number;
  share: number;
  completedAt: string | null;
  isCompleted: boolean;
};

export type ChallengeSummary = {
  completed: number;
  total: number;
};

export type SecondsUntilInput = {
  endsAt: string;
  now: Date;
};
