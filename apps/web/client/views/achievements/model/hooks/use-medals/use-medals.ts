'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { achievementsRarityControllerListOptions } from '@/shared/api/query-options';

import { ACHIEVEMENT_SECTIONS, ACHIEVEMENTS } from '../../../config';
import { useAchievementsParams } from '../use-achievements-params';

export const useMedals = () => {
  const t = useTranslations('achievements.medals');
  const [{ section, sort }, setParams] = useAchievementsParams();
  const query = useQuery({
    ...achievementsRarityControllerListOptions({ query: { section: section ?? undefined, sort } }),
    staleTime: ACHIEVEMENTS.staleMs,
    placeholderData: keepPreviousData
  });

  return {
    query,
    section: section ?? ACHIEVEMENTS.anySection,
    sort,
    sections: [
      { value: ACHIEVEMENTS.anySection, label: t('anySection') },
      ...(query.data?.sections ?? []).map((value) => {
        const known = ACHIEVEMENT_SECTIONS.find((key) => key === value);

        return { value, label: known ? t(`sections.${known}`) : value };
      })
    ],
    onSectionChange: (next: string) => void setParams({ section: next === ACHIEVEMENTS.anySection ? null : next }),
    onSortChange: (next: typeof sort) => void setParams({ sort: next })
  };
};
