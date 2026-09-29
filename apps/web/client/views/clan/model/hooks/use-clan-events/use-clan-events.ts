'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { listClanEvents } from '@/entities/clan/clan';
import { QUERY_KEYS } from '@/shared/constants';
import { nextPageOffset } from '@/shared/lib';

import { CLAN_EVENTS } from '../../../config';
import { groupEventsByDay } from '../../../lib/event-groups';

export const useClanEvents = (clanId: number) =>
  useInfiniteQuery({
    queryKey: QUERY_KEYS.clans.events({ clanId, limit: CLAN_EVENTS.pageSize }),
    queryFn: ({ signal, pageParam }) => listClanEvents({ clanId, limit: CLAN_EVENTS.pageSize, offset: pageParam, signal }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    select: ({ pages }) => {
      const events = pages.flatMap(({ items }) => items);

      return { days: groupEventsByDay(events), shown: events.length, total: pages[0]?.total ?? 0 };
    }
  });
