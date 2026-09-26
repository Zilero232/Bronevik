'use client';

import { range } from 'remeda';

import { NOTIFICATIONS_HERO } from '../../../config';
import { useInboxFeedQuery } from '../use-inbox-feed-query';

export const useNotificationsHero = () => {
  const { data, isError } = useInboxFeedQuery();

  const unread = data?.pages[0]?.unread;

  return {
    unread,
    isLive: (unread ?? 0) > 0,
    isError,
    bars: range(0, NOTIFICATIONS_HERO.signalBars)
  };
};
