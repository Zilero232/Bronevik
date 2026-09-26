import { describe, expect, it } from 'vitest';

import { countdownParts } from '../countdown-parts';

describe('countdownParts', () => {
  it('splits seconds into whole days, hours and minutes', () => {
    expect(countdownParts(2 * 86_400 + 3 * 3_600 + 7 * 60 + 59)).toEqual({ days: 2, hours: 3, minutes: 7 });
  });

  it('never goes below zero', () => {
    expect(countdownParts(-30)).toEqual({ days: 0, hours: 0, minutes: 0 });
  });
});
