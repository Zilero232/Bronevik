import type { ReactNode } from 'react';

export type NumberFieldProps = {
  value: number | null;
  label?: ReactNode;
  'aria-label'?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: ReactNode;
  hint?: ReactNode;
  format?: Intl.NumberFormatOptions;
  className?: string;
  onValueChange: (value: number | null) => void;
};
