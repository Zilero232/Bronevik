import type { ReactNode } from 'react';

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  isCompact?: boolean;
  isFramed?: boolean;
  titleAs?: 'h1' | 'h2' | 'h3';
  role?: 'alert' | 'status';
  className?: string;
};
