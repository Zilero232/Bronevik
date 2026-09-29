import type { Nation, TankClass } from '@otmetki/icons';

type IconFilterValues = {
  class: TankClass;
  nation: Nation;
};

export type IconFilterKind = keyof IconFilterValues;

export type IconFilterProps<K extends IconFilterKind> = {
  kind: K;
  options: readonly IconFilterValues[K][];
  value: readonly IconFilterValues[K][];
  isMultiple?: boolean;
  size?: 'md' | 'sm';
  'aria-label': string;
  className?: string;
  onChange: (value: IconFilterValues[K][]) => void;
};
