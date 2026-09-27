import type { BestBattle, BestBattleMetric } from '@/entities/battle/best-battle';
import type { DataTableProps } from '@/ui-kit';

export type BestBattlesTableProps = Partial<Pick<DataTableProps<BestBattle>, 'emptyState' | 'isLoading'>> & {
  battles: BestBattle[];
  metric: BestBattleMetric;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
};
