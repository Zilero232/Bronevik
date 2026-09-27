'use client';

import type { InboxItem } from '@otmetki/schemas';

import { useReadInboxItem } from '@/entities/notification/inbox';

import { useInboxPanelContext } from '../../context';
import { useInboxPreview } from '../use-inbox-preview';

export const useInboxPanelList = () => {
  const { page, isPending, isError, isRetrying, retry } = useInboxPreview();
  const readItem = useReadInboxItem();
  const { close } = useInboxPanelContext();

  const onSelect = (item: InboxItem) => {
    readItem(item);

    if (item.url) {
      close();
    }
  };

  return { items: page?.items ?? [], isPending, isError, isRetrying, onRetry: retry, onSelect };
};
