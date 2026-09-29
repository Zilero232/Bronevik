import { Skeleton } from '@/ui-kit';

import type { LeadFeedSkeletonProps } from './LeadFeedSkeleton.types';

import s from './LeadFeedSkeleton.module.scss';

export const LeadFeedSkeleton = ({ count, height }: LeadFeedSkeletonProps) => (
  <div className={s.root}>
    <Skeleton count={count} height={height} shape='block' />
  </div>
);
