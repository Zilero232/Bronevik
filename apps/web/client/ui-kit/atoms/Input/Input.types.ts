import type { ComponentProps, ReactNode } from 'react';

export type InputProps = Omit<ComponentProps<'input'>, 'size'> & {
  icon?: ReactNode;
  trailing?: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  isInvalid?: boolean;
  wrapperClassName?: string;
};
