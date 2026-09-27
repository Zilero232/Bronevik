import type { EmptyStateProps } from './EmptyState.types';

import s from './EmptyState.module.scss';

export const EmptyState = ({ title, hint, icon, action }: EmptyStateProps) => (
  <div className={s.root}>
    {icon && <span className={s.icon}>{icon}</span>}
    <p className={s.title}>{title}</p>
    {hint && <p className={s.hint}>{hint}</p>}
    {action}
  </div>
);
