import { times } from 'remeda';

import type { PodiumSkeletonProps } from './PodiumSkeleton.types';

import { Skeleton } from '../../atoms';
import { Podium } from '../Podium';

import s from './PodiumSkeleton.module.scss';

export const PodiumSkeleton = ({ height, compactHeight = height, count = 3, className }: PodiumSkeletonProps) => (
  <Podium className={className}>
    {times(count, (index) => (
      <li
        aria-busy
        key={index}
        className={s.item}
        data-rank={index + 1}
        style={{ '--podium-h': `${height}px`, '--podium-compact-h': `${compactHeight}px` }}
      >
        <Skeleton className={s.block} shape='block' />
      </li>
    ))}
  </Podium>
);
