import type { Challenges } from '@/shared/api/generated';

export type WeeklyChallenge = Challenges['challenges'][number];

export type WeeklyChallengesInput = {
  signal?: AbortSignal;
};
