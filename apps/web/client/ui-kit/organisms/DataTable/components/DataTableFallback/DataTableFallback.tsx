import { clsx } from 'clsx';

import type { DataTableFallbackProps } from './DataTableFallback.types';

import { Skeleton } from '../../../../atoms';
import { DataTableCardsSkeleton } from '../DataTableCardsSkeleton';
import { DataTableHeadSkeleton } from '../DataTableHeadSkeleton';
import { DataTableSkeleton } from '../DataTableSkeleton';

import s from '../../DataTable.module.scss';

export const DataTableFallback = ({
  columnCount,
  density,
  rowHeight,
  rowCount,
  hasToolbar,
  hasCards,
  hasFooter,
  className
}: DataTableFallbackProps) => (
  <div className={clsx(s.frame, className)} data-cards={hasCards} data-density={density} style={{ '--table-row-h': `${rowHeight}px` }}>
    {hasToolbar && (
      <div aria-hidden className={s.toolbar}>
        <Skeleton width='8em' />
      </div>
    )}
    <div className={s.root}>
      <table className={s.table}>
        <DataTableHeadSkeleton columnCount={columnCount} />
        <DataTableSkeleton columnCount={columnCount} rowCount={rowCount} />
      </table>
    </div>
    {hasCards && <DataTableCardsSkeleton count={rowCount} />}
    {hasFooter && (
      <div aria-hidden className={s.footer}>
        <Skeleton width='12em' />
      </div>
    )}
  </div>
);
