import { describe, expect, it } from 'vitest';

import { dailyWindow } from '../daily-reset';

describe('dailyWindow', () => {
  it('starts the day at the reset hour in Moscow', () => {
    const { resetAt, nextResetAt } = dailyWindow(new Date('2026-09-26T12:00:00Z'));

    expect(resetAt.toISOString()).toBe('2026-09-26T01:00:00.000Z');
    expect(nextResetAt.toISOString()).toBe('2026-09-27T01:00:00.000Z');
  });

  it('keeps the previous day before the reset hour', () => {
    const { resetAt } = dailyWindow(new Date('2026-09-26T00:30:00Z'));

    expect(resetAt.toISOString()).toBe('2026-09-25T01:00:00.000Z');
  });

  it('always contains the given moment', () => {
    const now = new Date('2026-09-26T01:00:00Z');
    const { resetAt, nextResetAt } = dailyWindow(now);

    expect(resetAt.getTime()).toBeLessThanOrEqual(now.getTime());
    expect(nextResetAt.getTime()).toBeGreaterThan(now.getTime());
  });
});
