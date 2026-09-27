import type { PlayerComparison, RatingPeriod } from '@otmetki/schemas';

import type { DataTableProps } from '@/ui-kit';

export type CompareTableProps = Pick<DataTableProps<PlayerComparison>, 'isLoading'> & {
  comparison: PlayerComparison | undefined;
  period: RatingPeriod;
};
