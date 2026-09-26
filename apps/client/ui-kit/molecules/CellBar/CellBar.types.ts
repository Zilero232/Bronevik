import type { ReactNode } from 'react';

import type { ProgressTone } from '../../atoms';

export type CellBarProps = {
  value: number;
  max: number;
  tone?: ProgressTone;
  children: ReactNode;
  className?: string;
};
