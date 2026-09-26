'use client';

import { useFormatter } from 'next-intl';

import type { MarksCellProps } from './MarksCell.types';

import s from './MarksCell.module.scss';

export const MarksCell = ({ value }: MarksCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-gained={value > 0}>
      {value > 0 ? `+${format.number(value)}` : '—'}
    </span>
  );
};
