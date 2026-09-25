import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './MapSkeleton.module.scss';

export const MapSkeleton = () => {
  const t = useTranslations('maps.map');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.head}>
        <Skeleton height={14} width={160} />
        <Skeleton height={56} width='min(420px, 80vw)' />
      </div>
      <div className={s.layout}>
        <Skeleton className={s.viewer} shape='block' />
        <div className={s.side}>
          <Skeleton height={120} shape='block' />
          <Skeleton height={160} shape='block' />
          <Skeleton height={120} shape='block' />
        </div>
      </div>
    </div>
  );
};
