import { clsx } from 'clsx';

import type { SpinnerProps } from './Spinner.types';

import s from './Spinner.module.scss';

export const Spinner = ({ size = 'md', label }: SpinnerProps) => (
  <span aria-hidden={label ? undefined : true} aria-label={label} className={clsx(s.root, s[size])} role={label ? 'status' : undefined} />
);
