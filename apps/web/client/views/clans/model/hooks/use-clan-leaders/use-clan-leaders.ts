'use client';

import { CLAN_RATING } from '../../../config';
import { useClanRating } from '../use-clan-rating';

export const useClanLeaders = () => {
  const {
    items,
    query: { isPending }
  } = useClanRating();

  return { leaders: items.slice(0, CLAN_RATING.leaders), isLoading: isPending };
};
