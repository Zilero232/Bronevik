import type { ReactNode } from 'react';

export type PageBreadcrumb = {
  label: ReactNode;
  href?: string;
};

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: PageBreadcrumb[];
  meta?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
};
