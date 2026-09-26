import type { TankServerStatsRow } from '@otmetki/schemas';
import type { Row, Table } from '@tanstack/react-table';

export type RankCellProps = {
  row: Row<TankServerStatsRow>;
  table: Table<TankServerStatsRow>;
};
