'use client';

import { useQuery } from '@tanstack/react-query';

import { playersControllerAchievementsOptions } from '@/shared/api/query-options';

import { achievementSections } from '../../../lib/achievement-sections';
import { useProfileContext } from '../../context';

export const usePlayerAchievements = () => {
  const { accountId } = useProfileContext();
  const { data, isPending, isError, isRefetching, refetch } = useQuery(
    playersControllerAchievementsOptions({ path: { idOrNick: String(accountId) } })
  );

  return {
    sections: achievementSections(data?.items ?? []),
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
