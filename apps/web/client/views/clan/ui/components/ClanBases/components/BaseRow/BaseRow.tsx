import type { BaseRowProps } from './BaseRow.types';

import s from './BaseRow.module.scss';

export const BaseRow = ({ label, isMuted = false, children }: BaseRowProps) => (
  <li className={s.root} data-muted={isMuted}>
    <span className={s.label}>{label}</span>
    <span className={s.values}>{children}</span>
  </li>
);
