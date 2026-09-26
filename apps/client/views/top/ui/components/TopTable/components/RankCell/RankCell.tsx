import type { RankCellProps } from './RankCell.types';

import { TOP_BOARD } from '../../../../../config';

import s from './RankCell.module.scss';

export const RankCell = ({ rank }: RankCellProps) => (
  <span className={s.root} data-medal={TOP_BOARD.medals[rank - 1]}>
    {rank}
  </span>
);
