import { useFormatter } from 'next-intl';

import type { WrDiffCellProps } from './WrDiffCell.types';

import s from './WrDiffCell.module.scss';

export const WrDiffCell = ({ value }: WrDiffCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root} data-sign={Math.sign(value)}>
      {format.number(value, { maximumFractionDigits: 2, signDisplay: 'exceptZero' })}
    </span>
  );
};
