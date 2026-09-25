'use client';

import { Input as BaseInput } from '@base-ui/react/input';
import { clsx } from 'clsx';

import type { InputProps } from './Input.types';

import s from './Input.module.scss';

export const Input = ({ icon, trailing, size = 'md', isInvalid = false, className, wrapperClassName, ...props }: InputProps) => (
  <span className={clsx(s.root, s[size], wrapperClassName)} data-invalid={isInvalid}>
    {icon && (
      <span aria-hidden className={s.icon}>
        {icon}
      </span>
    )}
    <BaseInput aria-invalid={isInvalid || undefined} className={clsx(s.control, className)} {...props} />
    {trailing}
  </span>
);
