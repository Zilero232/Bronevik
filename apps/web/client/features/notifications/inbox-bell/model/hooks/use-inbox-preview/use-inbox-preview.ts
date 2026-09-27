'use client';

import { useQuery } from '@tanstack/react-query';

import { inboxQueries } from '@/entities/notification/inbox';

import { INBOX_BELL } from '../../../config';

export const useInboxPreview = () => {
  const { data: page, isPending, isError, isFetching, refetch } = useQuery(inboxQueries.preview({ limit: INBOX_BELL.previewLimit }));

  return { page, isPending, isError: isError && !page, isRetrying: isFetching, retry: () => void refetch() };
};
