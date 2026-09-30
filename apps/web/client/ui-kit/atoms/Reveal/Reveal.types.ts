import type { ReactNode } from 'react';

export type RevealProps = {
  children: ReactNode;
  as?: 'div' | 'li' | 'section';
  order?: number;
  className?: string;
};
