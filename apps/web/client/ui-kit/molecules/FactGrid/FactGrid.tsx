import type { FactGridProps } from './FactGrid.types';

import s from './FactGrid.module.scss';

export const FactGrid = ({ items }: FactGridProps) => (
  <dl className={s.root}>
    {items.map(({ id, label, value }) => (
      <div key={id} className={s.fact}>
        <dt className={s.label}>{label}</dt>
        <dd className={s.value}>{value}</dd>
      </div>
    ))}
  </dl>
);
