'use client';

import type { InboxItem } from '@bronevik/schemas';

import { useState } from 'react';

import { useMarkInboxRead } from '@/entities/notification/inbox';

import type { InboxFeedFilter } from '../../notifications.types';

import { groupInboxByDay } from '../../../lib/group-by-day';
import { useInboxFeedQuery } from '../use-inbox-feed-query';

export const useInboxFeed = () => {
  const { data, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInboxFeedQuery();
  const markRead = useMarkInboxRead();
  const [filter, setFilter] = useState<InboxFeedFilter>('all');

  const pages = data?.pages ?? [];
  const loaded = pages.flatMap(({ items }) => items);
  const items = filter === 'unread' ? loaded.filter(({ readAt }) => readAt === null) : loaded;

  const onSelect = ({ id, readAt }: InboxItem) => {
    if (readAt === null) {
      markRead.mutate({ ids: [id] });
    }
  };

  return {
    filter,
    days: groupInboxByDay(items),
    unread: pages[0]?.unread ?? 0,
    isEmpty: items.length === 0,
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    setFilter,
    onSelect,
    onMarkAll: () => markRead.mutate({}),
    onRetry: () => void refetch(),
    onLoadMore: () => void fetchNextPage()
  };
};
