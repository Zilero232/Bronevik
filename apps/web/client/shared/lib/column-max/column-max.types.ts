export type ColumnMaxInput<T> = {
  rows: readonly T[];
  value: (row: T) => number | null | undefined;
};
