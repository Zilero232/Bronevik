import { chunk, mergeAll, unique } from 'remeda';

import type { BatchByIdInput, BatchListInput, ChunkIdsInput, LestaId } from './batching.types';

import { LESTA_API } from '../client/client.constants';

export const chunkIds = <Id extends LestaId>({ ids, size = LESTA_API.batchSize }: ChunkIdsInput<Id>): Id[][] => {
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
