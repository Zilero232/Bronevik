import { describe, expect, it } from 'vitest';

import { tierBand } from '..';

describe('tierBand', () => {
  it.each([
    [1, 'low'],
    [5, 'low'],
    [6, 'mid'],
    [8, 'mid'],
    [9, 'high'],
    [10, 'high'],
    [11, 'top']
  ] as const)('puts tier %i in the %s band', (tier, band) => {
    expect(tierBand(tier)).toBe(band);
  });
});
