import { sortBy } from 'remeda';

import type { PageInput, SortRowsInput } from './sort.types';

export const sortRows = <T>({ rows, value, order }: SortRowsInput<T>): T[] =>
  sortBy(rows, [(row) => value(row) === null, 'asc'], [(row) => value(row) ?? 0, order]);

export const page = <T>({ items, limit, offset }: PageInput<T>) => ({
  items: items.slice(offset, offset + limit),
  total: items.length,
  limit,
  offset
});
