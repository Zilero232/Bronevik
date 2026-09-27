import { useFormatter } from 'next-intl';

import type { NumberCellProps } from './NumberCell.types';

import s from './NumberCell.module.scss';

export const NumberCell = ({ value }: NumberCellProps) => {
  const format = useFormatter();

  return <span className={s.root}>{value === null ? '—' : format.number(value, { maximumFractionDigits: 0 })}</span>;
};
