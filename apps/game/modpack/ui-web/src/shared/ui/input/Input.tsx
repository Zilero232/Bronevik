import clsx from 'clsx';

import type { InputProps } from './Input.types';

import s from './Input.module.scss';

export const Input = ({ variant = 'default', className, ...props }: InputProps) => (
  <input className={clsx(s.input, s[variant], className)} type='text' {...props} />
);
