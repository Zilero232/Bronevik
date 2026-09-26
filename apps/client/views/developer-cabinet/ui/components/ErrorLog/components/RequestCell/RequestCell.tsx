import type { RequestCellProps } from './RequestCell.types';

import s from './RequestCell.module.scss';

export const RequestCell = ({ method, path }: RequestCellProps) => (
  <span className={s.root}>
    <span className={s.method}>{method}</span>
    <code className={s.path}>{path}</code>
  </span>
);
