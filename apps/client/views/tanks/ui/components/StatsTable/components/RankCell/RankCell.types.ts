import type { TankServerStatsRow } from '@bronevik/schemas';
import type { Row, Table } from '@tanstack/react-table';

export type RankCellProps = {
  row: Row<TankServerStatsRow>;
  table: Table<TankServerStatsRow>;
};
