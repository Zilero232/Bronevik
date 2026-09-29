import type { UsageListProps } from './UsageList.types';

import s from './UsageList.module.scss';

export const UsageList = ({ title, children }: UsageListProps) => (
  <div className={s.root}>
    {title && <h4 className={s.title}>{title}</h4>}
    <ol className={s.list}>{children}</ol>
  </div>
);
