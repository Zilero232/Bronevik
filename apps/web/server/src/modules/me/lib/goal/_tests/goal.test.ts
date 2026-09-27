import { addDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { GOALS } from '../../../config';
import { isGoalEndAllowed } from '../goal';

const now = new Date('2026-09-26T12:00:00Z');

describe('isGoalEndAllowed', () => {
  it('accepts an end inside the allowed window', () => {
    expect(isGoalEndAllowed({ endsAt: addDays(now, 30), now })).toBe(true);
  });

  it('accepts the last allowed day itself', () => {
    expect(isGoalEndAllowed({ endsAt: addDays(now, GOALS.maxDurationDays), now })).toBe(true);
  });

  it('refuses an end in the past or right now', () => {
    expect(isGoalEndAllowed({ endsAt: now, now })).toBe(false);
  });

  it('refuses an end past the allowed window', () => {
    expect(isGoalEndAllowed({ endsAt: addDays(now, GOALS.maxDurationDays + 1), now })).toBe(false);
  });
});
