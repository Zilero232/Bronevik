import type { ReactNode } from 'react';

export type InboxHeaderProps = {
  title: ReactNode;
  count?: number;
  actions?: ReactNode;
  className?: string;
};
