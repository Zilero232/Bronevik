import { clsx } from 'clsx';
import { Inbox } from 'lucide-react';

import type { EmptyStateProps } from './EmptyState.types';

import { EmptyArt } from './components';

import s from './EmptyState.module.scss';

export const EmptyState = ({ title, description, icon, action, isCompact = false, titleAs: Title = 'h3', role, className }: EmptyStateProps) => (
  <div className={clsx(s.root, isCompact && s.compact, className)} role={role}>
    {isCompact ? (
      <span aria-hidden className={s.icon}>
        {icon ?? <Inbox size={16} />}
      </span>
    ) : (
      <EmptyArt icon={icon} />
    )}
    <div className={s.text}>
      {isCompact ? <p className={s.title}>{title}</p> : <Title className={s.title}>{title}</Title>}
      {description && !isCompact && <p className={s.description}>{description}</p>}
    </div>
    {action && <div className={s.action}>{action}</div>}
  </div>
);
