import type { ComponentProps, ReactNode } from 'react';

export type CardVariant = 'panel' | 'well';

export type CardProps = ComponentProps<'div'> & {
  variant?: CardVariant;
  padding?: 'lg' | 'md' | 'none' | 'sm';
  isInteractive?: boolean;
};

export type CardHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
  title?: ReactNode;
  meta?: ReactNode;
  tabs?: ReactNode;
  action?: ReactNode;
};
