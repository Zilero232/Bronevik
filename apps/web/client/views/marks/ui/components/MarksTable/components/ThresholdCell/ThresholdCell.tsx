'use client';

import { useFormatter } from 'next-intl';

import type { ThresholdCellProps } from './ThresholdCell.types';

import s from './ThresholdCell.module.scss';

export const ThresholdCell = ({ value, marks = null, isKey = false }: ThresholdCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-empty={value === null} data-key={isKey} data-marks={marks ?? undefined}>
      {value === null ? '—' : format.number(value)}
    </span>
  );
};
