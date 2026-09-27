import { describe, expect, it } from 'vitest';

import { latestDeadline, parseRussianDay, parseRussianDeadlines } from '../russian-date';

const reference = new Date('2026-05-05T10:00:00Z');

describe('parseRussianDeadlines', () => {
  it('reads "до 12 мая 9:00 (МСК)" as Moscow time', () => {
    expect(parseRussianDeadlines({ text: 'Воспользоваться предложением можно до 12 мая 9:00 (МСК).', reference })[0]?.toISOString()).toBe(
      '2026-05-12T06:00:00.000Z'
    );
  });

  it('ends a deadline without a time at the end of the day', () => {
    expect(parseRussianDeadlines({ text: 'до 3 июня', reference })[0]?.toISOString()).toBe('2026-06-03T20:59:00.000Z');
  });

  it('rolls a January deadline seen in December into the next year', () => {
    expect(parseRussianDeadlines({ text: 'до 10 января 12:00', reference: new Date('2026-12-20T00:00:00Z') })[0]?.getUTCFullYear()).toBe(2027);
  });

  it('finds nothing in text without dates', () => {
    expect(parseRussianDeadlines({ text: 'Скидка 50%', reference })).toEqual([]);
  });
});

describe('latestDeadline', () => {
  it('picks the last of several deadlines', () => {
    expect(latestDeadline({ text: 'до 12 мая 9:00 и до 18 мая 09:00 (МСК)', reference })?.toISOString()).toBe('2026-05-18T06:00:00.000Z');
  });

  it('returns null without deadlines', () => {
    expect(latestDeadline({ text: '', reference })).toBeNull();
  });
});

describe('parseRussianDay', () => {
  it('reads a listing date and never places it in the future', () => {
    const now = new Date('2026-09-25T00:00:00Z');

    expect(parseRussianDay({ text: '10 сентября, четверг', reference: now })?.getUTCFullYear()).toBe(2026);
    expect(parseRussianDay({ text: '14 декабря', reference: now })?.getUTCFullYear()).toBe(2025);
  });

  it('returns null without a date', () => {
    expect(parseRussianDay({ text: 'вчера', reference })).toBeNull();
  });
});
