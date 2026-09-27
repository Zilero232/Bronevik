import { describe, expect, it } from 'vitest';

import { splitPlaytime } from '../playtime-split';

describe('splitPlaytime', () => {
  it('always returns every hour and weekday', () => {
    const { hours, weekdays } = splitPlaytime([]);

    expect(hours).toHaveLength(24);
    expect(weekdays).toHaveLength(7);
    expect(hours.every((hour) => hour.winRate === null)).toBe(true);
  });

  it('sums the same hour across weekdays', () => {
    const { hours, weekdays } = splitPlaytime([
      { weekday: 0, hour: 20, battles: 10, wins: 6, damage: 20_000 },
      { weekday: 3, hour: 20, battles: 10, wins: 4, damage: 10_000 }
    ]);

    expect(hours[20]).toMatchObject({ battles: 20, winRate: 50, avgDamage: 1500 });
    expect(weekdays[3]?.battles).toBe(10);
  });
});
