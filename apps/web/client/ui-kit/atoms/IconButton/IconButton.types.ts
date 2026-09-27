import type { ComponentProps } from 'react';

export type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label'> & {
  'aria-label': string;
  variant?: 'ghost' | 'outline';
  size?: 'lg' | 'md' | 'sm';
  isActive?: boolean;
};
