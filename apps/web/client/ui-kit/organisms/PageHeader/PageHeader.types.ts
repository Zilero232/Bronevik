import type { ReactNode } from 'react';

import type { PageBreadcrumb } from '../../molecules';

export type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: PageBreadcrumb[];
  meta?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  emblem?: ReactNode;
  children?: ReactNode;
  className?: string;
};
