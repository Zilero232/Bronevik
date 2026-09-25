export type UseCalcState<T> = {
  values: T;
  field: <K extends keyof T>(key: K) => (value: T[K]) => void;
  replace: (values: T) => void;
};
