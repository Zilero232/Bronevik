import type { QueryKey } from '@tanstack/react-query';

export type OffsetListPage<TItem> = {
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
