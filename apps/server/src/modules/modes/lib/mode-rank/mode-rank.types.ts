import type { ModeRank } from '@otmetki/schemas';

export type RankableTank = {
  tankId: number;
  battles: number;
  wins: number;
  decided: number;
};

export type RankModeTanksInput = {
  tanks: readonly RankableTank[];
  minBattles: number;
};

export type RankedTank = {
  score: number;
  rank: ModeRank;
};
