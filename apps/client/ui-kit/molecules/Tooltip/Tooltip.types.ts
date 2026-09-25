import type { ReactElement, ReactNode } from 'react';

export type TooltipProps = {
  content: ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  delay?: number;
  className?: string;
  children: ReactElement;
};
