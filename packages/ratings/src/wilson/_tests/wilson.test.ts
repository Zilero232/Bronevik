import { describe, expect, it } from 'vitest';

import { wilsonInterval } from '../wilson';
import { WILSON } from '../wilson.constants';

describe('wilsonInterval', () => {
  it('brackets the observed rate', () => {
    const { lower, upper } = wilsonInterval({ rate: 55, trials: 400 });

    expect(lower).toBeLessThan(55);
    expect(upper).toBeGreaterThan(55);
  });

  it('narrows as the sample grows', () => {
    const small = wilsonInterval({ rate: 60, trials: 20 });
    const large = wilsonInterval({ rate: 60, trials: 2_000 });

    expect(large.lower).toBeGreaterThan(small.lower);
    expect(large.upper).toBeLessThan(small.upper);
  });

  it('ranks a large 60 % sample above a short 70 % streak by the lower bound', () => {
    expect(wilsonInterval({ rate: 60, trials: 5_000 }).lower).toBeGreaterThan(wilsonInterval({ rate: 70, trials: 60 }).lower);
  });

  it('ranks a large 40 % sample below a short 30 % streak by the upper bound', () => {
    expect(wilsonInterval({ rate: 40, trials: 5_000 }).upper).toBeLessThan(wilsonInterval({ rate: 30, trials: 60 }).upper);
  });

  it('stays within 0–100 at the extremes', () => {
    for (const rate of [0, 100, -5, 120]) {
      const { lower, upper } = wilsonInterval({ rate, trials: 3 });

      expect(lower).toBeGreaterThanOrEqual(0);
      expect(upper).toBeLessThanOrEqual(WILSON.percent);
    }
  });

  it('returns the widest interval without trials', () => {
    expect(wilsonInterval({ rate: 50, trials: 0 })).toEqual({ lower: 0, upper: WILSON.percent });
  });

  it('widens with a larger z', () => {
    const narrow = wilsonInterval({ rate: 50, trials: 100, z: 1 });
    const wide = wilsonInterval({ rate: 50, trials: 100, z: 3 });

    expect(wide.lower).toBeLessThan(narrow.lower);
    expect(wide.upper).toBeGreaterThan(narrow.upper);
  });
});
