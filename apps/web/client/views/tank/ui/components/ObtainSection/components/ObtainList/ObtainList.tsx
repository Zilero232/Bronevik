import type { ObtainListProps } from './ObtainList.types';

import s from './ObtainList.module.scss';

export const ObtainList = ({ title, rows }: ObtainListProps) => (
  <div className={s.root}>
    <h3 className={s.title}>{title}</h3>
    <ul className={s.list}>
      {rows.map(({ key, label, value }) => (
        <li key={key} className={s.row}>
          {label}
          <span className={s.value}>{value}</span>
        </li>
      ))}
    </ul>
  </div>
);
