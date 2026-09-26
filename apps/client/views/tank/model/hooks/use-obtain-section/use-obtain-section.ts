'use client';

import { safeWebHref } from '@/shared/lib';

import { useTank } from '../../context';

export const useObtainSection = () => {
  const { detail } = useTank();

  const { obtain } = detail;

  return {
    obtain,
    offers: obtain.offers.items.map((offer) => ({
      key: `${offer.title}-${offer.lastSeenAt}`,
      title: offer.title,
      href: safeWebHref(offer.url),
      date: offer.startsAt ?? offer.lastSeenAt
    })),
    news: obtain.news.map((item) => ({ key: item.url, title: item.title, href: safeWebHref(item.url), date: item.publishedAt }))
  };
};
