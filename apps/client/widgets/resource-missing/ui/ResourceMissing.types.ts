import type { ReactNode } from 'react';

export type ResourceMissingReason = 'error' | 'notFound';

export type ResourceMissingProps = {
  reason: ResourceMissingReason;
  title: ReactNode;
  description?: ReactNode;
  back?: {
    href: string;
    label: ReactNode;
  };
  isRetrying?: boolean;
  className?: string;
  onRetry?: () => void;
};
