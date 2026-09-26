import type { ParamRowProps } from './ParamRow.types';

import s from './ParamRow.module.scss';

export const ParamRow = ({ row }: ParamRowProps) => (
  <div className={s.root}>
    <dt className={s.label}>{row.label}</dt>
    <dd className={s.value}>
      {row.value}
      {row.unit && <span className={s.unit}>{row.unit}</span>}
    </dd>
    {row.share !== null && (
      <span aria-hidden className={s.track}>
        <span className={s.bar} style={{ width: `${row.share * 100}%` }} />
      </span>
    )}
  </div>
);
