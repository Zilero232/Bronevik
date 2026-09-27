'use client';

import { useFormatter } from 'next-intl';

import type { DateCellProps } from './DateCell.types';

import s from './DateCell.module.scss';

export const DateCell = ({ createdAt }: DateCellProps) => {
  const format = useFormatter();

  return <span className={s.root}>{format.dateTime(new Date(createdAt), { dateStyle: 'medium' })}</span>;
};
