import type { ReactNode } from 'react';

export type MeCardProps = {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  tone?: 'danger' | 'default';
};
