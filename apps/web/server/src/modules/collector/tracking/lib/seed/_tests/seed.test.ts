import { describe, expect, it } from 'vitest';

import { collectIds } from '../seed';

describe('collectIds', () => {
  it('reads ids from a list of rating rows', () => {
    expect(collectIds({ value: [{ account_id: 1, rank: 1 }, { account_id: 2 }], key: 'account_id' })).toEqual([1, 2]);
  });

  it('reads ids from a map keyed by rating type', () => {
    expect(collectIds({ value: { all: [{ account_id: 3 }], 7: [{ account_id: 3 }, { account_id: 4 }] }, key: 'account_id' }).sort()).toEqual([3, 4]);
  });

  it('ignores values that are not positive integers', () => {
    expect(collectIds({ value: [{ account_id: '5' }, { account_id: -1 }, { account_id: 1.5 }], key: 'account_id' })).toEqual([]);
  });
});
