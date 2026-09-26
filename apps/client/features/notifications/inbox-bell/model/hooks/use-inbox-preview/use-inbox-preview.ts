'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { INBOX_QUERY } from '@/entities/notification/inbox';
import { getInbox } from '@/entities/notification/inbox';

import { INBOX_BELL } from '../../../config';

export const useInboxPreview = () => {
  const { data: session } = useAuthSession();

  const isSignedIn = Boolean(session);

  const {
    data: page,
    isPending,
    isError,
    isFetching,
    refetch
  } = useQuery({
    queryKey: INBOX_QUERY.preview,
    queryFn: ({ signal }) => getInbox({ limit: INBOX_BELL.previewLimit, signal }),
    enabled: isSignedIn,
    refetchInterval: INBOX_BELL.pollMs
  });

  return { isSignedIn, page, isPending, isError: isError && !page, isRetrying: isFetching, retry: () => refetch() };
};
