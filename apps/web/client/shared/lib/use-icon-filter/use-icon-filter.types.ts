export type UseIconFilterInput<T extends number | string> = {
  options: readonly T[];
  value: readonly T[];
  isMultiple: boolean;
  onChange: (value: T[]) => void;
};
