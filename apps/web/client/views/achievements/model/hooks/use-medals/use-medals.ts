'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';

import { achievementsRarityControllerListOptions } from '@/shared/api/query-options';
import { localizedText } from '@/shared/lib';

import { ACHIEVEMENT_SECTIONS, ACHIEVEMENTS } from '../../../config';
import { useAchievementsParams } from '../use-achievements-params';

export const useMedals = () => {
  const t = useTranslations('achievements.medals');
  const locale = useLocale();
  const [{ section, sort }, setParams] = useAchievementsParams();
  const query = useQuery({
    ...achievementsRarityControllerListOptions({ query: { section: section ?? undefined, sort } }),
    staleTime: ACHIEVEMENTS.staleMs,
    placeholderData: keepPreviousData,
    select: (data) => ({
      ...data,
      items: data.items.map((item) => ({
        ...item,
        title: localizedText({ locale, text: item.title, english: item.titleEn }),
        description: localizedText({ locale, text: item.description, english: item.descriptionEn })
      }))
    })
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
