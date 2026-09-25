import { QUERY_KEYS } from '@/shared/constants';

export const INBOX_QUERY = {
  all: QUERY_KEYS.me.inbox({}),
  preview: QUERY_KEYS.me.inbox({ scope: 'preview' }),
  feed: QUERY_KEYS.me.inbox({ scope: 'feed' })
} as const;
