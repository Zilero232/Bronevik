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
    const medal = rank === null ? undefined : DATA_TABLE.medals[rank - 1];

    return (
      <td
        key={cell.id}
        className={s.td}
        data-align={align}
        data-hide-below={hideBelow}
        data-medal={medal}
        data-media={isMedia}
        data-numeric={isNumeric}
        data-rank={isRank}
        data-sorted={cell.column.getIsSorted() ? true : undefined}
        data-sticky={isSticky}
      >
        {index === 0 && link && (
          <Link
            aria-hidden={link.hasCellLink || undefined}
            aria-label={link.hasCellLink ? undefined : link.label}
            className={s.rowLink}
            href={link.href}
            tabIndex={link.hasCellLink ? -1 : undefined}
          />
        )}
        {bar && barValue !== null ? (
          <CellBar max={bar.max ?? barMax[cell.column.id] ?? 0} tone={bar.tone} value={barValue}>
            {content}
          </CellBar>
        ) : medal ? (
          <span className={s.medal}>{content}</span>
        ) : (
          content
        )}
      </td>
    );
  });
