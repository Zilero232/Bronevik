import { Skeleton } from '@/ui-kit';

import type { BoardSkeletonProps } from './BoardSkeleton.types';

import { COMPARE_BOARD } from '../../../config';

import s from './BoardSkeleton.module.scss';

export const BoardSkeleton = ({ count }: BoardSkeletonProps) => (
  <div aria-busy className={s.root}>
    {Array.from({ length: count + 1 }, (_, column) => (
      <div key={column} className={s.column}>
        <Skeleton height={COMPARE_BOARD.skeletonHead} shape='block' />
        <Skeleton count={COMPARE_BOARD.skeletonLines} height={12} shape='line' width={column === 0 ? '70%' : '50%'} />
      </div>
    ))}
  </div>
);
