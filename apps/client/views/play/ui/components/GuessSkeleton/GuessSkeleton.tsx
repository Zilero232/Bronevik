import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { GUESS_VIEW } from '../../../config';

import s from './GuessSkeleton.module.scss';

export const GuessSkeleton = () => {
  const t = useTranslations('play.states');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.side}>
        <Skeleton height={280} width='100%' />
        <Skeleton height={180} width='100%' />
      </div>
      <div className={s.main}>
        <Skeleton height={64} width='100%' />
        <Skeleton height={36} width='100%' />
        {Array.from({ length: GUESS_VIEW.skeletonRows }, (_, row) => (
          <Skeleton key={row} height={36} width='100%' />
        ))}
      </div>
    </div>
  );
};
