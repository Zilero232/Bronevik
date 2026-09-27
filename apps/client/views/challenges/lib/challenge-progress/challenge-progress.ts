import { clamp, firstBy, sortBy } from 'remeda';

import type { WeeklyChallenge } from '../../api';
import type { ChallengeRow, ChallengeSummary, SecondsUntilInput } from './challenge-progress.types';

const toRow = (challenge: WeeklyChallenge): ChallengeRow => {
  const best = firstBy(challenge.progress, [(entry) => entry.value, 'desc']);
  const completedAt = firstBy(
    challenge.progress.flatMap((entry) => (entry.completedAt ? [entry.completedAt] : [])),
    (at) => at
  );

  const value = best?.value ?? 0;

  return {
    code: challenge.code,
    badgeCode: challenge.badgeCode,
    target: challenge.target,
    threshold: challenge.threshold,
    metric: challenge.metric,
    vehicleType: challenge.vehicleType,
    value,
    share: challenge.target > 0 ? clamp(value / challenge.target, { min: 0, max: 1 }) : 0,
    completedAt: completedAt ?? null,
    isCompleted: completedAt !== undefined || (challenge.target > 0 && value >= challenge.target)
  };
};

export const challengeRows = (challenges: readonly WeeklyChallenge[]): ChallengeRow[] =>
  sortBy(challenges.map(toRow), (row) => row.isCompleted, [(row) => row.share, 'desc']);

export const challengeSummary = (rows: readonly ChallengeRow[]): ChallengeSummary => ({
  completed: rows.filter((row) => row.isCompleted).length,
  total: rows.length
});

export const secondsUntil = ({ endsAt, now }: SecondsUntilInput): number => (Date.parse(endsAt) - now.getTime()) / 1000;
