'use client';

import { useFormatter } from 'next-intl';

import { ratingValueTone } from '@/entities/player/stats';

import type { Wn8CellProps } from './Wn8Cell.types';

import s from './Wn8Cell.module.scss';

export const Wn8Cell = ({ value }: Wn8CellProps) => {
  const format = useFormatter();

  return value.value === null ? (
    <span className={s.root}>—</span>
  ) : (
    <span className={s.root} data-tone={ratingValueTone(value)}>
      {format.number(Math.round(value.value))}
    </span>
  );
};
