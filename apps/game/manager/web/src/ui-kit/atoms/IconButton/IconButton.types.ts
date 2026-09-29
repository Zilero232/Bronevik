import type { ButtonProps } from '../Button';

export type IconButtonProps = Omit<ButtonProps, 'aria-label' | 'size' | 'title' | 'variant'> & {
  label: string;
};
