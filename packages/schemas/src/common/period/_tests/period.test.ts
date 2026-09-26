import { PERIOD_WINDOWS, RECENT_PERIODS } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { ratingPeriodSchema, recentPeriodSchema } from '../period.schemas';

describe('period schemas', () => {
  it('uses the recent periods owned by @otmetki/ratings', () => {
    expect([...recentPeriodSchema.options].sort()).toEqual([...RECENT_PERIODS].sort());
    expect(recentPeriodSchema.options.every((period) => period in PERIOD_WINDOWS)).toBe(true);
  });

  it('adds overall on top of the recent periods for ratings', () => {
    expect([...ratingPeriodSchema.options].sort()).toEqual(['overall', ...RECENT_PERIODS].sort());
  });
});
