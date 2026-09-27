'use client';

import { useMarkInboxRead } from '@/entities/notification/inbox';

import { useInboxFeedQuery } from '../use-inbox-feed-query';
import { useInboxFilter } from '../use-inbox-filter';

export const useInboxFeedHeader = () => {
  const { data } = useInboxFeedQuery();
  const { filter, setFilter } = useInboxFilter();
  const markRead = useMarkInboxRead();

  return {
    filter,
    setFilter,
    unread: data?.pages[0]?.unread ?? 0,
    onMarkAll: () => markRead.mutate({})
  };
};
