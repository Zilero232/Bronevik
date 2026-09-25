import { describe, expect, it } from 'vitest';

import { previousWeek, weekWindow } from '../week';

describe('weekWindow', () => {
  it('starts on Monday 00:00 UTC and lasts seven days', () => {
    const { start, end } = weekWindow(new Date('2026-09-24T23:30:00Z'));

    expect(start.toISOString()).toBe('2026-09-21T00:00:00.000Z');
    expect(end.getTime() - start.getTime()).toBe(7 * 86_400_000);
  });

  it('keeps Monday midnight in its own week', () => {
    expect(weekWindow(new Date('2026-09-21T00:00:00Z')).start.toISOString()).toBe('2026-09-21T00:00:00.000Z');
  });
});

describe('previousWeek', () => {
  it('ends where the current week starts', () => {
    const now = new Date('2026-09-24T10:00:00Z');

    expect(previousWeek(now).end.getTime()).toBe(weekWindow(now).start.getTime());
  });
});
