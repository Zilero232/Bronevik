import type { QueryKey } from '@tanstack/react-query';

import type { useOffsetInfiniteList } from './use-offset-infinite-list';

type OffsetListPage<TItem> = {
  items: TItem[];
  total: number;
  offset: number;
};

export type OffsetListFetchInput = {
  offset: number;
  signal: AbortSignal;
};

export type UseOffsetInfiniteListInput<TItem> = {
  queryKey: QueryKey;
  queryFn: (input: OffsetListFetchInput) => Promise<OffsetListPage<TItem>>;
  isKeepingPrevious?: boolean;
};

export type OffsetInfiniteList<TItem> = ReturnType<typeof useOffsetInfiniteList<TItem>>;
