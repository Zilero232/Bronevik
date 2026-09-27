import type { InboxQuery } from '@otmetki/schemas';

export type InboxPageInput = Partial<InboxQuery> & {
  signal?: AbortSignal;
};
