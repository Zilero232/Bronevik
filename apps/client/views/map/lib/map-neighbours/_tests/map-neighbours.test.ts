import { describe, expect, it } from 'vitest';

import { mapNeighbours } from '../map-neighbours';

const ITEMS = ['karelia', 'malinovka', 'prohorovka', 'ensk'];

describe('mapNeighbours', () => {
  it('points to the maps on both sides', () => {
    expect(mapNeighbours({ items: ITEMS, index: 1 })).toEqual({ prev: ITEMS[0], next: ITEMS[2] });
  });

  it('wraps from the first map to the last one', () => {
    expect(mapNeighbours({ items: ITEMS, index: 0 }).prev).toBe(ITEMS.at(-1));
  });

  it('wraps from the last map to the first one', () => {
    expect(mapNeighbours({ items: ITEMS, index: ITEMS.length - 1 }).next).toBe(ITEMS[0]);
  });

  it('offers no navigation for a map missing from the list', () => {
    expect(mapNeighbours({ items: ITEMS, index: -1 })).toEqual({ prev: null, next: null });
  });

  it('offers no navigation when there is only one map', () => {
    expect(mapNeighbours({ items: ['karelia'], index: 0 })).toEqual({ prev: null, next: null });
  });
});
