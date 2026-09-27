import type { Challenges } from '@/shared/api/generated';

export type WeeklyChallenges = Challenges;

export type WeeklyChallenge = Challenges['challenges'][number];

export type WeeklyChallengesInput = {
  signal?: AbortSignal;
};
