'use client';

import { groupInboxByDay } from '../../../lib/group-by-day';
import { useInboxFeedQuery } from '../use-inbox-feed-query';
import { useInboxFilter } from '../use-inbox-filter';

export const useInboxFeed = () => {
  const { data, isPending, isError, isFetching, refetch } = useInboxFeedQuery();
  const { filter } = useInboxFilter();

  const loaded = data?.pages.flatMap(({ items }) => items) ?? [];
  const items = filter === 'unread' ? loaded.filter(({ readAt }) => readAt === null) : loaded;

  return {
    filter,
    days: groupInboxByDay(items),
    isEmpty: items.length === 0,
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    onRetry: () => void refetch()
  };
};
