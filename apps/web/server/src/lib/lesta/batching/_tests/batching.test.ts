import { describe, expect, it } from 'vitest';

import { LESTA_API } from '../../client/client.constants';
import { batchById, batchList, chunkIds } from '../batching';

describe('chunkIds', () => {
  it('splits into chunks no larger than the Lesta limit', () => {
    const ids = Array.from({ length: LESTA_API.batchSize * 2 + 1 }, (_, index) => index);
    const chunks = chunkIds({ ids });

    expect(chunks.map((part) => part.length)).toEqual([LESTA_API.batchSize, LESTA_API.batchSize, 1]);
    expect(chunks.flat()).toEqual(ids);
  });

  it('removes duplicates and returns nothing for an empty list', () => {
    expect(chunkIds({ ids: [3, 3, 4] })).toEqual([[3, 4]]);
    expect(chunkIds({ ids: [] })).toEqual([]);
  });
});

describe('batchById and batchList', () => {
  it('merges per-chunk maps', async () => {
    const result = await batchById({
      ids: [1, 2, 3, 4, 5],
      size: 2,
      run: async (part) => Object.fromEntries(part.map((id) => [String(id), id * 10]))
    });

    expect(result).toEqual({ 1: 10, 2: 20, 3: 30, 4: 40, 5: 50 });
  });

  it('concatenates per-chunk lists in order', async () => {
    const result = await batchList({ items: ['a', 'b', 'c'], size: 2, run: async (part) => part.map((item) => item.toUpperCase()) });

    expect(result).toEqual(['A', 'B', 'C']);
  });
});
