import type { ButtonProps } from './Button.types';

import { Spinner } from '../Spinner';
import { buttonVariants } from './Button.variants';

export const Button = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  isPending = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    aria-busy={isPending || undefined}
    className={buttonVariants({ variant, size, class: className })}
    disabled={disabled || isPending}
    type={type}
    {...props}
  >
    {isPending && <Spinner size='sm' />}
    {children}
  </button>
);
