import { clsx } from 'clsx';

import type { LiveLampProps } from './LiveLamp.types';

import s from './LiveLamp.module.scss';

export const LiveLamp = ({ label, isLive = true, size = 'md', className }: LiveLampProps) => (
  <span className={clsx(s.root, s[size], className)} data-live={isLive}>
    <span aria-hidden className={s.dot} />
    {label}
  </span>
);
