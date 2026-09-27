import type { StatusFactProps } from './StatusFact.types';

import s from './StatusFact.module.scss';

export const StatusFact = ({ label, value }: StatusFactProps) => (
  <div className={s.root}>
    <dt className={s.label}>{label}</dt>
    <dd className={s.value}>{value}</dd>
  </div>
);
