import type { ColumnMaxInput } from './column-max.types';

export const columnMax = <T>({ rows, value }: ColumnMaxInput<T>): number =>
  rows.reduce((max, row) => {
    const next = value(row);

    return typeof next === 'number' && Number.isFinite(next) && next > max ? next : max;
  }, 0);
