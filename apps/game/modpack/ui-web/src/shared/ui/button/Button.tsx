import clsx from 'clsx';

import type { ButtonProps } from './Button.types';

import s from './Button.module.scss';

export const Button = ({ variant = 'default', size = 'default', className, ...props }: ButtonProps) => (
  <button className={clsx(s.button, s[variant], s[size], className)} type='button' {...props} />
);
