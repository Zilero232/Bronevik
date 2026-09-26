'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { ACHIEVEMENTS } from '../../../config';
import { usePlayerAchievements } from '../../../model/hooks';
import { AchievementSection } from './components';

import s from './AchievementsTab.module.scss';

export const AchievementsTab = () => {
  const t = useTranslations('profile.achievements');
  const { sections, isPending, isError, isRetrying, retry } = usePlayerAchievements();

  if (isError) {
    return <ErrorState isRetrying={isRetrying} onRetry={retry} />;
  }

  if (isPending) {
    return <Skeleton height={ACHIEVEMENTS.skeletonHeight} shape='block' />;
  }

  if (sections.length === 0) {
    return <EmptyState title={t('empty')} />;
  }

  return (
    <div className={s.root}>
      {sections.map((section) => (
        <AchievementSection key={section.section} isFeatured={section.isFeatured} section={section} />
      ))}
    </div>
  );
};
