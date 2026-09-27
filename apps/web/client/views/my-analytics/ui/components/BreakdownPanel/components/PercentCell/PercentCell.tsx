import { useFormatter } from 'next-intl';

import { percentText } from '@/shared/lib';

import type { PercentCellProps } from './PercentCell.types';

import s from './PercentCell.module.scss';

export const PercentCell = ({ value }: PercentCellProps) => {
  const format = useFormatter();

  return <span className={s.root}>{percentText({ format, value, digits: 1 })}</span>;
};
