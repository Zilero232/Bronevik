import { clsx } from 'clsx';

import type { SectionHeaderProps } from './SectionHeader.types';

import s from './SectionHeader.module.scss';

export const SectionHeader = ({ title, description, action, count, variant = 'default', as: Heading = 'h2', className }: SectionHeaderProps) => (
  <header className={clsx(s.root, s[variant], className)}>
    <div className={s.text}>
      <Heading className={s.title}>
        {title}
        {count !== undefined && <span className={s.count}>{count}</span>}
      </Heading>
      {description && <p className={s.description}>{description}</p>}
    </div>
    {action && <div className={s.action}>{action}</div>}
  </header>
);
