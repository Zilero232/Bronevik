'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { inboxQueries } from '@/entities/notification/inbox';

import { INBOX_FEED } from '../../../config';

export const useInboxFeedQuery = () => useInfiniteQuery(inboxQueries.feed({ pageSize: INBOX_FEED.pageSize }));
