import { describe, expect, it } from 'vitest';

import { commonTankIds } from '../common-tanks';

describe('commonTankIds', () => {
  it('keeps only the tanks every compared account has played', () => {
    const tanks = [
      { accountId: 1n, tankId: 10 },
      { accountId: 2n, tankId: 10 },
      { accountId: 1n, tankId: 20 },
      { accountId: 2n, tankId: 30 }
    ];

    expect(commonTankIds({ tanks, accountCount: 2 })).toEqual([10]);
  });

  it('counts an account once however many rows it has for a tank', () => {
    const tanks = [
      { accountId: 1n, tankId: 10 },
      { accountId: 1n, tankId: 10 }
    ];

    expect(commonTankIds({ tanks, accountCount: 2 })).toEqual([]);
  });
});
