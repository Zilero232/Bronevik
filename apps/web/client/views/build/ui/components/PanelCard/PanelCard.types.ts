import type { ReactNode } from 'react';

export type PanelCardProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};
