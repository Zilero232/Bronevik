'use client';

import { useQuery } from '@tanstack/react-query';
import { partition } from 'remeda';

import { playersControllerAchievementsOptions } from '@/shared/api/query-options';

import { ACHIEVEMENTS } from '../../../config';
import { achievementSections } from '../../../lib/achievement-sections';
import { useProfileContext } from '../../context';

export const usePlayerAchievements = () => {
  const { accountId } = useProfileContext();

  return useQuery({
    ...playersControllerAchievementsOptions({ path: { idOrNick: String(accountId) } }),
    select: ({ items }) => {
      const [featured, rest] = partition(achievementSections(items), ({ section }) => section === ACHIEVEMENTS.featuredSection);

      return [...featured.map((section) => ({ ...section, isFeatured: true })), ...rest.map((section) => ({ ...section, isFeatured: false }))];
    }
  });
};
