'use client';

import type { DataTableCardsProps } from './DataTableCards.types';

import s from '../../DataTable.module.scss';

export const DataTableCards = <T,>({ rows, renderCard }: DataTableCardsProps<T>) => (
  <ul className={s.cards}>
    {rows.map((row) => (
      <li key={row.id} className={s.card}>
        {renderCard(row.original)}
      </li>
    ))}
  </ul>
);
