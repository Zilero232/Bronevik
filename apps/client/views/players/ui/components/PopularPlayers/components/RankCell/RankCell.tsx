import type { RankCellProps } from './RankCell.types';

import s from './RankCell.module.scss';

export const RankCell = ({ rank }: RankCellProps) => (
  <span className={s.root} data-top={rank <= 3}>
    {rank}
  </span>
);
