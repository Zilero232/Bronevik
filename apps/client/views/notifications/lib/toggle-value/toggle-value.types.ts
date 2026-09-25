export type ToggleValueInput<T> = {
  values: readonly T[];
  value: T;
  isOn: boolean;
};
