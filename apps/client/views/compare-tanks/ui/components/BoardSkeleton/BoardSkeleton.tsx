import { Skeleton } from '@/ui-kit';

import type { BoardSkeletonProps } from './BoardSkeleton.types';

import s from './BoardSkeleton.module.scss';

const LINES = Array.from({ length: 9 }, (_, index) => index);

export const BoardSkeleton = ({ count }: BoardSkeletonProps) => (
  <div aria-busy className={s.root}>
    {Array.from({ length: count + 1 }, (_, column) => (
      <div key={column} className={s.column}>
        <Skeleton height={140} shape='block' />
        {LINES.map((line) => (
          <Skeleton key={line} height={14} shape='line' width={column === 0 ? '70%' : '50%'} />
        ))}
      </div>
    ))}
  </div>
);
