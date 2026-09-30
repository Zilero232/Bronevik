import { times } from 'remeda';

import type { DataTableHeadSkeletonProps } from './DataTableHeadSkeleton.types';

import { Skeleton } from '../../../../atoms';

import s from '../../DataTable.module.scss';

export const DataTableHeadSkeleton = ({ columnCount }: DataTableHeadSkeletonProps) => (
  <thead aria-hidden className={s.head}>
    <tr>
      {times(columnCount, (column) => (
        <th key={column} className={s.th}>
          <Skeleton width={`${40 + ((column * 17) % 40)}%`} />
        </th>
      ))}
    </tr>
  </thead>
);
