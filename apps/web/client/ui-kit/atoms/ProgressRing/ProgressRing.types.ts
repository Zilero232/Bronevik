import type { ReactNode } from 'react';

import type { ProgressTone } from '../ProgressBar';

type ProgressRingMarks = 0 | 1 | 2 | 3;

export type ProgressRingProps = {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: ProgressTone;
  marks?: ProgressRingMarks;
  label?: string;
  children?: ReactNode;
  className?: string;
};
