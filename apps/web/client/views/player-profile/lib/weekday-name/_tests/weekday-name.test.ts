import { describe, expect, it } from 'vitest';

import { weekdayName } from '../weekday-name';

const expected = (day: number) => new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, day)));

describe('weekdayName', () => {
  it('starts the week on Monday, as the playtime grid does', () => {
    expect(weekdayName({ locale: 'en', index: 0 })).toBe(expected(1));
  });

  it('ends the week on Sunday', () => {
    expect(weekdayName({ locale: 'en', index: 6 })).toBe(expected(7));
  });

  it('gives seven distinct names for the seven grid rows', () => {
    expect(new Set(Array.from({ length: 7 }, (_, index) => weekdayName({ locale: 'ru', index }))).size).toBe(7);
  });
});
