import type { ReactNode } from 'react';

export type DrawerSide = 'bottom' | 'right';

export type DrawerProps = {
  open: boolean;
  title: ReactNode;
  side?: DrawerSide;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
};
