'use client';

import { useMarkInboxRead } from '@/entities/notification/inbox';

import { useInboxPreview } from '../use-inbox-preview';

export const useInboxPanel = () => {
  const { page } = useInboxPreview();
  const markRead = useMarkInboxRead();

  return { unread: page?.unread ?? 0, onMarkAll: () => markRead.mutate({}) };
};
