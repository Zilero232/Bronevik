import { clsx } from 'clsx';

import type { BadgeProps } from './Badge.types';

import s from './Badge.module.scss';

export const Badge = ({ tone = 'neutral', shape = 'pill', className, children, ...props }: BadgeProps) => (
  <span className={clsx(s.root, s[tone], s[shape], className)} {...props}>
    {children}
  </span>
);
