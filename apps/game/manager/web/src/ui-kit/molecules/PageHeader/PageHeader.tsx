import type { PageHeaderProps } from './PageHeader.types';

import s from './PageHeader.module.scss';

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <header className={s.root}>
    <div className={s.text}>
      <h1 className={s.title}>{title}</h1>
      {description && <p className={s.description}>{description}</p>}
    </div>
    {actions && <div className={s.actions}>{actions}</div>}
  </header>
);
