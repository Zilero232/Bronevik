import type { ReactNode } from 'react';

export type PageHeaderProps = {
  title: string;
  description?: string;
  help?: ReactNode;
  actions?: ReactNode;
};
