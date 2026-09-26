import type { ReactNode } from 'react';

export type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  count?: ReactNode;
  variant?: 'default' | 'display';
  as?: 'h2' | 'h3';
  className?: string;
};
