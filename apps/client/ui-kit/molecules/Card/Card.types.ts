import type { ComponentProps, ReactNode } from 'react';

export type CardProps = ComponentProps<'div'> & {
  variant?: 'flat' | 'plate' | 'riveted' | 'sunken';
  padding?: 'lg' | 'md' | 'none' | 'sm';
  isInteractive?: boolean;
};

export type CardHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
  eyebrow?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
};
