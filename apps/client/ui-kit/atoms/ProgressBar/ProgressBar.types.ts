import type { ReactNode } from 'react';

import type { RatingTone } from '@/shared/lib';

export type ProgressTone = 'accent' | 'battle' | 'brass' | 'gold' | 'olive' | 'sky' | 'steel' | RatingTone;

export type ProgressBarProps = {
  value: number;
  max?: number;
  label?: ReactNode;
  'aria-label'?: string;
  valueLabel?: ReactNode;
  tone?: ProgressTone;
  size?: 'md' | 'sm';
  className?: string;
};
