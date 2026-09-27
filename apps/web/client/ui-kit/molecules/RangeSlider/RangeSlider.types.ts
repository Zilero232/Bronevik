import type { ReactNode } from 'react';

export type RangeSliderProps = {
  value: number;
  label: ReactNode;
  min: number;
  max: number;
  step?: number;
  valueLabel?: ReactNode;
  className?: string;
  onValueChange: (value: number) => void;
};
