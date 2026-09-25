import type { SortOrder } from '@bronevik/schemas';

type SortValue = number | string | null;

export type SortRowsInput<T> = {
  rows: readonly T[];
  value: (row: T) => SortValue;
  order: SortOrder;
};

export type PageInput<T> = {
  items: readonly T[];
  limit: number;
  offset: number;
};
