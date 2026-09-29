import { useTranslations } from 'next-intl';

import { DailyLayout } from '@/entities/play/daily-puzzle';
import { Skeleton } from '@/ui-kit';

import { GUESS_MAP } from '../../../config';

import s from './MapSkeleton.module.scss';

export const MapSkeleton = () => {
  const t = useTranslations('play.map.states');

  return (
    <DailyLayout
      aria-busy
      isWide
      aria-label={t('loading')}
      role='status'
      side={<Skeleton className={s.frame} height='auto' shape='block' width='100%' />}
    >
      <Skeleton height={64} width='100%' />
      <Skeleton count={GUESS_MAP.skeletonChoices} height={32} width='100%' />
    </DailyLayout>
  );
};
