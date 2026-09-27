import type { ReactNode } from 'react';

export type BaseSectionProps = {
  title: ReactNode;
  note: ReactNode;
  isEmpty: boolean;
  children: ReactNode;
};
