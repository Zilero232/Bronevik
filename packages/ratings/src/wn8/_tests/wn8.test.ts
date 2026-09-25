import { describe, expect, it } from 'vitest';

import type { TankTotals } from '../../stats';

import { accountWn8, tankWn8, WN8, wn8FromRatios } from '..';
import { makeTank, UNIT_EXPECTED } from '../../_tests/fixtures';

const EXPECTED = UNIT_EXPECTED;

describe('wn8', () => {
  it('scores a player who exactly matches expected values at the sum of all weights', () => {
    const { wn8 } = wn8FromRatios({ rDamage: 1, rSpot: 1, rFrag: 1, rDef: 1, rWin: 1 });
    const weightSum = Object.values(WN8.weight).reduce((sum, weight) => sum + weight, 0);

    expect(wn8).toBeCloseTo(weightSum, 6);
    expect(wn8).toBeCloseTo(1565, 6);
  });

  it('matches a hand-computed reference for a single tank', () => {
    const totals: TankTotals = {
      tankId: 1,
      battles: 100,
      wins: 55,
      damageDealt: 150_000,
      frags: 130,
      spotted: 120,
      capturePoints: 0,
      droppedCapturePoints: 80
    };

    expect(tankWn8({ totals, expected: EXPECTED })).toBeCloseTo(2618.409_090_9, 4);
  });

  it('caps frag, spot and defence contributions relative to damage', () => {
    const capped = wn8FromRatios({ rDamage: 0.22, rSpot: 5, rFrag: 5, rDef: 5, rWin: 1 });

    expect(capped.rDamageC).toBe(0);
    expect(capped.rFragC).toBeCloseTo(WN8.cap.fragOverDamage, 10);
    expect(capped.rSpotC).toBeCloseTo(WN8.cap.spotOverDamage, 10);
    expect(capped.rDefC).toBeCloseTo(WN8.cap.defOverDamage, 10);
  });

  it('never goes negative for a terrible player', () => {
    expect(wn8FromRatios({ rDamage: 0, rSpot: 0, rFrag: 0, rDef: 0, rWin: 0 }).wn8).toBe(0);
  });

  it('returns null for a tank with no battles', () => {
    expect(tankWn8({ totals: makeTank({ tankId: 1, battles: 0, factor: 1 }), expected: EXPECTED })).toBeNull();
  });

  it('weights the account score by per-tank expected values and reports uncovered tanks', () => {
    const expected = new Map([
      [1, EXPECTED],
      [2, { ...EXPECTED, tankId: 2, expDamage: 3000 }]
    ]);

    const tanks = [
      { ...makeTank({ tankId: 1, battles: 100, factor: 1 }) },
      { ...makeTank({ tankId: 2, battles: 100, factor: 1 }), damageDealt: 100 * 3000 },
      makeTank({ tankId: 99, battles: 40, factor: 3 })
    ];

    const result = accountWn8({ tanks, expected });

    expect(result.wn8).toBeCloseTo(1565, 6);
    expect(result.battles).toBe(200);
    expect(result.battlesWithoutExpected).toBe(40);
    expect(result.tanksWithoutExpected).toEqual([99]);
  });

  it('agrees with the single-tank formula when the account has one tank', () => {
    const tank = makeTank({ tankId: 1, battles: 250, factor: 1.3 });

    expect(accountWn8({ tanks: [tank], expected: new Map([[1, EXPECTED]]) }).wn8).toBeCloseTo(
      tankWn8({ totals: tank, expected: EXPECTED }) ?? Number.NaN,
      8
    );
  });
});
