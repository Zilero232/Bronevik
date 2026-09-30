import { times } from 'remeda';

import type { DataTableCardsSkeletonProps } from './DataTableCardsSkeleton.types';

import { Skeleton } from '../../../../atoms';
import { DATA_TABLE } from '../../DataTable.constants';

import s from '../../DataTable.module.scss';

export const DataTableCardsSkeleton = ({ count }: DataTableCardsSkeletonProps) => (
  <ul aria-busy className={s.cards}>
    {times(count, (index) => (
      <li key={index} className={s.card}>
        <Skeleton height={DATA_TABLE.skeletonCardHeight} shape='block' />
      </li>
    ))}
  </ul>
);
