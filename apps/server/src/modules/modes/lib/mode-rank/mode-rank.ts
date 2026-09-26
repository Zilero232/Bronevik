import type { ModeRank } from '@otmetki/schemas';

import { sortBy, sumBy } from 'remeda';

import type { RankedTank, RankModeTanksInput } from './mode-rank.types';

import { MODE_RANKING } from '../../config';

const SCORE_DIGITS = 100;

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
    score: Math.round(((tank.wins + prior * average) / (tank.decided + prior) - average) * 100 * SCORE_DIGITS) / SCORE_DIGITS
  }));

  const sorted = sortBy(scored, [(tank) => tank.score, 'desc']);

  return new Map(sorted.map((tank, index) => [tank.tankId, { score: tank.score, rank: rankAt(index / sorted.length) }]));
};
