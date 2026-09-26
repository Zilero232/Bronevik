import type { ReactNode } from 'react';

export type MediaCardAspect = 'portrait' | 'wide';

export type MediaCardProps = {
  href?: string;
  media: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  subIcon?: ReactNode;
  ribbon?: ReactNode;
  aspect?: MediaCardAspect;
  className?: string;
};
