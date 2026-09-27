import type { ToggleValueInput } from './toggle-value.types';

export const toggleValue = <T>({ values, value, isOn }: ToggleValueInput<T>): T[] => {
  const rest = values.filter((item) => item !== value);

  return isOn ? [...rest, value] : rest;
};
