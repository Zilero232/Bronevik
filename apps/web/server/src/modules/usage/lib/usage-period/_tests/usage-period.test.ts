import { describe, expect, it } from 'vitest';

import { usagePeriod } from '../usage-period';

describe('usagePeriod', () => {
  it('names the month by the Moscow calendar', () => {
    expect(usagePeriod(new Date('2026-09-15T12:00:00Z')).key).toBe('2026-09');
  });

  it('resets at midnight of the first day of the next month in Moscow', () => {
    expect(usagePeriod(new Date('2026-09-15T12:00:00Z')).resetsAt.toISOString()).toBe('2026-09-30T21:00:00.000Z');
  });

  it('already counts the evening of the last UTC day as the next month in Moscow', () => {
    const lastUtcEvening = usagePeriod(new Date('2026-09-30T21:30:00Z'));

    expect(lastUtcEvening.key).toBe('2026-10');
    expect(lastUtcEvening.resetsAt.toISOString()).toBe('2026-10-31T21:00:00.000Z');
  });

  it('rolls the year over in December', () => {
    expect(usagePeriod(new Date('2026-12-31T12:00:00Z')).resetsAt.toISOString()).toBe('2026-12-31T21:00:00.000Z');
  });
});
