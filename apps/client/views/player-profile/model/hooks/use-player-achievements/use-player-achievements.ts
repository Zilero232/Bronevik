'use client';

import { useQuery } from '@tanstack/react-query';
import { partition } from 'remeda';

import { playersControllerAchievementsOptions } from '@/shared/api/query-options';

import { ACHIEVEMENTS } from '../../../config';
import { achievementSections } from '../../../lib/achievement-sections';
import { useProfileContext } from '../../context';

export const usePlayerAchievements = () => {
  const { accountId } = useProfileContext();
  const { data, isPending, isError, isRefetching, refetch } = useQuery(
    playersControllerAchievementsOptions({ path: { idOrNick: String(accountId) } })
  );

  const [featured, rest] = partition(achievementSections(data?.items ?? []), ({ section }) => section === ACHIEVEMENTS.featuredSection);

  return {
    sections: [...featured.map((section) => ({ ...section, isFeatured: true })), ...rest.map((section) => ({ ...section, isFeatured: false }))],
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
