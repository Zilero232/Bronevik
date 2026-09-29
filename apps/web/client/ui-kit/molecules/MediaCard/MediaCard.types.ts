import type { ReactNode } from 'react';

type MediaCardAspect = 'portrait' | 'wide';

export type MediaCardProps = {
  href?: string;
  isExternal?: boolean;
  media: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  subIcon?: ReactNode;
  body?: ReactNode;
  ribbon?: ReactNode;
  aspect?: MediaCardAspect;
  className?: string;
};
