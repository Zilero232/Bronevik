import { Skeleton } from '@/ui-kit';

import s from './CompareSkeleton.module.scss';

export const CompareSkeleton = () => (
  <div aria-busy className={s.root}>
    <Skeleton height={28} width='min(320px, 70%)' />
    <div className={s.slots}>
      <Skeleton count={2} height={72} shape='block' />
    </div>
    <Skeleton height={360} shape='block' />
  </div>
);
