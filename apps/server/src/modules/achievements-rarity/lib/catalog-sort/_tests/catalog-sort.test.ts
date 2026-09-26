import { describe, expect, it } from 'vitest';

import { byRarity, sortCatalog } from '../catalog-sort';

const items = [
  { name: 'common', share: 0.8, points: 11, order: 2 },
  { name: 'unknown', share: null, points: null, order: null },
  { name: 'rare', share: 0.01, points: 100, order: 3 },
  { name: 'first', share: 0.3, points: 18, order: 1 }
];

const names = (list: readonly { name: string }[]) => list.map((item) => item.name);

describe('sortCatalog', () => {
  it('puts the rarest first and medals without data last', () => {
    expect(names(sortCatalog({ items, sort: 'rarity' }))).toEqual(['rare', 'first', 'common', 'unknown']);
  });

  it('reverses the rarity order for the most common', () => {
    expect(names(sortCatalog({ items, sort: 'common' }))).toEqual(['common', 'first', 'rare', 'unknown']);
  });

  it('agrees with rarity when sorting by points', () => {
    expect(names(sortCatalog({ items, sort: 'points' })).slice(0, 3)).toEqual(names(byRarity(items)).slice(0, 3));
  });

  it('keeps the game order', () => {
    expect(names(sortCatalog({ items, sort: 'order' }))).toEqual(['first', 'common', 'rare', 'unknown']);
  });
});
