import { clsx } from 'clsx';
import { Inbox } from 'lucide-react';

import type { EmptyStateProps } from './EmptyState.types';

import s from './EmptyState.module.scss';

export const EmptyState = ({ title, description, icon, action, isCompact = false, role, className }: EmptyStateProps) => (
  <div className={clsx(s.root, isCompact && s.compact, className)} role={role}>
    <span aria-hidden className={s.icon}>
      {icon ?? <Inbox size={16} />}
    </span>
    <div className={s.text}>
      {isCompact ? <p className={s.title}>{title}</p> : <h3 className={s.title}>{title}</h3>}
      {description && !isCompact && <p className={s.description}>{description}</p>}
    </div>
    {action && <div className={s.action}>{action}</div>}
  </div>
);
