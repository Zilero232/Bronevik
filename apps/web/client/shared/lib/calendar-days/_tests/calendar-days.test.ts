import { describe, expect, it } from 'vitest';

import { dayKey, daysBetween, daysUntil, nextDayStart, shiftDay, weekKey } from '../calendar-days';

describe('dayKey', () => {
  it('names the Moscow calendar day of an instant', () => {
    expect(dayKey({ date: '2026-09-26T20:59:00Z' })).toBe('2026-09-26');
    expect(dayKey({ date: '2026-09-26T21:00:00Z' })).toBe('2026-09-27');
    expect(dayKey({ date: new Date('2026-09-26T21:00:00Z'), timeZone: 'UTC' })).toBe('2026-09-26');
  });

  it('keeps a bare date as that day', () => {
    expect(dayKey({ date: '2026-09-26' })).toBe('2026-09-26');
  });
});

describe('weekKey', () => {
  it('starts the ISO week on the Moscow Monday', () => {
    expect(weekKey({ date: '2026-09-27T20:30:00Z' })).toBe('2026-09-21');
    expect(weekKey({ date: '2026-09-27T21:30:00Z' })).toBe('2026-09-28');
  });
});

describe('daysBetween', () => {
  it('counts calendar days rather than 24-hour spans', () => {
    expect(daysBetween({ from: '2026-09-26T20:00:00Z', to: '2026-09-26T21:30:00Z' })).toBe(1);
    expect(daysBetween({ from: '2026-09-26T20:00:00Z', to: '2026-09-26T21:30:00Z', timeZone: 'UTC' })).toBe(0);
  });

  it('works on bare dates and goes negative backwards', () => {
    expect(daysBetween({ from: '2026-01-01', to: '2026-10-01' })).toBe(273);
    expect(daysBetween({ from: '2026-10-01', to: '2026-09-24' })).toBe(-7);
  });

  it('keeps whole days across the winter and summer halves of the year', () => {
    expect(daysBetween({ from: '2026-03-28T12:00:00Z', to: '2026-03-30T12:00:00Z' })).toBe(2);
    expect(daysBetween({ from: '2026-10-24T12:00:00Z', to: '2026-10-26T12:00:00Z' })).toBe(2);
  });
});

describe('daysUntil', () => {
  it('counts the days left from now to a date', () => {
    expect(daysUntil({ date: '2026-10-03T12:00:00Z', now: new Date('2026-09-26T12:00:00Z') })).toBe(7);
  });
});

describe('nextDayStart', () => {
  it('lands on the next Moscow midnight', () => {
    expect(nextDayStart({ date: new Date('2026-09-26T12:00:00Z') }).toISOString()).toBe('2026-09-26T21:00:00.000Z');
    expect(nextDayStart({ date: new Date('2026-09-26T21:00:00Z') }).toISOString()).toBe('2026-09-27T21:00:00.000Z');
  });
});

describe('shiftDay', () => {
  it('moves a day key by whole days across month and year edges', () => {
    expect(shiftDay({ day: '2026-10-01', amount: -1 })).toBe('2026-09-30');
    expect(shiftDay({ day: '2026-12-31', amount: 1 })).toBe('2027-01-01');
  });
});
