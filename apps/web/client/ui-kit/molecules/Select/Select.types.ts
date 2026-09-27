import type { ReactNode } from 'react';

export type SelectItem<T extends string = string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

export type SelectProps<T extends string = string> = {
  items: SelectItem<T>[];
  value: T;
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  onValueChange: (value: T) => void;
};
