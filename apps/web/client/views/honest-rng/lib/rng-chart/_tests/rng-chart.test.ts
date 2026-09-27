import { describe, expect, it } from 'vitest';

import { HONEST_RNG_VIEW } from '../../../config';
import { bucketMidpoints, bucketShares, rollPercent, toShellKey } from '../rng-chart';

describe('bucketMidpoints', () => {
  it('labels symmetric buckets with mirrored percents', () => {
    const [left, right] = bucketMidpoints([
      { from: -0.25, to: -0.2 },
      { from: 0.2, to: 0.25 }
    ]);

    expect(left).toBe(-(right ?? 0));
    expect(right).toBeCloseTo(0.225 * HONEST_RNG_VIEW.percentScale, 1);
  });
});

describe('bucketShares', () => {
  it('reads a missing share as zero', () => {
    expect(bucketShares([{ share: null }, { share: 12.5 }])).toEqual([0, 12.5]);
  });
});

describe('rollPercent', () => {
  it('keeps an unknown roll unknown and scales a known one', () => {
    expect(rollPercent(null)).toBeNull();
    expect(rollPercent(0)).toBe(0);
    expect(rollPercent(-0.02)).toBeCloseTo(-0.02 * HONEST_RNG_VIEW.percentScale, 9);
  });
});

describe('toShellKey', () => {
  it('keeps known shells and folds the rest into unknown', () => {
    expect(toShellKey('hollow_charge')).toBe('hollow_charge');
    expect(toShellKey('flame')).toBe('unknown');
  });
});
