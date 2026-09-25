import type { ReactNode } from 'react';

import type { ProgressTone } from '../ProgressBar';

export type ProgressRingProps = {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: ProgressTone;
  label?: string;
  children?: ReactNode;
  className?: string;
};
