import clsx from 'clsx';

import type { InputProps } from './Input.types';

import { Icon } from '../icon';

import s from './Input.module.scss';

export const Input = ({ variant = 'default', className, placeholder, value, icon, ...props }: InputProps) => (
  <span className={clsx(s.field, s[variant], className)}>
    <input className={clsx(s.input, icon && s.inputWithIcon)} type='text' value={value} {...props} />
    {icon && <Icon className={s.icon} name={icon} size={16} />}
    {placeholder && !value && (
      <span aria-hidden='true' className={clsx(s.placeholder, icon && s.placeholderWithIcon)}>
        {placeholder}
      </span>
    )}
  </span>
);
