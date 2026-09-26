import { clsx } from 'clsx';

import type { SectionHeaderProps } from './SectionHeader.types';

import s from './SectionHeader.module.scss';

export const SectionHeader = ({ title, description, action, as: Heading = 'h2', className }: SectionHeaderProps) => (
  <header className={clsx(s.root, className)}>
    <div className={s.text}>
      <Heading className={s.title}>{title}</Heading>
      {description && <p className={s.description}>{description}</p>}
    </div>
    {action && <div className={s.action}>{action}</div>}
  </header>
);
