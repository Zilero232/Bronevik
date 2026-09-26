import { clsx } from 'clsx';

import type { InboxHeaderProps } from './InboxHeader.types';

import s from './InboxHeader.module.scss';

export const InboxHeader = ({ title, count = 0, actions, className }: InboxHeaderProps) => (
  <header className={clsx(s.root, className)}>
    <h2 className={s.title}>
      {title}
      {count > 0 && <span className={s.count}>{count}</span>}
    </h2>
    {actions && <div className={s.actions}>{actions}</div>}
  </header>
);
