import { clsx } from 'clsx';

import type { DataTableFallbackProps } from './DataTableFallback.types';

import { DataTableSkeleton } from '../DataTableSkeleton';

import s from '../../DataTable.module.scss';

export const DataTableFallback = ({ columnCount, density, rowHeight, className }: DataTableFallbackProps) => (
  <div className={clsx(s.frame, className)} data-density={density} style={{ '--table-row-h': `${rowHeight}px` }}>
    <div className={s.root}>
      <table className={s.table}>
        <DataTableSkeleton columnCount={columnCount} />
      </table>
    </div>
  </div>
);
