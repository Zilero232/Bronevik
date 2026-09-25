import type { ReactElement, ReactNode } from 'react';

export type PopoverProps = {
  trigger: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
  side?: 'bottom' | 'left' | 'right' | 'top';
  align?: 'center' | 'end' | 'start';
  className?: string;
  children?: ReactNode;
};
