import type { ReactNode } from 'react';

export type RangeFieldProps = {
  from: number | null;
  to: number | null;
  min?: number;
  max?: number;
  step?: number;
  suffix?: ReactNode;
  fromPlaceholder?: string;
  toPlaceholder?: string;
  className?: string;
  'aria-label': string;
  onFromChange: (value: number | null) => void;
  onToChange: (value: number | null) => void;
};
