import { describe, expect, it } from 'vitest';

import { shortList } from '../short-list';

describe('shortList', () => {
  it('joins everything that fits', () => {
    expect(shortList({ items: ['a', 'b'], max: 2 })).toBe('a, b');
  });

  it('counts what did not fit', () => {
    expect(shortList({ items: ['a', 'b', 'c', 'd'], max: 2 })).toBe('a, b +2');
  });

  it('is empty for no items', () => {
    expect(shortList({ items: [], max: 2 })).toBe('');
  });
});
