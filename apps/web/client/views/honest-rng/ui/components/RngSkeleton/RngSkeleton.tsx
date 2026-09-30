import { Skeleton } from '@/ui-kit';

import s from './RngSkeleton.module.scss';

export const RngSkeleton = () => (
  <div aria-hidden className={s.root}>
    <Skeleton className={s.chart} shape='block' />
    <div className={s.pair}>
      <Skeleton className={s.tiers} shape='block' />
      <Skeleton className={s.shells} shape='block' />
    </div>
  </div>
);
