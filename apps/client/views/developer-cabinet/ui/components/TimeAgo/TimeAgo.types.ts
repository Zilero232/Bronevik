import type { ReactNode } from 'react';

export type TimeAgoProps = {
  value: string | null;
  fallback?: ReactNode;
  className?: string;
};
