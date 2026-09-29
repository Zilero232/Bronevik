import type { ButtonProps } from '@/ui-kit';

export type LestaIdLinkProps = Pick<ButtonProps, 'block' | 'className' | 'size' | 'variant'> & {
  href?: string;
  label: string;
};
