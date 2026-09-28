'use client';

import { times } from 'remeda';

import type { DataTableCardsProps } from './DataTableCards.types';

import { Skeleton } from '../../../../atoms';
import { DATA_TABLE } from '../../DataTable.constants';

import s from '../../DataTable.module.scss';

export const DataTableCards = <T,>({ rows, renderCard, isLoading }: DataTableCardsProps<T>) => (
  <ul aria-busy={isLoading} className={s.cards}>
    {isLoading
      ? times(DATA_TABLE.skeletonRows, (index) => (
          <li key={index} className={s.card}>
            <Skeleton height={DATA_TABLE.skeletonCardHeight} shape='block' />
          </li>
        ))
      : rows.map((row) => (
          <li key={row.id} className={s.card}>
            {renderCard(row.original)}
          </li>
        ))}
  </ul>
);
