import { describe, expect, it } from 'vitest';

import { quietDelayMs } from '../quiet-hours';

const hour = 60 * 60_000;
const utc = (time: string) => new Date(`2026-09-25T${time}:00Z`);

describe('quietDelayMs', () => {
  it('is zero without quiet hours', () => {
    expect(quietDelayMs({ quietHours: null, now: utc('23:30'), timeZone: 'UTC' })).toBe(0);
  });

  it('is zero outside a same-day window', () => {
    expect(quietDelayMs({ quietHours: { start: 13, end: 15 }, now: utc('12:59'), timeZone: 'UTC' })).toBe(0);
  });

  it('waits until the end of a window that wraps midnight', () => {
    expect(quietDelayMs({ quietHours: { start: 23, end: 8 }, now: utc('23:30'), timeZone: 'UTC' })).toBe(8.5 * hour);
  });

  it('treats the end hour as outside the window', () => {
    expect(quietDelayMs({ quietHours: { start: 23, end: 8 }, now: utc('08:00'), timeZone: 'UTC' })).toBe(0);
  });

  it('reads the clock in the user time zone', () => {
    expect(quietDelayMs({ quietHours: { start: 0, end: 7 }, now: utc('22:00'), timeZone: 'Europe/Moscow' })).toBe(6 * hour);
  });

  it('falls back to Moscow time for an unknown zone instead of throwing', () => {
    expect(() => quietDelayMs({ quietHours: { start: 0, end: 7 }, now: utc('22:00'), timeZone: 'Mars/Olympus' })).not.toThrow();
  });
});
