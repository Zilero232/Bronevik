'use client';

import type { DataTableCardsProps } from './DataTableCards.types';

import { DataTableCardsSkeleton } from '../DataTableCardsSkeleton';

import s from '../../DataTable.module.scss';

export const DataTableCards = <T,>({ rows, renderCard, isLoading, skeletonRows }: DataTableCardsProps<T>) =>
  isLoading ? (
    <DataTableCardsSkeleton count={skeletonRows} />
  ) : (
    <ul className={s.cards}>
      {rows.map((row) => (
        <li key={row.id} className={s.card}>
          {renderCard(row.original)}
        </li>
      ))}
    </ul>
  );
