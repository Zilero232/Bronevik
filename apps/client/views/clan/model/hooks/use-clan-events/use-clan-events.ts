'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { listClanEvents } from '@/shared/api/clans';
import { QUERY_KEYS } from '@/shared/constants';

import { CLAN_EVENTS } from '../../../config';
import { groupEventsByDay } from '../../../lib/event-groups';

export const useClanEvents = (clanId: number) => {
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: QUERY_KEYS.clans.events({ clanId, limit: CLAN_EVENTS.pageSize }),
    queryFn: ({ signal, pageParam }) => listClanEvents({ clanId, limit: CLAN_EVENTS.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: ({ offset, limit, total }) => (offset + limit < total ? offset + limit : undefined)
  });

  const events = data?.pages.flatMap(({ items }) => items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    days: groupEventsByDay(events),
    shown: events.length,
    total,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    loadMore: () => fetchNextPage(),
    retry: () => refetch()
  };
};
