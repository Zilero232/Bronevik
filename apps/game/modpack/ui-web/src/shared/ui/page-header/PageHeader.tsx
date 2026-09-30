import type { PageHeaderProps } from './PageHeader.types';

import { Icon } from '../icon';

import s from './PageHeader.module.scss';

export const PageHeader = ({ icon, title, hint, aside }: PageHeaderProps) => (
  <header className={s.header}>
    <span className={s.tile}>
      <Icon name={icon} size={22} tone='accent' />
    </span>
    <div className={s.titles}>
      <h2 className={s.title}>{title}</h2>
      {hint && <p className={s.hint}>{hint}</p>}
    </div>
    {aside && <div className={s.aside}>{aside}</div>}
  </header>
);
