import clsx from 'clsx';

import type { BadgeProps } from './Badge.types';

import { Icon } from '../icon';

import s from './Badge.module.scss';

export const Badge = ({ tone = 'default', icon, children }: BadgeProps) => (
  <span className={clsx(s.badge, s[tone])}>
    {icon && <Icon className={s.icon} name={icon} size={11} tone={tone === 'gold' ? 'contrast' : tone === 'accent' ? 'accent' : 'muted'} />}
    <span className={s.text}>{children}</span>
  </span>
);
