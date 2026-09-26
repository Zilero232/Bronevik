import type { ReactNode } from 'react';

export type SectionTitleProps = {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  aside?: ReactNode;
  more?: { href: string; label: ReactNode };
};
