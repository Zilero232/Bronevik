'use client';

import { useQuery } from '@tanstack/react-query';

import { achievementsRarityControllerLeaderboardOptions } from '@/shared/api/query-options';

import { ACHIEVEMENTS } from '../../../config';

export const useCollectors = () =>
  useQuery({
    ...achievementsRarityControllerLeaderboardOptions({ query: { limit: ACHIEVEMENTS.collectorsLimit } }),
    staleTime: ACHIEVEMENTS.staleMs
  });
