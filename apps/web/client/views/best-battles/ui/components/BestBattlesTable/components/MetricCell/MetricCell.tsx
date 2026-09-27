'use client';

import { useFormatter } from 'next-intl';

import type { MetricCellProps } from './MetricCell.types';

import s from './MetricCell.module.scss';

export const MetricCell = ({ value, isSecondary = false }: MetricCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-secondary={isSecondary}>
      {value === null ? '—' : format.number(value)}
    </span>
  );
};
