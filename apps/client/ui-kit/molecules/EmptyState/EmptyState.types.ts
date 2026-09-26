import type { ReactNode } from 'react';

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  isCompact?: boolean;
  code?: ReactNode;
  className?: string;
};
