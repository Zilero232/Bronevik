import type { PlayerRankCellProps } from './PlayerRankCell.types';

import s from './PlayerRankCell.module.scss';

export const PlayerRankCell = ({ rank }: PlayerRankCellProps) => (
  <span className={s.root} data-top={rank <= 3 || undefined}>
    {rank}
  </span>
);
