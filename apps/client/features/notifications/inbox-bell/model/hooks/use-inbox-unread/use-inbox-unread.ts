'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { inboxQueries } from '@/entities/notification/inbox';

import { INBOX_BELL } from '../../../config';

export const useInboxUnread = () => {
  const { data: session } = useAuthSession();

  const isSignedIn = Boolean(session);

  const { data: unread = 0 } = useQuery({
    ...inboxQueries.preview({ limit: INBOX_BELL.previewLimit }),
    enabled: isSignedIn,
    refetchInterval: INBOX_BELL.pollMs,
    select: (page) => page.unread
  });

  return { isSignedIn, unread };
};
