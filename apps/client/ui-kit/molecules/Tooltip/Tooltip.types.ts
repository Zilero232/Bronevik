import type { ReactElement, ReactNode } from 'react';

export type TooltipProps = {
  content: ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  delay?: number;
  isNativeButton?: boolean;
  className?: string;
  children: ReactElement;
};
