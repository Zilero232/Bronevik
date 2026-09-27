import { clsx } from 'clsx';

import type { TextInputProps } from './TextInput.types';

import s from './TextInput.module.scss';

export const TextInput = ({ className, type = 'text', ...props }: TextInputProps) => (
  <input className={clsx(s.root, className)} type={type} {...props} />
);
