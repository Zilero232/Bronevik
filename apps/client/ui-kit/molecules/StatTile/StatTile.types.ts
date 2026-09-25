import type { ReactNode } from 'react';

import type { ProgressTone } from '../../atoms';

export type StatTileProps = {
  label: ReactNode;
  value: number;
  format?: Intl.NumberFormatOptions;
  prefix?: string;
  suffix?: string;
  delta?: number;
  deltaLabel?: ReactNode;
  icon?: ReactNode;
  trend?: number[];
  tone?: ProgressTone;
  hint?: ReactNode;
  className?: string;
};
