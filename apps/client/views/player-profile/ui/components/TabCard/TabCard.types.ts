import type { ReactNode } from 'react';

export type TabCardProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};
