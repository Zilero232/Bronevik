'use client';

import { useState } from 'react';

import type { InboxFeedFilter } from '../notifications.types';

import { groupInboxByDay } from '../../lib/group-by-day';
import { useInboxFeedQuery } from './use-inbox-feed-query';

export const useInboxFeed = () => {
  const { data, isPending, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInboxFeedQuery();
  const [filter, setFilter] = useState<InboxFeedFilter>('all');

  const pages = data?.pages ?? [];
  const loaded = pages.flatMap(({ items }) => items);
  const items = filter === 'unread' ? loaded.filter(({ readAt }) => readAt === null) : loaded;

  return {
    filter,
    days: groupInboxByDay(items),
    unread: pages[0]?.unread ?? 0,
    isEmpty: items.length === 0,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    setFilter,
    loadMore: () => fetchNextPage()
  };
};
