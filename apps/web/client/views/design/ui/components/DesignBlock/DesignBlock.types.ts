import type { ReactNode } from 'react';

export type DesignBlockProps = {
  id: string;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};
