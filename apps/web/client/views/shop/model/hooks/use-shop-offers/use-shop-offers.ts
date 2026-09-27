'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { shopControllerListOffersInfiniteOptions } from '@/shared/api/query-options';
import { nextPageOffset, safeWebHref } from '@/shared/lib';

import type { OfferEntry, UseShopOffersInput } from './use-shop-offers.types';

import { SHOP } from '../../../config';

export const useShopOffers = ({ isActiveOnly }: UseShopOffersInput) => {
  const { data: catalog } = useVehicleCatalog();
  const query = useInfiniteQuery({
    ...shopControllerListOffersInfiniteOptions({ query: { limit: SHOP.pageSize, ...(isActiveOnly ? { active: true } : {}) } }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    staleTime: SHOP.staleMs
  });

  const { data: feed, dataUpdatedAt, fetchNextPage } = query;
  const offers: OfferEntry[] = (feed?.pages.flatMap(({ items }) => items) ?? []).map((offer) => ({
    offer,
    href: safeWebHref(offer.url),
    vehicles: pickVehicles({ tankIds: offer.tankIds, catalog }),
    isRunning: offer.endsAt === null || new Date(offer.endsAt).getTime() > dataUpdatedAt
  }));

  return {
    offers,
    total: feed?.pages[0]?.total ?? 0,
    query,
    loadMore: () => void fetchNextPage()
  };
};
