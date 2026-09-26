'use client';

import { OVERVIEW } from '../../../config';
import { favoriteTanks } from '../../../lib/favorite-tanks';
import { usePlayerTanks } from '../use-profile-queries';

export const useFavoriteTanks = () => {
  const { data: tanks, isPending, isError, isRefetching, refetch } = usePlayerTanks();

  return {
    rows: favoriteTanks({ rows: tanks?.items ?? [], count: OVERVIEW.favoriteCount }),
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
