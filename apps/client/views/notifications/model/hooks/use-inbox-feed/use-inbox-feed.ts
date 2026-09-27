'use client';

import { groupInboxByDay } from '../../../lib/group-by-day';
import { useInboxFeedQuery } from '../use-inbox-feed-query';
import { useInboxFilter } from '../use-inbox-filter';

export const useInboxFeed = () => {
  const { data, isError, isFetching, refetch } = useInboxFeedQuery();
  const { filter } = useInboxFilter();

  const loaded = data?.pages.flatMap(({ items }) => items) ?? [];
  const items = filter === 'unread' ? loaded.filter(({ readAt }) => readAt === null) : loaded;

  return {
    filter,
    query: { data: data && groupInboxByDay(items), isError, isRefetching: isFetching, refetch }
  };
};
