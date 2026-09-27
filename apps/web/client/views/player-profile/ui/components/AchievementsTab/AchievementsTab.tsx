'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { ACHIEVEMENTS } from '../../../config';
import { usePlayerAchievements } from '../../../model/hooks';
import { AchievementSection } from './components';

import s from './AchievementsTab.module.scss';

export const AchievementsTab = () => {
  const t = useTranslations('profile.achievements');
  const query = usePlayerAchievements();

  return (
    <QueryState empty={<EmptyState title={t('empty')} />} query={query} skeleton={<Skeleton height={ACHIEVEMENTS.skeletonHeight} shape='block' />}>
      {(sections) => (
        <div className={s.root}>
          {sections.map((section) => (
            <AchievementSection key={section.section} isFeatured={section.isFeatured} section={section} />
          ))}
        </div>
      )}
    </QueryState>
  );
};
