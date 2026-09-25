import type { PlaytimeCell } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { playtimeSummary } from '../playtime-summary';

const cell = (overrides: Partial<PlaytimeCell>): PlaytimeCell => ({
  weekday: 0,
  hour: 0,
  battles: 100,
  winRate: 50,
  avgDamage: 2_000,
  ...overrides
});

describe('playtimeSummary', () => {
  it('picks the hour with the highest win rate', () => {
    const cells = [cell({ hour: 20, winRate: 60 }), cell({ hour: 3, winRate: 40 }), cell({ hour: 12, winRate: 50 })];

    expect(playtimeSummary({ cells, minBattles: 10 }).bestHour?.key).toBe(20);
  });

  it('picks the weakest hour for the warning', () => {
    const cells = [cell({ hour: 20, winRate: 60 }), cell({ hour: 3, winRate: 40 })];

    expect(playtimeSummary({ cells, minBattles: 10 }).worstHour?.key).toBe(3);
  });

  it('skips slots with too few battles to trust', () => {
    const cells = [cell({ hour: 4, battles: 2, winRate: 100 }), cell({ hour: 20, winRate: 55 })];

    expect(playtimeSummary({ cells, minBattles: 10 }).bestHour?.key).toBe(20);
  });

  it('weights a slot by its battles, not by its cells', () => {
    const cells = [cell({ weekday: 1, battles: 300, winRate: 60 }), cell({ weekday: 1, hour: 1, battles: 100, winRate: 40 })];

    expect(playtimeSummary({ cells, minBattles: 10 }).bestWeekday?.winRate).toBeCloseTo(55);
  });

  it('has nothing to say about an empty grid', () => {
    expect(playtimeSummary({ cells: [], minBattles: 10 })).toEqual({ bestHour: null, worstHour: null, bestWeekday: null });
  });
});
