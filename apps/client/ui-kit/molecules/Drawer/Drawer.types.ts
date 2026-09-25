import type { ReactNode } from 'react';

export type DrawerProps = {
  open: boolean;
  title: ReactNode;
  className?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
};
