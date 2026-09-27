export type MapNeighboursInput<T> = {
  items: readonly T[];
  index: number;
};

export type MapNeighbours<T> = {
  prev: T | null;
  next: T | null;
};
