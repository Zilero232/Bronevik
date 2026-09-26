import type { TierListRank } from '@otmetki/schemas';

export type TierListCandidate = {
  tankId: number;
  winRateDiff: number;
  battles: number;
  storedRank: string | null;
  previousWinRateDiff: number | null;
};

export type RankedCandidate = TierListCandidate & {
  rank: TierListRank;
  score: number;
  trend: 'down' | 'flat' | 'up' | null;
};
