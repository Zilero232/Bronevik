import { describe, expect, it } from 'vitest';

import { averageTier, eff } from '..';

describe('eff', () => {
  it('matches a hand-computed reference', () => {
    const battles = 1000;
    const totals = {
      battles,
      wins: 520,
      damageDealt: 1500 * battles,
      frags: 1.1 * battles,
      spotted: 1.4 * battles,
      capturePoints: 1.2 * battles,
      droppedCapturePoints: 0.9 * battles
    };

    expect(eff({ totals, averageTier: 8 })).toBeCloseTo(1420.316_943_79, 6);
  });

  it('returns null without battles', () => {
    expect(
      eff({ totals: { battles: 0, wins: 0, damageDealt: 0, frags: 0, spotted: 0, capturePoints: 0, droppedCapturePoints: 0 }, averageTier: 5 })
    ).toBeNull();
  });

  it('computes a battle-weighted average tier and skips unknown tanks', () => {
    const tiers = new Map([
      [1, 10],
      [2, 6]
    ]);

    const tanks = [
      { tankId: 1, battles: 300 },
      { tankId: 2, battles: 100 },
      { tankId: 3, battles: 1000 }
    ];

    expect(averageTier({ tanks, tiers })).toBe((300 * 10 + 100 * 6) / 400);
    expect(averageTier({ tanks: [{ tankId: 3, battles: 5 }], tiers })).toBeNull();
  });
});
