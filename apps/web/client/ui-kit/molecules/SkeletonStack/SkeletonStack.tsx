import type { SkeletonStackProps } from './SkeletonStack.types';

import { Skeleton } from '../../atoms';

export const SkeletonStack = ({ heights, className }: SkeletonStackProps) => (
  <div aria-busy className={className}>
    {heights.map((height) => (
      <Skeleton key={height} height={height} shape='block' />
    ))}
  </div>
);
