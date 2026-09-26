import { describe, expect, it } from 'vitest';

import { returnOutlook } from '../return-outlook';

const now = new Date('2026-09-26T12:00:00Z');
const soonDays = 14;
const timeZone = 'Europe/Moscow';

describe('returnOutlook', () => {
  it('is unknown when the tank has not returned often enough to estimate', () => {
    expect(returnOutlook({ nextExpectedAt: null, now, soonDays, timeZone })).toEqual({ state: 'unknown', days: null });
  });

  it('counts the days left and calls a near return soon', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-10-03T12:00:00Z', now, soonDays, timeZone })).toEqual({ state: 'soon', days: 7 });
  });

  it('treats the boundary day as soon and the next one as later', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-10-10T12:00:00Z', now, soonDays, timeZone }).state).toBe('soon');
    expect(returnOutlook({ nextExpectedAt: '2026-10-11T12:00:00Z', now, soonDays, timeZone }).state).toBe('later');
  });

  it('reports how late an expected return already is', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-09-20T12:00:00Z', now, soonDays, timeZone })).toEqual({ state: 'overdue', days: 6 });
  });

  it('expects the return today when the estimate falls on the current day', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-09-26T08:00:00Z', now, soonDays, timeZone })).toEqual({ state: 'soon', days: 0 });
  });

  it('counts calendar days in the given time zone rather than the runtime one', () => {
    const pastMoscowMidnight = new Date('2026-09-26T21:30:00Z');

    expect(returnOutlook({ nextExpectedAt: '2026-09-27T09:00:00Z', now: pastMoscowMidnight, soonDays, timeZone })).toEqual({
      state: 'soon',
      days: 0
    });

    expect(returnOutlook({ nextExpectedAt: '2026-09-27T09:00:00Z', now: pastMoscowMidnight, soonDays, timeZone: 'UTC' })).toEqual({
      state: 'soon',
      days: 1
    });
  });
});
