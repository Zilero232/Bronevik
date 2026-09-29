import clsx from 'clsx';

import type { MiniBarProps } from './MiniBar.types';

import { barFill } from '../../../lib/hud-bar';

import s from './MiniBar.module.scss';

export const MiniBar = ({ value, max, width, height, tone }: MiniBarProps) => (
  <div className={s.track} style={{ width: `${width}rem`, height: `${height}rem` }}>
    <div className={clsx(s.fill, s[tone])} style={{ width: `${barFill({ value, max, width })}rem`, height: `${height}rem` }} />
  </div>
);
