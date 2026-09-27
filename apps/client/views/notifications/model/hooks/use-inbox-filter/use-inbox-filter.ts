'use client';

import { useQueryStates } from 'nuqs';

import type { InboxFeedFilter } from '../../notifications.types';

import { INBOX_FEED_PARAMS } from '../../../config';

export const useInboxFilter = () => {
  const [{ filter }, setParams] = useQueryStates(INBOX_FEED_PARAMS, { history: 'replace' });

  return { filter, setFilter: (next: InboxFeedFilter) => void setParams({ filter: next }) };
};
