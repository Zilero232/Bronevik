import type { ComponentProps, ReactNode } from 'react';

export type CardVariant = 'flat' | 'panel' | 'plate' | 'riveted' | 'sunken' | 'well';

export type CardProps = ComponentProps<'div'> & {
  variant?: CardVariant;
  padding?: 'lg' | 'md' | 'none' | 'sm';
  isInteractive?: boolean;
};

export type CardHeaderProps = Omit<ComponentProps<'div'>, 'title'> & {
  title?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  tabs?: ReactNode;
  action?: ReactNode;
};
