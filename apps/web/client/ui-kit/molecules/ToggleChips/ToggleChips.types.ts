import type { ReactNode } from 'react';

export type ToggleChip<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  title?: string;
};

export type ToggleChipsProps<T extends string = string> = {
  options: readonly ToggleChip<T>[];
  value: readonly T[];
  size?: 'md' | 'sm';
  className?: string;
  'aria-label': string;
  onChange: (value: T[]) => void;
};
