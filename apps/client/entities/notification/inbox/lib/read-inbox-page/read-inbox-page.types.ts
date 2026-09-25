import type { InboxPage } from '@bronevik/schemas';

export type ReadInboxPageInput = {
  page: InboxPage;
  ids?: string[];
  readAt: string;
};
