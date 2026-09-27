import type { PlayerTankRow } from '@otmetki/schemas';

import type { DataTableProps } from '@/ui-kit';

import type { TanksFilterControls } from '../../../model/hooks';

export type TanksTableProps = Pick<DataTableProps<PlayerTankRow>, 'isLoading'> & {
  rows: PlayerTankRow[];
  filters: Pick<TanksFilterControls, 'isDirty' | 'reset'>;
};
