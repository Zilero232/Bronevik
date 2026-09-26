'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { shopControllerListNewsInfiniteOptions } from '@/shared/api/query-options';
import { nextPageOffset, safeWebHref } from '@/shared/lib';

import type { NewsEntry, NewsFilter } from './use-news-feed.types';

import { NEWS } from '../../../config';

export const useNewsFeed = () => {
  const [kind, setKind] = useQueryState('kind', parseAsStringLiteral(NEWS.filters).withDefault('all').withOptions({ history: 'replace' }));
  const { data: catalog } = useVehicleCatalog();
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    ...shopControllerListNewsInfiniteOptions({ query: { limit: NEWS.pageSize, ...(kind === 'all' ? {} : { kind }) } }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    staleTime: NEWS.staleMs
  });

  const entries: NewsEntry[] = (data?.pages.flatMap(({ items }) => items) ?? []).map((item) => ({
    item,
    href: safeWebHref(item.url),
    vehicles: pickVehicles({ tankIds: item.tankIds, catalog })
  }));

  return {
    kind,
    entries,
    total: data?.pages[0]?.total ?? 0,
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    setKind: (next: NewsFilter) => void setKind(next),
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
