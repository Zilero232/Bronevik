import type { ReactNode } from 'react';

export type FilterFieldSize = 'auto' | 'grow' | 'lg' | 'md' | 'sm';

export type FilterFieldProps = {
  label: ReactNode;
  children: ReactNode;
  hint?: string;
  count?: number;
  size?: FilterFieldSize;
  htmlFor?: string;
  className?: string;
};
