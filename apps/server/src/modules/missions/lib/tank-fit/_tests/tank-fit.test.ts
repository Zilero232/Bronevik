import { describe, expect, it } from 'vitest';

import { rankTanks, toCandidate } from '../tank-fit';

const row = {
  tankId: 1,
  avgDamage: 2500,
  avgFrags: 1.1,
  avgSpotted: 1.4,
  avgBlocked: 900,
  avgXp: 800,
  accuracy: 70,
  survivalRate: 30,
  winRate: 51,
  battles: 400
};

describe('toCandidate', () => {
  it('reads the stat the mission metric points at', () => {
    expect(toCandidate({ row, metric: 'damage' }).value).toBe(2500);
    expect(toCandidate({ row, metric: 'blocked' }).value).toBe(900);
    expect(toCandidate({ row, metric: 'winRate' }).value).toBe(51);
  });
});

describe('rankTanks', () => {
  it('orders by the metric, breaks ties by win rate and scores by position', () => {
    const ranked = rankTanks({
      candidates: [
        { tankId: 1, value: 10, winRate: 50, battles: 100 },
        { tankId: 2, value: 30, winRate: 48, battles: 100 },
        { tankId: 3, value: 10, winRate: 55, battles: 100 }
      ]
    });

    expect(ranked.map(({ tankId, score }) => [tankId, score])).toEqual([
      [2, 100],
      [3, 50],
      [1, 0]
    ]);
  });

  it('gives a single candidate a full score and honours the limit', () => {
    expect(rankTanks({ candidates: [{ tankId: 9, value: 1, winRate: 1, battles: 1 }] })[0].score).toBe(100);
    expect(rankTanks({ candidates: [row, { ...row, tankId: 2 }].map((item) => toCandidate({ row: item, metric: 'xp' })), limit: 1 })).toHaveLength(1);
  });
});
