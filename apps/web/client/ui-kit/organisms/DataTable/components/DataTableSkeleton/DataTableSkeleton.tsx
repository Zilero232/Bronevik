import { times } from 'remeda';

import type { DataTableSkeletonProps } from './DataTableSkeleton.types';

import { Skeleton } from '../../../../atoms';

import s from '../../DataTable.module.scss';

export const DataTableSkeleton = ({ columnCount, rowCount }: DataTableSkeletonProps) => (
  <tbody aria-busy>
    {times(rowCount, (row) => (
      <tr key={row} className={s.row}>
        {times(columnCount, (column) => (
          <td key={column} className={s.td}>
            <Skeleton width={`${50 + ((row * 7 + column * 13) % 45)}%`} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);
