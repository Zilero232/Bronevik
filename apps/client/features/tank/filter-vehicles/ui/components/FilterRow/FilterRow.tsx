import type { FilterRowProps } from './FilterRow.types';

import s from './FilterRow.module.scss';

export const FilterRow = ({ label, children }: FilterRowProps) => (
  <div className={s.root}>
    <span className={s.label}>{label}</span>
    {children}
  </div>
);
