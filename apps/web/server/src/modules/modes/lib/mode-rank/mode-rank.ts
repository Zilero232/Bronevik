import type { ModeRank } from '@otmetki/schemas';

import { sortBy, sumBy } from 'remeda';

import type { RankedTank, RankModeTanksInput } from './mode-rank.types';

import { MODE_RANKING } from '../../config';
import { MODE_RANK_SCORE } from './mode-rank.constants';

const rankAt = (position: number): ModeRank => MODE_RANKING.shares.find((share) => position < share.upTo)?.rank ?? 'D';

export const rankModeTanks = ({ tanks, minBattles }: RankModeTanksInput): Map<number, RankedTank> => {
  const eligible = tanks.filter((tank) => tank.battles >= minBattles && tank.decided > 0);
  const decided = sumBy(eligible, (tank) => tank.decided);

  if (decided === 0) {
    return new Map();
  }

  const average = sumBy(eligible, (tank) => tank.wins) / decided;
  const prior = MODE_RANKING.priorBattles;

  const scored = eligible.map((tank) => ({
    tankId: tank.tankId,
    score: Math.round(((tank.wins + prior * average) / (tank.decided + prior) - average) * 100 * MODE_RANK_SCORE.digits) / MODE_RANK_SCORE.digits
  }));

  const sorted = sortBy(scored, [(tank) => tank.score, 'desc']);

  return new Map(sorted.map((tank, index) => [tank.tankId, { score: tank.score, rank: rankAt(index / sorted.length) }]));
};
