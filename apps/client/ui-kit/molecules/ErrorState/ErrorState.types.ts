import type { ReactNode } from 'react';

export type ErrorStateProps = {
  onRetry: () => void;
  title?: ReactNode;
  description?: ReactNode;
  isRetrying?: boolean;
  isCompact?: boolean;
  className?: string;
};
