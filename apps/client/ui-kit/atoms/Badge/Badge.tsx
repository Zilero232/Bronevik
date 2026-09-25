import { clsx } from 'clsx';

import type { BadgeProps } from './Badge.types';

import s from './Badge.module.scss';

export const Badge = ({ tone = 'neutral', className, children, ...props }: BadgeProps) => (
  <span className={clsx(s.root, s[tone], className)} {...props}>
    {children}
  </span>
);
