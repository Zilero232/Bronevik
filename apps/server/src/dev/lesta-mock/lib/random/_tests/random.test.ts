import { describe, expect, it } from 'vitest';

import { createRng, hashSeed, normalCdf, normalQuantile } from '..';

describe('random', () => {
  it('derives the same stream from the same parts', () => {
    const left = createRng(1, 2, 3);
    const right = createRng(1, 2, 3);

    expect(Array.from({ length: 5 }, () => left.float())).toEqual(Array.from({ length: 5 }, () => right.float()));
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(1, 2, 4));
  });

  it('inverts the normal distribution', () => {
    for (const probability of [0.01, 0.2, 0.5, 0.8, 0.99]) {
      expect(normalCdf(normalQuantile(probability))).toBeCloseTo(probability, 3);
    }
  });
});
