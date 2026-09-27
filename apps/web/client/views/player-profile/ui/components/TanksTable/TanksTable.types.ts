import type { PlayerTankRow } from '@otmetki/schemas';

import type { DataTableProps } from '@/ui-kit';

export type TanksTableProps = Pick<DataTableProps<PlayerTankRow>, 'isLoading'> & {
  rows: PlayerTankRow[];
};
