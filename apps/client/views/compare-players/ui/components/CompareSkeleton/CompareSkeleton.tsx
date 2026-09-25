import { Skeleton } from '@/ui-kit';

import s from './CompareSkeleton.module.scss';

export const CompareSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton height={80} width='min(420px, 80%)' />
    <div className={s.slots}>
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={150} shape='block' />
      ))}
    </div>
    <Skeleton height={420} shape='block' />
  </div>
);
