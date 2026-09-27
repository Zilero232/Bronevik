import type { PageInput, SortRowsInput } from './sort.types';

export const sortRows = <T>({ rows, value, order }: SortRowsInput<T>): T[] => {
  const direction = order === 'asc' ? 1 : -1;

  return [...rows].sort((left, right) => {
    const a = value(left);
    const b = value(right);

    if (a === b) {
      return 0;
    }

    if (a === null) {
      return 1;
    }

    if (b === null) {
      return -1;
    }

    return a < b ? -direction : direction;
  });
};

export const page = <T>({ items, limit, offset }: PageInput<T>) => ({
  items: items.slice(offset, offset + limit),
  total: items.length,
  limit,
  offset
});
