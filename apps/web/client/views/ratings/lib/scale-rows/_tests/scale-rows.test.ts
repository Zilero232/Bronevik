import { RATING_SCALES, RATING_TIERS, ratingTier } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { RATING_SCALE_COLUMNS } from '../../../config';
import { scaleRows } from '../scale-rows';

describe('scaleRows', () => {
  it('lists every rating tier once, best first', () => {
    expect(scaleRows().map(({ tier }) => tier)).toEqual([...RATING_TIERS].reverse());
  });

  it('starts every row at a value the rating math puts in that same tier', () => {
    for (const row of scaleRows()) {
      for (const scale of RATING_SCALE_COLUMNS) {
        expect(ratingTier({ scale, value: row.from[scale] })).toBe(row.tier);
      }
    }
  });

  it('shows the lower bound of each scale exactly as the package defines it', () => {
    const worst = scaleRows().at(-1);

    for (const scale of RATING_SCALE_COLUMNS) {
      expect(worst?.from[scale]).toBe(RATING_SCALES[scale][0]);
    }
  });
});
