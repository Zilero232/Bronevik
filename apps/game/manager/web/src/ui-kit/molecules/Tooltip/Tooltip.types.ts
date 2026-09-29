import type { ReactElement, ReactNode } from 'react';

export type TooltipProps = {
  content: ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  children: ReactElement<Record<string, unknown>>;
};
