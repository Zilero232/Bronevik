import type { FitCandidate, RankedCandidate, RankTanksInput, ToCandidateInput } from './tank-fit.types';

import { MISSION_METRIC_FIELD } from '../../config';

const SCORE_PRECISION = 10;

export const toCandidate = ({ row, metric }: ToCandidateInput): FitCandidate => ({
  tankId: row.tankId,
  value: row[MISSION_METRIC_FIELD[metric]],
  winRate: row.winRate,
  battles: row.battles
});

export const rankTanks = ({ candidates, limit }: RankTanksInput): RankedCandidate[] => {
  const sorted = [...candidates].sort((a, b) => b.value - a.value || b.winRate - a.winRate || b.battles - a.battles);
  const last = Math.max(1, sorted.length - 1);
  const ranked = sorted.map((candidate, index) => ({
    ...candidate,
    score: sorted.length === 1 ? 100 : Math.round(((last - index) / last) * 100 * SCORE_PRECISION) / SCORE_PRECISION
  }));

  return limit === undefined ? ranked : ranked.slice(0, limit);
};
