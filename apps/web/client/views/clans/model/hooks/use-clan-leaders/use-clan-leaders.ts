'use client';

import { CLAN_RATING } from '../../../config';
import { useClanRating } from '../use-clan-rating';

export const useClanLeaders = () => {
  const {
    items,
    query: { isPending, isError, isRefetching, refetch }
  } = useClanRating();

  const leaders = items.slice(0, CLAN_RATING.leaders);

  return {
    isShown: isPending || isError || leaders.length > 0,
    query: { data: isPending || (isError && leaders.length === 0) ? undefined : leaders, isError, isRefetching, refetch }
  };
};
