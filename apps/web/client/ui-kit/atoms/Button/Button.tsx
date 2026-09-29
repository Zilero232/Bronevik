import type { ButtonProps } from './Button.types';

import { buttonVariants } from './Button.variants';

export const Button = ({ variant, size, block, shine, type = 'button', className, children, ...props }: ButtonProps) => (
  <button className={buttonVariants({ variant, size, block, shine, class: className })} type={type} {...props}>
    {children}
  </button>
);
