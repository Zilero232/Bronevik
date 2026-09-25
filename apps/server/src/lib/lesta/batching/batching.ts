import { chunk, mergeAll, unique } from 'remeda';

import type { BatchByIdInput, BatchListInput, ChunkIdsInput, LestaId } from './batching.types';

export const LESTA_BATCH_SIZE = 100;

export const chunkIds = <Id extends LestaId>({ ids, size = LESTA_BATCH_SIZE }: ChunkIdsInput<Id>): Id[][] => {
  if (ids.length === 0) {
    return [];
  }

  return chunk(unique([...ids]), size);
};

export const batchById = async <Id extends LestaId, T>({ ids, size, run }: BatchByIdInput<Id, T>): Promise<Record<string, T>> => {
  const results = await Promise.all(chunkIds({ ids, size }).map((part) => run(part)));

  return mergeAll(results);
};

export const batchList = async <Item extends LestaId, T>({ items, size, run }: BatchListInput<Item, T>): Promise<T[]> => {
  const results = await Promise.all(chunkIds({ ids: items, size }).map((part) => run(part)));

  return results.flat();
};
