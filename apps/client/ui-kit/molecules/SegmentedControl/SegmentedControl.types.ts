import type { ReactNode } from 'react';

export type SegmentedOption<T extends string = string> = {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  tint?: string;
  'aria-label'?: string;
};

export type SegmentedControlProps<T extends string = string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  size?: 'md' | 'sm';
  variant?: 'icons' | 'text';
  className?: string;
  'aria-label'?: string;
  onChange: (value: T) => void;
};
