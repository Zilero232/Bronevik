import { useFormatter } from 'next-intl';

import type { PopularityCellProps } from './PopularityCell.types';

import s from './PopularityCell.module.scss';

export const PopularityCell = ({ battles, rank }: PopularityCellProps) => {
  const format = useFormatter();

  return (
    <span className={s.root}>
      <span className={s.battles}>{format.number(battles, { notation: 'compact' })}</span>
      {rank !== null && <span className={s.rank}>#{rank}</span>}
    </span>
  );
};
