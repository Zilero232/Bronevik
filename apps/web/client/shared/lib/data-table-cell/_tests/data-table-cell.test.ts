import type { ColumnDef } from '@tanstack/react-table';

import { createTable, getCoreRowModel } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';

import { dataTableCell } from '..';

type Row = { place: number; damage: number | null; name: string };

const COLUMNS: ColumnDef<Row, unknown>[] = [
  { accessorKey: 'place', meta: { isRank: true, align: 'center' } },
  { accessorKey: 'damage', meta: { bar: { tone: 'accent' }, isNumeric: true } },
  { accessorKey: 'name' }
];

const cellsOf = (data: Row[]) => {
  const table = createTable<Row>({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    state: {},
    onStateChange: () => undefined,
    renderFallbackValue: null
  });

  table.setOptions((options) => ({ ...options, state: table.initialState }));

  return table.getRowModel().rows.map((row) => row.getVisibleCells());
};

describe('dataTableCell', () => {
  const [[place, damage, name]] = cellsOf([{ place: 2, damage: 1_500, name: 'IS-7' }]);

  it('reads the column meta with a start alignment by default', () => {
    expect(dataTableCell({ cell: place, barMax: {} })).toMatchObject({ align: 'center', isRank: true, isSorted: false });
    expect(dataTableCell({ cell: name, barMax: {} })).toMatchObject({ align: 'start', medal: undefined, bar: null });
  });

  it('gives a rank cell its medal', () => {
    expect(dataTableCell({ cell: place, barMax: {} }).medal).toBe('silver');
  });

  it('scales a bar cell against the column maximum', () => {
    expect(dataTableCell({ cell: damage, barMax: { damage: 3_000 } }).bar).toEqual({ value: 1_500, max: 3_000, tone: 'accent' });
  });

  it('drops the bar for a missing value', () => {
    const [[, empty]] = cellsOf([{ place: 1, damage: null, name: 'T-100 LT' }]);

    expect(dataTableCell({ cell: empty, barMax: { damage: 3_000 } }).bar).toBeNull();
  });
});
