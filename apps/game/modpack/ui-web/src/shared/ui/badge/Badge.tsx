import clsx from 'clsx';

import type { BadgeProps } from './Badge.types';

import s from './Badge.module.scss';

export const Badge = ({ tone = 'default', children }: BadgeProps) => <span className={clsx(s.badge, s[tone])}>{children}</span>;
