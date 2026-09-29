import { describe, expect, it } from 'vitest';

import { readPinnedIds, togglePinnedId } from '../pinned-ids';

describe('readPinnedIds', () => {
  it('falls back to nothing pinned for a missing or broken value', () => {
    expect(readPinnedIds(undefined)).toEqual([]);
    expect(readPinnedIds('{"a":1}')).toEqual([]);
    expect(readPinnedIds([1, 2])).toEqual([]);
  });

  it('drops duplicates a second tab may have written', () => {
    expect(readPinnedIds(['1', '2', '1'])).toEqual(['1', '2']);
  });
});

describe('togglePinnedId', () => {
  it('pins a new id in front', () => {
    expect(togglePinnedId({ ids: ['1'], id: '2', limit: 5 })).toEqual(['2', '1']);
  });

  it('unpins an id that is already pinned', () => {
    expect(togglePinnedId({ ids: ['1', '2'], id: '1', limit: 5 })).toEqual(['2']);
  });

  it('forgets the oldest pin past the limit', () => {
    expect(togglePinnedId({ ids: ['2', '1'], id: '3', limit: 2 })).toEqual(['3', '2']);
  });
});
