import { useFormatter } from 'next-intl';

import type { WrDiffCellProps } from './WrDiffCell.types';

import s from './WrDiffCell.module.scss';

const SCALE = 5;

export const WrDiffCell = ({ value }: WrDiffCellProps) => {
  const format = useFormatter();

  const width = `${Math.min(Math.abs(value) / SCALE, 1) * 50}%`;

  return (
    <span className={s.root} data-sign={value >= 0 ? 'plus' : 'minus'}>
      <span aria-hidden className={s.track}>
        <span className={s.bar} style={{ width }} />
      </span>
      <span className={s.value}>{format.number(value, { maximumFractionDigits: 2, signDisplay: 'exceptZero' })}</span>
    </span>
  );
};
