import { Skeleton } from '@/ui-kit';

import s from './CompareSkeleton.module.scss';

export const CompareSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton height={28} width='min(320px, 70%)' />
    <div className={s.slots}>
      {Array.from({ length: 2 }, (_, index) => (
        <Skeleton key={index} height={72} shape='block' />
      ))}
    </div>
    <Skeleton height={360} shape='block' />
  </div>
);
