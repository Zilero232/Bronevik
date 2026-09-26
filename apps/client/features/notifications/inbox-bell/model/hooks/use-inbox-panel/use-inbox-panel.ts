'use client';

import type { InboxItem } from '@otmetki/schemas';

import { useMarkInboxRead } from '@/entities/notification/inbox';

import type { UseInboxPanelInput } from './use-inbox-panel.types';

export const useInboxPanel = ({ page, onClose }: UseInboxPanelInput) => {
  const markRead = useMarkInboxRead();

  const onSelect = ({ id, url, readAt }: InboxItem) => {
    if (readAt === null) {
      markRead.mutate({ ids: [id] });
    }

    if (url) {
      onClose();
    }
  };

  return { unread: page?.unread ?? 0, items: page?.items ?? [], onSelect, onMarkAll: () => markRead.mutate({}) };
};
