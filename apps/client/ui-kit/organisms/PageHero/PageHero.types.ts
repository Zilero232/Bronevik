import type { ReactNode } from 'react';

export type PageHeroProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  index?: string;
  description?: ReactNode;
  watermark?: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
};
