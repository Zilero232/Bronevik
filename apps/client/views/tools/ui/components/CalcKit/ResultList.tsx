import type { ResultListProps } from './CalcKit.types';

import s from './CalcKit.module.scss';

export const ResultList = ({ items }: ResultListProps) => (
  <dl className={s.list}>
    {items.map(({ key, label, value, tone }) => (
      <div key={key} className={s.listRow} data-tone={tone}>
        <dt className={s.listLabel}>{label}</dt>
        <dd className={s.listValue}>{value}</dd>
      </div>
    ))}
  </dl>
);
