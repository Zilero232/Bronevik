import { describe, expect, it } from 'vitest';

import { aggregateWinRateDiff, winRateDiff, winRateDiffFromAggregate } from '..';

describe('winRateDiff', () => {
  it('is zero when every player wins on the tank exactly as often as overall', () => {
    const result = winRateDiff([
      { battles: 100, wins: 60, playerWinRate: 60 },
      { battles: 300, wins: 135, playerWinRate: 45 }
    ]);

    expect(result?.diff).toBeCloseTo(0, 10);
  });

  it('weights each player by battles on the tank', () => {
    const result = winRateDiff([
      { battles: 100, wins: 55, playerWinRate: 50 },
      { battles: 300, wins: 150, playerWinRate: 50 }
    ]);

    expect(result?.tankWinRate).toBeCloseTo((205 / 400) * 100, 10);
    expect(result?.expectedWinRate).toBeCloseTo(50, 10);
    expect(result?.diff).toBeCloseTo((205 / 400) * 100 - 50, 10);
  });

  it('gives the same answer from pre-aggregated sums', () => {
    const rows = [
      { battles: 40, wins: 25, playerWinRate: 52 },
      { battles: 10, wins: 3, playerWinRate: 47 }
    ];

    expect(winRateDiffFromAggregate(aggregateWinRateDiff(rows))).toEqual(winRateDiff(rows));
  });

  it('returns null without battles', () => {
    expect(winRateDiff([])).toBeNull();
  });
});
