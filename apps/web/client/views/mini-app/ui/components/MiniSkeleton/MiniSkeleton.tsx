import { Skeleton } from '@/ui-kit';

import s from './MiniSkeleton.module.scss';

export const MiniSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton height={72} shape='block' />
    <div className={s.tiles}>
      <Skeleton height={88} shape='block' />
      <Skeleton height={88} shape='block' />
      <Skeleton height={88} shape='block' />
      <Skeleton height={88} shape='block' />
    </div>
    <Skeleton height={140} shape='block' />
    <Skeleton height={180} shape='block' />
  </div>
);
