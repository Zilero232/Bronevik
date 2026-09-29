import { useTranslations } from 'next-intl';

import { DailyLayout } from '@/entities/play/daily-puzzle';
import { Skeleton } from '@/ui-kit';

import { GUESS_VIEW } from '../../../config';

export const GuessSkeleton = () => {
  const t = useTranslations('play.states');

  return (
    <DailyLayout
      aria-busy
      side={
        <>
          <Skeleton height={280} width='100%' />
          <Skeleton height={180} width='100%' />
        </>
      }
      aria-label={t('loading')}
      role='status'
    >
      <Skeleton height={64} width='100%' />
      <Skeleton height={36} width='100%' />
      <Skeleton count={GUESS_VIEW.skeletonRows} height={36} width='100%' />
    </DailyLayout>
  );
};
