import type { InboxPage } from '@bronevik/schemas';

import type { ReadInboxPageInput } from './read-inbox-page.types';

export const readInboxPage = ({ page, ids, readAt }: ReadInboxPageInput): InboxPage => {
  const targets = ids && new Set(ids);

  return {
    items: page.items.map((item) => (item.readAt === null && (!targets || targets.has(item.id)) ? { ...item, readAt } : item)),
    unread: targets ? Math.max(0, page.unread - targets.size) : 0
  };
};
