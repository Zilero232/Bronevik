import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './MapSkeleton.module.scss';

export const MapSkeleton = () => {
  const t = useTranslations('maps.map');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <Skeleton height={14} width={160} />
      <Skeleton height={28} width='min(420px, 80vw)' />
      <Skeleton height={64} shape='block' />
      <Skeleton height={140} shape='block' />
    </div>
  );
};
