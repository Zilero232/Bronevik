'use client';

import { useTranslations } from 'next-intl';

import { KEY_SPECS } from '@/entities/tank/tank';
import { Skeleton } from '@/ui-kit';

import { TANK_PAGE } from '../../../config';

import s from './TankSkeleton.module.scss';

export const TankSkeleton = () => {
  const t = useTranslations('tank.notice');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      <div className={s.hero}>
        <div className={s.copy}>
          <Skeleton height={12} shape='line' width={160} />
          <Skeleton height={28} shape='line' width={220} />
          <Skeleton height={88} shape='block' width='80%' />
          <Skeleton height={32} shape='line' width={320} />
          <Skeleton height={44} shape='block' width={360} />
        </div>
        <div className={s.specs}>
          {KEY_SPECS.map((key) => (
            <Skeleton key={key} height={52} shape='block' width='100%' />
          ))}
        </div>
      </div>
      <div className={s.tiles}>
        {Array.from({ length: TANK_PAGE.skeletonTiles }, (_, index) => (
          <Skeleton key={index} height={112} shape='block' width='100%' />
        ))}
      </div>
    </div>
  );
};
