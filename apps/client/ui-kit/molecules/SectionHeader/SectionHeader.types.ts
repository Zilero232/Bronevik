import type { ReactNode } from 'react';

export type SectionHeaderMore = {
  href: string;
  label: ReactNode;
};

export type SectionHeaderProps = {
  title: ReactNode;
  id?: string;
  description?: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  more?: SectionHeaderMore;
  count?: ReactNode;
  variant?: 'default' | 'display';
  as?: 'h2' | 'h3';
  className?: string;
};
