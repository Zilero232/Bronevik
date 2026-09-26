'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getInbox, INBOX_QUERY } from '@/entities/notification/inbox';

import { INBOX_FEED } from '../../../config';

export const useInboxFeedQuery = () =>
  useInfiniteQuery({
    queryKey: INBOX_QUERY.feed,
    queryFn: ({ pageParam, signal }) => getInbox({ limit: INBOX_FEED.pageSize, before: pageParam || undefined, signal }),
    initialPageParam: '',
    getNextPageParam: ({ items }) => (items.length < INBOX_FEED.pageSize ? undefined : items.at(-1)?.createdAt)
  });
