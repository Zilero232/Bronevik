import type { InboxQuery } from '@bronevik/schemas';

export type InboxPageInput = Partial<InboxQuery> & {
  signal?: AbortSignal;
};
