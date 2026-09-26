import { millisecondsInDay } from 'date-fns/constants';
import { describe, expect, it } from 'vitest';

import { absenceBeforeReturn, returnEstimate } from '../offer-return';

const day = (value: number) => new Date(Date.UTC(2026, 0, 1) + value * millisecondsInDay);

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

describe('absenceBeforeReturn', () => {
  it('is not a return when the tank was never on sale before', () => {
    expect(absenceBeforeReturn({ previous: [], now: day(100), minDays: 14 })).toBeNull();
  });

  it('counts the days since the last offer ended', () => {
    expect(
      absenceBeforeReturn({
        previous: [
          { endsAt: day(10), lastSeenAt: day(9) },
          { endsAt: day(40), lastSeenAt: day(35) }
        ],
        now: day(100),
        minDays: 14
      })
    ).toBe(60);
  });

  it('falls back to the last sighting of an offer without an end date', () => {
    expect(absenceBeforeReturn({ previous: [{ endsAt: null, lastSeenAt: day(80) }], now: day(100), minDays: 14 })).toBe(20);
  });

  it('is not a return while the tank was on sale recently or still is', () => {
    expect(absenceBeforeReturn({ previous: [{ endsAt: day(95), lastSeenAt: day(90) }], now: day(100), minDays: 14 })).toBeNull();
    expect(absenceBeforeReturn({ previous: [{ endsAt: day(130), lastSeenAt: day(99) }], now: day(100), minDays: 14 })).toBeNull();
  });
});
