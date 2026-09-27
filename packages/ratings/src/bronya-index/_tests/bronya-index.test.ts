import { describe, expect, it } from 'vitest';

import type { TankReference } from '..';

import { BRONYA_INDEX, bronyaIndex, percentileOf } from '..';
import { makeTank } from '../../stats/_tests/fixtures';

const SPREAD = [0.5, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.8];

const proportional = (median: number) => SPREAD.map((multiplier) => multiplier * median);

const reference = (tankId: number): TankReference => ({
  tankId,
  quantiles: {
    damage: proportional(1000),
    winRate: proportional(50),
    frags: proportional(1),
    spotted: proportional(1),
    defence: proportional(1)
  }
});

const references = new Map([
  [1, reference(1)],
  [2, reference(2)]
]);

describe('percentileOf', () => {
  it('returns the quantile level at each quantile value', () => {
    const quantiles = proportional(1000);

    quantiles.forEach((value, index) => {
      expect(percentileOf({ value, quantiles })).toBeCloseTo(BRONYA_INDEX.quantileLevels[index] ?? Number.NaN, 10);
    });
  });

  it('interpolates between zero and the lowest quantile and clamps above the top', () => {
    const quantiles = proportional(1000);

    expect(percentileOf({ value: 0, quantiles })).toBe(0);
    expect(percentileOf({ value: 250, quantiles })).toBeCloseTo(BRONYA_INDEX.quantileLevels[0] / 2, 10);
    expect(percentileOf({ value: 1_000_000, quantiles })).toBe(1);
  });

  it('rejects a table with the wrong number of quantiles', () => {
    expect(() => percentileOf({ value: 1, quantiles: [1, 2] })).toThrow(RangeError);
  });
});

describe('bronyaIndex', () => {
  it('puts a median player at the middle of the scale', () => {
    const result = bronyaIndex({ tanks: [makeTank({ tankId: 1, battles: 500 }), makeTank({ tankId: 2, battles: 500 })], references });

    expect(result.index).toBe(BRONYA_INDEX.scale / 2);
  });

  it('grows with skill and stays inside the scale', () => {
    const indexAt = (factor: number) => bronyaIndex({ tanks: [makeTank({ tankId: 1, battles: 1000, factor })], references }).index ?? Number.NaN;
    const values = [0.3, 0.7, 1, 1.3, 1.6, 3].map(indexAt);

    expect(values).toEqual([...values].sort((left, right) => left - right));
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThanOrEqual(BRONYA_INDEX.scale);
  });

  it('shrinks small samples toward the median', () => {
    const indexWith = (battles: number) => bronyaIndex({ tanks: [makeTank({ tankId: 1, battles, factor: 1.4 })], references });
    const few = indexWith(5);
    const many = indexWith(5000);

    expect(few.index).toBeLessThan(many.index ?? 0);
    expect(few.index).toBeGreaterThan(BRONYA_INDEX.scale / 2);
    expect(few.confidence).toBeLessThan(many.confidence);
  });

  it('weights tanks by battles', () => {
    const result = bronyaIndex({
      tanks: [makeTank({ tankId: 1, battles: 900, factor: 1.4 }), makeTank({ tankId: 2, battles: 100, factor: 0.6 })],
      references
    });

    expect(result.index).toBeGreaterThan(BRONYA_INDEX.scale / 2);
  });

  it('reports tanks without a reference and returns null when nothing is covered', () => {
    const result = bronyaIndex({ tanks: [makeTank({ tankId: 77, battles: 10 })], references });

    expect(result.index).toBeNull();
    expect(result.tanksWithoutReference).toEqual([77]);
  });
});
