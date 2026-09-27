import { clsx } from 'clsx';

import type { IconButtonProps } from './IconButton.types';

import s from './IconButton.module.scss';

export const IconButton = ({ variant = 'ghost', size = 'md', isActive = false, type = 'button', className, children, ...props }: IconButtonProps) => (
  <button className={clsx(s.root, s[variant], s[size], className)} data-active={isActive} type={type} {...props}>
    {children}
  </button>
);
