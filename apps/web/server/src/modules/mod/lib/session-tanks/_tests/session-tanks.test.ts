import { describe, expect, it } from 'vitest';

import { sessionTankTotals } from '../session-tanks';

const row = (tankId: number, result: 'draw' | 'loss' | 'win') => ({ tankId, result, damageDealt: 1000, frags: 1, spotted: 2 });

describe('sessionTankTotals', () => {
  it('sums the battles of each tank into one totals row', () => {
    const totals = sessionTankTotals([row(1, 'win'), row(1, 'loss'), row(2, 'win')]);

    expect(totals).toContainEqual(expect.objectContaining({ tankId: 1, battles: 2, wins: 1, damageDealt: 2000, frags: 2, spotted: 4 }));
    expect(totals).toContainEqual(expect.objectContaining({ tankId: 2, battles: 1, wins: 1 }));
  });

  it('returns no rows for an empty session', () => {
    expect(sessionTankTotals([])).toEqual([]);
  });
});
