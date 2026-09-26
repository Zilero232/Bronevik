'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { PARAM_KEYS } from '../../../config';

import s from './TankSkeleton.module.scss';

export const TankSkeleton = () => {
  const t = useTranslations('tank');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.garage}>
        <Skeleton height={12} shape='line' width={200} />
        <Skeleton height={28} shape='line' width={260} />
        <Skeleton height={200} shape='block' width={320} />
      </div>
      <div className={s.params}>
        {PARAM_KEYS.map((key) => (
          <Skeleton key={key} height={28} shape='line' width='100%' />
        ))}
      </div>
    </div>
  );
};
