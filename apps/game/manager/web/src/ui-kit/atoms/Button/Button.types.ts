import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { buttonVariants } from './Button.variants';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<'button'> & {
  variant?: NonNullable<ButtonVariantProps['variant']>;
  size?: NonNullable<ButtonVariantProps['size']>;
  isPending?: boolean;
};
