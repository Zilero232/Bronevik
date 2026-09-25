import { describe, expect, it } from 'vitest';

import { computeAverages, sumTotals, winRate } from '..';
import { makeTank } from '../../_tests/fixtures';

describe('stats', () => {
  it('computes win rate as a percentage and zero without battles', () => {
    expect(winRate({ wins: 13, battles: 25 })).toBe(52);
    expect(winRate({ wins: 0, battles: 0 })).toBe(0);
  });

  it('derives per-battle averages from totals', () => {
    const tank = makeTank({ tankId: 1, battles: 200, factor: 1.5 });
    const averages = computeAverages(tank);

    expect(averages.damage).toBe(tank.damageDealt / tank.battles);
    expect(averages.winRate).toBe((tank.wins / tank.battles) * 100);
    expect(averages.hitRate).toBe(((tank.hits ?? 0) / (tank.shots ?? 1)) * 100);
    expect(averages.damageRatio).toBe(tank.damageDealt / (tank.damageReceived ?? 1));
  });

  it('leaves optional averages empty when the source does not carry them', () => {
    const averages = computeAverages({ battles: 5, wins: 2, damageDealt: 100, frags: 1, spotted: 1, capturePoints: 0, droppedCapturePoints: 0 });

    expect(averages.xp).toBeNull();
    expect(averages.survivalRate).toBeNull();
  });

  it('sums totals across tanks', () => {
    const summed = sumTotals([makeTank({ tankId: 1, battles: 10 }), makeTank({ tankId: 2, battles: 30 })]);

    expect(summed).toMatchObject({ battles: 40, damageDealt: makeTank({ tankId: 3, battles: 40 }).damageDealt });
  });
});
