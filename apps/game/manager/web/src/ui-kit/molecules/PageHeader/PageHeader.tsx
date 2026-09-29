import type { PageHeaderProps } from './PageHeader.types';

import s from './PageHeader.module.scss';

export const PageHeader = ({ title, description, help, actions }: PageHeaderProps) => (
  <header className={s.root}>
    <div className={s.text}>
      <div className={s.titleRow}>
        <h1 className={s.title}>{title}</h1>
        {help}
      </div>
      {description && <p className={s.description}>{description}</p>}
    </div>
    {actions && <div className={s.actions}>{actions}</div>}
  </header>
);
