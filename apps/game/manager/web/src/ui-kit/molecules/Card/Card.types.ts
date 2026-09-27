import type { ReactNode } from 'react';

export type CardProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: 'accent' | 'default' | 'premium' | 'warning';
  children?: ReactNode;
  className?: string;
};
