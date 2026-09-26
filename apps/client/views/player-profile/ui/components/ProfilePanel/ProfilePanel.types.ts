import type { ReactNode } from 'react';

export type ProfilePanelProps = {
  title: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  isFlush?: boolean;
  className?: string;
  children: ReactNode;
};
