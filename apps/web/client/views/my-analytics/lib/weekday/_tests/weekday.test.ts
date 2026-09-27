import { range } from 'remeda';
import { describe, expect, it } from 'vitest';

import { orderWeekdays, weekdayDate } from '../weekday';

describe('weekdayDate', () => {
  it('lands on the matching UTC weekday for every index the server sends', () => {
    range(0, 7).forEach((weekday) => expect(weekdayDate(weekday).getUTCDay()).toBe(weekday));
  });
});

describe('orderWeekdays', () => {
  const days = range(0, 7).map((weekday) => ({ weekday, battles: weekday, winRate: null, avgDamage: null }));

  it('starts the week on Monday and ends it on Sunday', () => {
    const ordered = orderWeekdays(days);

    expect(ordered[0]?.weekday).toBe(weekdayDate(1).getUTCDay());
    expect(ordered.at(-1)?.weekday).toBe(weekdayDate(0).getUTCDay());
  });

  it('keeps every day', () => {
    expect(orderWeekdays(days)).toHaveLength(days.length);
  });
});
