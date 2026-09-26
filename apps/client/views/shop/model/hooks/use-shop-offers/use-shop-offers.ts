'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { pickVehicles } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { shopControllerListOffersInfiniteOptions } from '@/shared/api/query-options';
import { nextPageOffset } from '@/shared/lib';

import type { OfferEntry, UseShopOffersInput } from './use-shop-offers.types';

import { SHOP } from '../../../config';

export const useShopOffers = ({ isActiveOnly }: UseShopOffersInput) => {
  const { data: catalog } = useVehicleCatalog();
  const { data, dataUpdatedAt, isPending, isError, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    ...shopControllerListOffersInfiniteOptions({ query: { limit: SHOP.pageSize, ...(isActiveOnly ? { active: true } : {}) } }),
    initialPageParam: 0,
    getNextPageParam: nextPageOffset,
    staleTime: SHOP.staleMs
  });

  const offers: OfferEntry[] = (data?.pages.flatMap(({ items }) => items) ?? []).map((offer) => ({
    offer,
    vehicles: pickVehicles({ tankIds: offer.tankIds, catalog }),
    isRunning: offer.endsAt === null || new Date(offer.endsAt).getTime() > dataUpdatedAt
  }));

  return {
    offers,
    total: data?.pages[0]?.total ?? 0,
    isPending,
    isError,
    isRetrying: isFetching,
    hasNextPage,
    isFetchingNextPage,
    loadMore: () => void fetchNextPage(),
    retry: () => void refetch()
  };
};
