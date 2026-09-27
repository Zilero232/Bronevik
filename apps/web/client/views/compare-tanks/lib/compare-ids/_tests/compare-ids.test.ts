import { COMPARE } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { addCompareId, normalizeCompareIds, orderByIds, removeCompareId } from '../compare-ids';

const MANY = Array.from({ length: COMPARE.maxTanks + 3 }, (_, index) => (index + 1) * 10);

describe('normalizeCompareIds', () => {
  it('drops duplicates while keeping the first occurrence order', () => {
    expect(normalizeCompareIds([3, 1, 3, 2, 1])).toEqual([3, 1, 2]);
  });

  it('never keeps more tanks than the comparison allows', () => {
    expect(normalizeCompareIds(MANY)).toHaveLength(COMPARE.maxTanks);
  });

  it('keeps the earliest tanks when trimming to the limit', () => {
    expect(normalizeCompareIds(MANY)).toEqual(MANY.slice(0, COMPARE.maxTanks));
  });

  it('rejects zero, negative and fractional ids from a hand-edited URL', () => {
    expect(normalizeCompareIds([0, -5, 1.5, Number.NaN, 7])).toEqual([7]);
  });
});

describe('addCompareId', () => {
  it('appends a new tank at the end', () => {
    expect(addCompareId({ ids: [1, 2], id: 3 }).at(-1)).toBe(3);
  });

  it('ignores a tank that is already compared', () => {
    expect(addCompareId({ ids: [1, 2], id: 1 })).toEqual([1, 2]);
  });

  it('leaves a full comparison unchanged', () => {
    const full = MANY.slice(0, COMPARE.maxTanks);

    expect(addCompareId({ ids: full, id: 999 })).toEqual(full);
  });
});

describe('removeCompareId', () => {
  it('removes only the given tank', () => {
    expect(removeCompareId({ ids: [1, 2, 3], id: 2 })).toEqual([1, 3]);
  });

  it('is a no-op for a tank that is not compared', () => {
    expect(removeCompareId({ ids: [1, 2], id: 9 })).toEqual([1, 2]);
  });
});

describe('orderByIds', () => {
  const ITEMS = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('follows the order of the ids, not of the response', () => {
    expect(orderByIds({ items: ITEMS, ids: [3, 1, 2], idOf: ({ id }) => id }).map(({ id }) => id)).toEqual([3, 1, 2]);
  });

  it('skips ids the response did not return', () => {
    expect(orderByIds({ items: ITEMS, ids: [4, 2], idOf: ({ id }) => id }).map(({ id }) => id)).toEqual([2]);
  });
});
