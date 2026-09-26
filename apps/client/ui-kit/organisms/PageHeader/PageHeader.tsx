import { clsx } from 'clsx';

import type { PageHeaderProps } from './PageHeader.types';

import { Breadcrumbs } from './components';

import s from './PageHeader.module.scss';

export const PageHeader = ({ title, description, breadcrumbs, meta, actions, aside, children, className }: PageHeaderProps) => (
  <header className={clsx(s.root, className)}>
    <div className={s.main}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <div className={s.titleRow}>
        <h1 className={s.title}>{title}</h1>
        {meta && <div className={s.meta}>{meta}</div>}
      </div>
      {description && <p className={s.description}>{description}</p>}
    </div>
    {actions && <div className={s.actions}>{actions}</div>}
    {aside && <div className={s.aside}>{aside}</div>}
    {children && <div className={s.body}>{children}</div>}
  </header>
);
