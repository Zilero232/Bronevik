'use client';

import { useFormatter } from 'next-intl';

import type { ThresholdCellProps } from './ThresholdCell.types';

import s from './ThresholdCell.module.scss';

export const ThresholdCell = ({ value, isKey = false }: ThresholdCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-empty={value === null} data-key={isKey}>
      {value === null ? '—' : format.number(value)}
    </span>
  );
};
