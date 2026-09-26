'use client';

import { useFormatter } from 'next-intl';

import type { AmountCellProps } from './AmountCell.types';

import s from './AmountCell.module.scss';

export const AmountCell = ({ amount, currency }: AmountCellProps) => {
  const format = useFormatter();

  return <span className={s.root}>{format.number(amount, { style: 'currency', currency })}</span>;
};
