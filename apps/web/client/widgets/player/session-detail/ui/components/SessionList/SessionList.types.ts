import type { ReactNode } from 'react';

export type SessionListProps = {
  title: string;
  list: 'ol' | 'ul';
  children: ReactNode;
};
