import type { InboxPage } from '@otmetki/schemas';

export type ReadInboxPageInput = {
  page: InboxPage;
  ids?: string[];
  readAt: string;
};
