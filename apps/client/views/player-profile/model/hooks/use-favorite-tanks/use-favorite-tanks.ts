'use client';

import { OVERVIEW } from '../../../config';
import { favoriteTanks } from '../../../lib/favorite-tanks';
import { usePlayerTanks } from '../use-profile-queries';

export const useFavoriteTanks = () => {
  const query = usePlayerTanks();

  return {
    query,
    rows: favoriteTanks({ rows: query.data?.items ?? [], count: OVERVIEW.favoriteCount })
  };
};
