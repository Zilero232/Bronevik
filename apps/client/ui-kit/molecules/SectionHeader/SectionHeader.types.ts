import type { ReactNode } from 'react';

export type SectionHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h2' | 'h3';
  className?: string;
};
