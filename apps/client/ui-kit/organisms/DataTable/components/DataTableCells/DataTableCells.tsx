import { flexRender } from '@tanstack/react-table';

import { Link } from '@/shared/i18n/navigation';

import type { DataTableCellsProps } from './DataTableCells.types';

import { CellBar } from '../../../../molecules/CellBar';
import { DATA_TABLE } from '../../DataTable.constants';

import s from '../../DataTable.module.scss';

export const DataTableCells = <T,>({ row, barMax, link = null }: DataTableCellsProps<T>) =>
  row.getVisibleCells().map((cell, index) => {
    const { align = 'start', isNumeric, isMedia, isSticky, isRank, bar, hideBelow } = cell.column.columnDef.meta ?? {};
    const content = flexRender(cell.column.columnDef.cell, cell.getContext());
    const raw = cell.getValue();
    const rank = isRank && typeof raw === 'number' ? raw : null;
    const barValue = bar && typeof raw === 'number' ? raw : null;

    return (
      <td
        key={cell.id}
        className={s.td}
        data-align={align}
        data-hide-below={hideBelow}
        data-medal={rank === null ? undefined : DATA_TABLE.medals[rank - 1]}
        data-media={isMedia}
        data-numeric={isNumeric}
        data-rank={isRank}
        data-sticky={isSticky}
      >
        {index === 0 && link && <Link aria-label={link.label} className={s.rowLink} href={link.href} />}
        {bar && barValue !== null ? (
          <CellBar max={bar.max ?? barMax[cell.column.id] ?? 0} tone={bar.tone} value={barValue}>
            {content}
          </CellBar>
        ) : (
          content
        )}
      </td>
    );
  });
