import { Skeleton } from '@/ui-kit';

import s from './DashboardSkeleton.module.scss';

export const DashboardSkeleton = () => (
  <div aria-hidden className={s.root}>
    <div className={s.head}>
      <Skeleton shape='circle' />
      <Skeleton className={s.name} shape='line' />
    </div>
    <div className={s.figures}>
      <Skeleton className={s.block} shape='block' />
      <Skeleton className={s.block} shape='block' />
      <Skeleton className={s.block} shape='block' />
      <Skeleton className={s.block} shape='block' />
    </div>
    <Skeleton className={s.marks} shape='block' />
    <Skeleton className={s.session} shape='block' />
    <Skeleton className={s.links} shape='block' />
  </div>
);
