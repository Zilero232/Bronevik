import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import type { buttonVariants } from './Button.variants';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<'button'> & {
  [Key in keyof ButtonVariantProps]?: NonNullable<ButtonVariantProps[Key]>;
};
