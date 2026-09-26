import type { ReactNode } from 'react';

export type MarkProgressProps = {
  percent: number;
  title?: ReactNode;
  damageToNext?: number | null;
  size?: number;
  variant?: 'card' | 'inline';
  as?: 'div' | 'li';
  className?: string;
};
