import { AnimatedCrosshair } from '@bronevik/icons';
import { clsx } from 'clsx';

import type { EmptyStateProps } from './EmptyState.types';

import s from './EmptyState.module.scss';

export const EmptyState = ({ title, description, icon, action, code, className }: EmptyStateProps) => (
  <div className={clsx(s.root, className)}>
    <div aria-hidden className={s.scope}>
      <span className={s.rings} />
      <span className={s.icon}>{icon ?? <AnimatedCrosshair size={40} strokeWidth={1.5} />}</span>
    </div>
    {code && <span className={s.code}>{code}</span>}
    <h3 className={s.title}>{title}</h3>
    {description && <p className={s.description}>{description}</p>}
    {action && <div className={s.action}>{action}</div>}
  </div>
);
