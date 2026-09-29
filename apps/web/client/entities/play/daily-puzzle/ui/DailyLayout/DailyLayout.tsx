import { clsx } from 'clsx';

import type { DailyLayoutProps } from './DailyLayout.types';

import s from './DailyLayout.module.scss';

export const DailyLayout = ({ side, isWide = false, className, children, ...props }: DailyLayoutProps) => (
  <div {...props} className={clsx(s.root, className)} data-wide={isWide}>
    <aside className={s.side}>{side}</aside>
    <div className={s.main}>{children}</div>
  </div>
);
