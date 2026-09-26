import { describe, expect, it } from 'vitest';

import { tierBand } from '../tier-band';

describe('tierBand', () => {
  it.each([
    [1, 'low'],
    [5, 'low'],
    [6, 'mid'],
    [8, 'mid'],
    [9, 'high'],
    [10, 'high'],
    [11, 'top']
  ] as const)('maps tier %i to %s', (tier, band) => {
    expect(tierBand(tier)).toBe(band);
  });
});
