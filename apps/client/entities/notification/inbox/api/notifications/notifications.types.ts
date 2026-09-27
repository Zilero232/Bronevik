import type { InboxQuery } from '@otmetki/schemas';

export type InboxPageInput = Partial<InboxQuery> & {
  signal?: AbortSignal;
};

export type InboxPreviewQueryInput = {
  limit: number;
};

export type InboxFeedQueryInput = {
  pageSize: number;
};
