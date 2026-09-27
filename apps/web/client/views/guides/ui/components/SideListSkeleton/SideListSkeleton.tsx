import { Skeleton } from '@/ui-kit';

import { GUIDE_LIST } from '../../../config';

import s from './SideListSkeleton.module.scss';

export const SideListSkeleton = () => (
  <div aria-busy className={s.root}>
    {GUIDE_LIST.skeletonRows.map((row) => (
      <Skeleton key={row} height={GUIDE_LIST.skeletonHeight} shape='block' />
    ))}
  </div>
);
