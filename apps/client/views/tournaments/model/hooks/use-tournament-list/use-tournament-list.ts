'use client';

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { listTournaments } from '@/shared/api/tournaments';
import { QUERY_KEYS } from '@/shared/constants';
import { nextPageOffset } from '@/shared/lib';

import { TOURNAMENT_FILTERS, TOURNAMENT_LIST } from '../../../config';

export const useTournamentList = () => {
  const [filter, setFilter] = useQueryState(
    'status',
    parseAsStringLiteral(TOURNAMENT_FILTERS).withDefault(TOURNAMENT_LIST.defaultFilter).withOptions({ history: 'replace' })
  );

  const status = filter === 'all' ? undefined : filter;
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.tournaments.list({ status, limit: TOURNAMENT_LIST.pageSize }),
    queryFn: ({ signal, pageParam }) => listTournaments({ status, limit: TOURNAMENT_LIST.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    placeholderData: keepPreviousData
  });

  return {
    filter,
    items: data?.pages.flatMap((page) => page.items) ?? [],
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    onFilterChange: (next: (typeof TOURNAMENT_FILTERS)[number]) => void setFilter(next),
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
