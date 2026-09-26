import type { ResultListProps } from './ResultList.types';

import s from './ResultList.module.scss';

export const ResultList = ({ items }: ResultListProps) => (
  <dl className={s.root}>
    {items.map(({ key, label, value, tone = 'neutral' }) => (
      <div key={key} className={s.row} data-tone={tone}>
        <dt className={s.label}>{label}</dt>
        <dd className={s.value}>{value}</dd>
      </div>
    ))}
  </dl>
);
