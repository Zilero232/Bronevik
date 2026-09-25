import { flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { match } from 'ts-pattern';

import type { DataTableHeadProps } from '../../DataTable.types';

import s from '../../DataTable.module.scss';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

export const DataTableHead = <T,>({ table }: DataTableHeadProps<T>) => {
  'use no memo';

  return (
    <thead className={s.head}>
      {table.getHeaderGroups().map((group) => (
        <tr key={group.id}>
          {group.headers.map((header) => {
            const sorted = header.column.getIsSorted();
            const { align = 'start', width } = header.column.columnDef.meta ?? {};
            const content = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());

            return (
              <th
                key={header.id}
                aria-sort={sorted ? ARIA_SORT[sorted] : undefined}
                className={s.th}
                data-align={align}
                scope='col'
                style={{ width }}
              >
                {header.column.getCanSort() ? (
                  <button className={s.sort} data-sorted={Boolean(sorted)} type='button' onClick={header.column.getToggleSortingHandler()}>
                    {content}
                    {match(sorted)
                      .with('asc', () => <ArrowUp size={13} />)
                      .with('desc', () => <ArrowDown size={13} />)
                      .otherwise(() => (
                        <ChevronsUpDown className={s.sortIdle} size={13} />
                      ))}
                  </button>
                ) : (
                  content
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};
