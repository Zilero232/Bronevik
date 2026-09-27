'use client';

import type { InboxItem } from '@otmetki/schemas';

import { useMarkInboxRead } from '../use-mark-inbox-read';

export const useReadInboxItem = () => {
  const markRead = useMarkInboxRead();

  return ({ id, readAt }: InboxItem) => {
    if (readAt === null) {
      markRead.mutate({ ids: [id] });
    }
  };
};
