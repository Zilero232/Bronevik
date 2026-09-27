import type { ToggleListInput } from './settings-toggle.types';

export const toggleItem = <T>({ list, item }: ToggleListInput<T>): T[] =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
