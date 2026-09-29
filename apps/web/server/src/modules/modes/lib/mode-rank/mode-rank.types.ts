import type { ModeRank } from '@otmetki/schemas';

import type { ModeTankAggregate } from '../../../../../generated';

export type RankableTank = Pick<ModeTankAggregate, 'battles' | 'decided' | 'tankId' | 'wins'>;

export type RankModeTanksInput = {
  tanks: readonly RankableTank[];
  minBattles: number;
};

export type RankedTank = {
  score: number;
  rank: ModeRank;
};
