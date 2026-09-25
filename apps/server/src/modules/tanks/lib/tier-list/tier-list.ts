import type { TierListRank } from '@bronevik/schemas';

import { tierListRankSchema } from '@bronevik/schemas';
import { sortBy } from 'remeda';

import type { RankedCandidate, TierListCandidate } from './tier-list.types';

import { TIER_LIST } from '../../config';

const rankAt = (position: number): TierListRank => {
  let covered = 0;

  for (const band of TIER_LIST.bands) {
    covered += band.share;

    if (position < covered) {
      return band.rank;
    }
  }

  return 'F';
};

const trendOf = (candidate: TierListCandidate): RankedCandidate['trend'] => {
  if (candidate.previousWinRateDiff === null) {
    return null;
  }

  const delta = candidate.winRateDiff - candidate.previousWinRateDiff;

  if (Math.abs(delta) < TIER_LIST.trendThreshold) {
    return 'flat';
  }

  return delta > 0 ? 'up' : 'down';
};

export const rankTierList = (candidates: readonly TierListCandidate[]): RankedCandidate[] => {
  const sorted = sortBy(candidates, [(candidate) => candidate.winRateDiff, 'desc']);

  return sorted.map((candidate, index) => {
    const stored = tierListRankSchema.safeParse(candidate.storedRank);

    return {
      ...candidate,
      rank: stored.success ? stored.data : rankAt(sorted.length <= 1 ? 0 : index / sorted.length),
      score: Math.round(candidate.winRateDiff * 100) / 100,
      trend: trendOf(candidate)
    };
  });
};
