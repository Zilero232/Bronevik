import type { ReactNode } from 'react';

import type { ProgressTone } from '../../atoms';

export type KeyFigureVariant = 'compact' | 'highlight' | 'plain';

export type KeyFigureProps = {
  label: ReactNode;
  value: ReactNode;
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
  variant?: KeyFigureVariant;
  icon?: ReactNode;
  className?: string;
};
