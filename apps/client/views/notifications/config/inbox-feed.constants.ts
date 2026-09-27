import { parseAsStringLiteral } from 'nuqs';

export const INBOX_FEED = {
  pageSize: 20,
  filters: ['all', 'unread'],
  skeletonRows: 5
} as const;

export const INBOX_FEED_PARAMS = {
  filter: parseAsStringLiteral(INBOX_FEED.filters).withDefault('all')
} as const;
