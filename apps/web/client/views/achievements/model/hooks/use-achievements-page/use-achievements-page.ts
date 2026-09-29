'use client';

import { useQuery } from '@tanstack/react-query';

import { achievementsRarityControllerListOptions } from '@/shared/api/query-options';

import type { AchievementsTab } from '../../achievements.types';

import { ACHIEVEMENTS } from '../../../config';
import { useAchievementsParams } from '../use-achievements-params';

export const useAchievementsPage = () => {
  const [{ tab }, setParams] = useAchievementsParams();
  const { data } = useQuery({ ...achievementsRarityControllerListOptions(), staleTime: ACHIEVEMENTS.staleMs });

  return {
    tab,
    catalog: data && data.sample > 0 && data.catalogSize > 0 ? data : null,
    onTabChange: (next: AchievementsTab) => void setParams({ tab: next })
  };
};
