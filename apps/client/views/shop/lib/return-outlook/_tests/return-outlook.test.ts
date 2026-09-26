import { describe, expect, it } from 'vitest';

import { returnOutlook } from '../return-outlook';

const now = new Date('2026-09-26T12:00:00Z');
const soonDays = 14;

describe('returnOutlook', () => {
  it('is unknown when the tank has not returned often enough to estimate', () => {
    expect(returnOutlook({ nextExpectedAt: null, now, soonDays })).toEqual({ state: 'unknown', days: null });
  });

  it('counts the days left and calls a near return soon', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-10-03T12:00:00Z', now, soonDays })).toEqual({ state: 'soon', days: 7 });
  });

  it('treats the boundary day as soon and the next one as later', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-10-10T12:00:00Z', now, soonDays }).state).toBe('soon');
    expect(returnOutlook({ nextExpectedAt: '2026-10-11T12:00:00Z', now, soonDays }).state).toBe('later');
  });

  it('reports how late an expected return already is', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-09-20T12:00:00Z', now, soonDays })).toEqual({ state: 'overdue', days: 6 });
  });

  it('expects the return today when the estimate falls on the current day', () => {
    expect(returnOutlook({ nextExpectedAt: '2026-09-26T08:00:00Z', now, soonDays })).toEqual({ state: 'soon', days: 0 });
  });
});
