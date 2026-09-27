'use client';

import { useQueryStates } from 'nuqs';

import type { FeedDays, FeedFilter } from '../../../lib/feed-groups';

import { FEED_DAYS, FEED_FILTERS, FEED_PARSERS } from '../../../config';

export const useFeedFilters = () => {
  const [{ days, kind }, setFilters] = useQueryStates(FEED_PARSERS);

  return {
    days,
    kind,
    dayOptions: FEED_DAYS,
    kindOptions: FEED_FILTERS,
    onDaysChange: (next: FeedDays) => void setFilters({ days: next }),
    onKindChange: (next: FeedFilter) => void setFilters({ kind: next })
  };
};
