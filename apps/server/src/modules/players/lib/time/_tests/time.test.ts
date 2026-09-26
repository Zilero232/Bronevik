import { describe, expect, it } from 'vitest';

import { moscowDay, moscowDayStart } from '../time';

describe('moscowDay', () => {
  it('rolls over to the next day at Moscow midnight, not UTC midnight', () => {
    expect(moscowDay(new Date('2026-03-10T20:59:59.999Z'))).toBe('2026-03-10');
    expect(moscowDay(new Date('2026-03-10T21:00:00.000Z'))).toBe('2026-03-11');
  });
});

describe('moscowDayStart', () => {
  it('returns the instant the Moscow day of the date began', () => {
    const start = moscowDayStart(new Date('2026-03-11T12:34:56.000Z'));

    expect(start.toISOString()).toBe('2026-03-10T21:00:00.000Z');
  });

  it('keeps a Moscow midnight as its own start', () => {
    const midnight = new Date('2026-03-10T21:00:00.000Z');

    expect(moscowDayStart(midnight)).toEqual(midnight);
  });

  it('returns a plain Date on the same Moscow day', () => {
    const date = new Date('2026-07-01T23:30:00.000Z');
    const start = moscowDayStart(date);

    expect(start.constructor).toBe(Date);
    expect(moscowDay(start)).toBe(moscowDay(date));
  });
});
