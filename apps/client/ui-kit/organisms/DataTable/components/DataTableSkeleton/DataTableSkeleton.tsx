import type { DataTableSkeletonProps } from '../../DataTable.types';

import { Skeleton } from '../../../../atoms';
import { DATA_TABLE } from '../../DataTable.constants';

import s from '../../DataTable.module.scss';

const ROWS = Array.from({ length: DATA_TABLE.skeletonRows }, (_, index) => index);

export const DataTableSkeleton = ({ columnCount }: DataTableSkeletonProps) => (
  <tbody aria-busy>
    {ROWS.map((row) => (
      <tr key={row} className={s.row}>
        {Array.from({ length: columnCount }, (_, column) => (
          <td key={column} className={s.td}>
            <Skeleton width={`${50 + ((row * 7 + column * 13) % 45)}%`} />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);
