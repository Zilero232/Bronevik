import type { ReactNode } from 'react';

type SectionHeaderMore = {
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
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};
