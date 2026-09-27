'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { listClans } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';

import { CLAN_RATING, CLAN_SORTS } from '../../../config';

export const useClanRating = () => {
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringLiteral(CLAN_SORTS).withDefault(CLAN_RATING.defaultSort).withOptions({ history: 'replace' })
  );

  const query = useInfiniteQuery({
    queryKey: QUERY_KEYS.clans.feed({ sort, limit: CLAN_RATING.pageSize }),
    queryFn: ({ signal, pageParam }) => listClans({ sort, limit: CLAN_RATING.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: ({ offset, limit, total }) => (offset + limit < total ? offset + limit : undefined),
    placeholderData: keepPreviousData
  });

  const { data: feed, fetchNextPage } = query;

  return {
    sort,
    setSort,
    query,
    items: feed?.pages.flatMap((page) => page.items) ?? [],
    total: feed?.pages[0]?.total ?? 0,
    loadMore: () => void fetchNextPage()
  };
};
