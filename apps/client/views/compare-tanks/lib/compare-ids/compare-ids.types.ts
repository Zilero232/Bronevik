export type CompareIdInput = {
  ids: readonly number[];
  id: number;
};

export type OrderByIdsInput<T> = {
  items: readonly T[];
  ids: readonly number[];
  idOf: (item: T) => number;
};
