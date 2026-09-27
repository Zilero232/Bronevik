import { describe, expect, it } from 'vitest';

import { moscowDay, moscowDayStart } from '../../moscow-time';
import { previousWeek, weekWindow } from '../week';

describe('weekWindow', () => {
  it('starts at Moscow Monday midnight and lasts seven days', () => {
    const { start, end } = weekWindow(new Date('2026-09-24T12:00:00Z'));

    expect(start.toISOString()).toBe('2026-09-20T21:00:00.000Z');
    expect(start).toEqual(moscowDayStart(start));
    expect(end.getTime() - start.getTime()).toBe(7 * 86_400_000);
  });

  it('puts Monday 01:00 in Moscow into the new week although it is still Sunday in UTC', () => {
    const sundayUtc = new Date('2026-09-20T22:00:00Z');

    expect(weekWindow(sundayUtc).start.toISOString()).toBe('2026-09-20T21:00:00.000Z');
  });

  it('keys the week by its Moscow Monday as a UTC-midnight date', () => {
    const { start, weekStart } = weekWindow(new Date('2026-09-24T12:00:00Z'));

    expect(weekStart.toISOString().slice(0, 10)).toBe(moscowDay(start));
    expect(weekStart.getUTCHours()).toBe(0);
  });
});

describe('previousWeek', () => {
  it('ends where the current week starts', () => {
    const now = new Date('2026-09-24T10:00:00Z');

    expect(previousWeek(now).end.getTime()).toBe(weekWindow(now).start.getTime());
  });
});
