import type { DataTableToolbarProps } from './DataTableToolbar.types';

import s from '../../DataTable.module.scss';

export const DataTableToolbar = ({ summary, toolbar }: DataTableToolbarProps) => (
  <div className={s.toolbar}>
    <span className={s.summary}>{summary}</span>
    {toolbar && <div className={s.toolbarEnd}>{toolbar}</div>}
  </div>
);
