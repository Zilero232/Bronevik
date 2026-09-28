import { describe, expect, it } from 'vitest';

import { seededRandom } from '../seeded-random';

const take = (seed: number) => {
  const random = seededRandom(seed);

  return Array.from({ length: 200 }, () => random());
};

describe('seededRandom', () => {
  it('repeats the same sequence for the same seed, so server and client agree', () => {
    expect(take(2026)).toEqual(take(2026));
  });

  it('gives a different sequence for a different seed', () => {
    expect(take(1)).not.toEqual(take(2));
  });

  it('stays inside [0, 1)', () => {
    take(7).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    });
  });

  it('still produces a sequence for a zero seed', () => {
    expect(new Set(take(0)).size).toBeGreaterThan(1);
  });

  it('spreads neighbouring seeds apart, so consecutive days draw different values', () => {
    const firsts = Array.from({ length: 20 }, (_, index) => Math.floor(seededRandom(20_261_001 + index)() * 30));

    expect(new Set(firsts).size).toBeGreaterThan(10);
  });
});
