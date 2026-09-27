import type { IconCellProps } from './IconCell.types';

import s from './IconCell.module.scss';

export const IconCell = ({ title, name, children }: IconCellProps) => (
  <span className={s.cell} title={title}>
    {children}
    {name && <code className={s.name}>{name}</code>}
  </span>
);
