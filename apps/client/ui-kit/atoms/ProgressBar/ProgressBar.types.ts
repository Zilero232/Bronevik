import type { ReactNode } from 'react';

import type { RatingTone } from '@/shared/lib';

export type ProgressTone = 'accent' | 'steel' | RatingTone;

export type ProgressBarProps = {
  value: number;
  max?: number;
  label?: ReactNode;
  valueLabel?: ReactNode;
  tone?: ProgressTone;
  size?: 'md' | 'sm';
  className?: string;
};
