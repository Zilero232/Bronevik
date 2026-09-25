import { describe, expect, it } from 'vitest';

import { OFFER_RETURN } from '../../../config';
import { returnEstimate } from '../offer-return';

const day = (value: number) => new Date(Date.UTC(2026, 0, 1) + value * OFFER_RETURN.dayMs);

describe('returnEstimate', () => {
  it('has no forecast without history', () => {
    expect(returnEstimate([])).toEqual({ timesSeen: 0, lastSeenAt: null, medianIntervalDays: null, nextExpectedAt: null });
  });

  it('has no forecast after a single appearance', () => {
    expect(returnEstimate([day(0)]).nextExpectedAt).toBeNull();
  });

  it('projects the median gap after the last appearance', () => {
    const estimate = returnEstimate([day(0), day(30), day(90), day(120)]);

    expect(estimate.medianIntervalDays).toBe(30);
    expect(estimate.nextExpectedAt?.getTime()).toBe(day(150).getTime());
  });

  it('ignores duplicate sightings and input order', () => {
    expect(returnEstimate([day(60), day(0), day(0), day(30)]).timesSeen).toBe(3);
  });
});
