import type { RankCellProps } from './RankCell.types';

import s from './RankCell.module.scss';

export const RankCell = ({ row, table }: RankCellProps) => <span className={s.root}>{table.getRowModel().rows.indexOf(row) + 1}</span>;
