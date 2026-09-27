import { HONEST_RNG } from '@otmetki/schemas';
import { range } from 'remeda';
import { describe, expect, it } from 'vitest';

import { bucketMidpoint } from '../roll-percent';

const width = (HONEST_RNG.spread * 2) / HONEST_RNG.buckets;
const BUCKETS = range(0, HONEST_RNG.buckets).map((index) => ({
  from: -HONEST_RNG.spread + index * width,
  to: -HONEST_RNG.spread + (index + 1) * width
}));

describe('bucketMidpoint', () => {
  it('labels buckets in increasing order across the spread', () => {
    const labels = BUCKETS.map(bucketMidpoint);

    labels.slice(1).forEach((label, index) => expect(label).toBeGreaterThan(labels[index] ?? Number.NEGATIVE_INFINITY));
  });

  it('labels the spread symmetrically around the nominal damage', () => {
    const labels = BUCKETS.map(bucketMidpoint);

    expect(labels.map((label) => -label).reverse()).toEqual(labels);
  });
});
