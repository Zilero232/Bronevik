import type { ReactNode } from 'react';

export type DesignBlockProps = {
  id: string;
  eyebrow: ReactNode;
  title: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export type DesignRowProps = {
  label: string;
  className?: string;
  children: ReactNode;
};
