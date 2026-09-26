import type { RankCellProps } from './RankCell.types';

import s from './RankCell.module.scss';

export const RankCell = ({ rank }: RankCellProps) => (
  <span className={s.root} data-rank={rank <= 3 ? rank : undefined}>
    {rank}
  </span>
);
