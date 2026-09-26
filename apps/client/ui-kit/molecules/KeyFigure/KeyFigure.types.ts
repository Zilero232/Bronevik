import type { ReactNode } from 'react';

import type { ProgressTone } from '../../atoms';

export type KeyFigureProps = {
  label: ReactNode;
  value: number | null;
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  delta?: number;
  deltaLabel?: ReactNode;
  isDeltaLowerBetter?: boolean;
  hint?: ReactNode;
  trend?: number[];
  tone?: ProgressTone;
  size?: 'lg' | 'md' | 'xl';
  isFramed?: boolean;
  icon?: ReactNode;
  className?: string;
};
