'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { partition } from 'remeda';

import { playersControllerAchievementsOptions } from '@/shared/api/query-options';
import { localizedText } from '@/shared/lib';

import { ACHIEVEMENTS } from '../../../config';
import { achievementSections } from '../../../lib/achievement-sections';
import { useProfileContext } from '../../context';

export const usePlayerAchievements = () => {
  const locale = useLocale();
  const { accountId } = useProfileContext();

  return useQuery({
    ...playersControllerAchievementsOptions({ path: { idOrNick: String(accountId) } }),
    select: ({ items }) => {
      const localized = items.map((item) => ({
        ...item,
        title: localizedText({ locale, text: item.title, english: item.titleEn }),
        description: localizedText({ locale, text: item.description, english: item.descriptionEn })
      }));

      const [featured, rest] = partition(achievementSections(localized), ({ section }) => section === ACHIEVEMENTS.featuredSection);

      return [...featured.map((section) => ({ ...section, isFeatured: true })), ...rest.map((section) => ({ ...section, isFeatured: false }))];
    }
  });
};
