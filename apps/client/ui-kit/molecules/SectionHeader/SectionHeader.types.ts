import type { ReactNode } from 'react';

export type SectionHeaderProps = {
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};
