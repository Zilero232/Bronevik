import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './GuessSkeleton.module.scss';

const ROWS = [0, 1, 2, 3];

export const GuessSkeleton = () => {
  const t = useTranslations('play.states');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.side}>
        <Skeleton height={320} width='100%' />
        <Skeleton height={180} width='100%' />
      </div>
      <div className={s.main}>
        <Skeleton height={48} width='100%' />
        <Skeleton height={56} width='100%' />
        {ROWS.map((row) => (
          <Skeleton key={row} height={72} width='100%' />
        ))}
      </div>
    </div>
  );
};
