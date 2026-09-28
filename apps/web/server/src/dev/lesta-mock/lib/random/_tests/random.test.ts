import { probit } from 'simple-statistics';
import { describe, expect, it } from 'vitest';

import { createRng, hashSeed, normalCdf } from '..';

describe('random', () => {
  it('derives the same stream from the same parts', () => {
    const left = createRng(1, 2, 3);
    const right = createRng(1, 2, 3);

    expect(Array.from({ length: 5 }, () => left.float())).toEqual(Array.from({ length: 5 }, () => right.float()));
    expect(hashSeed(1, 2, 3)).not.toBe(hashSeed(1, 2, 4));
  });

  it('inverts the normal distribution', () => {
    for (const probability of [0.01, 0.2, 0.5, 0.8, 0.99]) {
      expect(normalCdf(probit(probability))).toBeCloseTo(probability, 2);
    }
  });

  it.each([
    [0, 0.5],
    [1, 0.841_344_746],
    [1.959_964, 0.975],
    [-2.326_348, 0.01]
  ])('matches the standard normal table at z = %d', (z, probability) => {
    expect(normalCdf(z)).toBeCloseTo(probability, 6);
  });

  it.each([
    [0.5, 0],
    [0.975, 1.959_964],
    [0.01, -2.326_348],
    [0.841_344_746, 1]
  ])('keeps the quantile of p = %d within two decimals of the table', (probability, z) => {
    expect(probit(probability)).toBeCloseTo(z, 2);
  });
});
