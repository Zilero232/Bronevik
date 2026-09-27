import type { PlayerSummary } from '@otmetki/schemas';

import type { ValueCellProps } from '../ValueCell';

export type MetricCardProps = Pick<ValueCellProps, 'row'> & {
  players: PlayerSummary[];
};
