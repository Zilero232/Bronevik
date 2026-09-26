import type { InboxPage } from '@otmetki/schemas';

import type { ReadInboxPageInput } from './read-inbox-page.types';

export const readInboxPage = ({ page, ids, readAt }: ReadInboxPageInput): InboxPage => {
  const targets = ids && new Set(ids);
  const isTarget = (item: InboxPage['items'][number]) => item.readAt === null && (!targets || targets.has(item.id));
  const newlyRead = page.items.filter(isTarget).length;

  return {
    items: page.items.map((item) => (isTarget(item) ? { ...item, readAt } : item)),
    unread: targets ? Math.max(0, page.unread - newlyRead) : 0
  };
};
