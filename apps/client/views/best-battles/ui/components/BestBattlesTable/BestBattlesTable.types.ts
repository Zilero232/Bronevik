import type { ReactNode } from 'react';

import type { BestBattle, BestBattleMetric } from '@/entities/battle/best-battle';

export type BestBattlesTableProps = {
  battles: BestBattle[];
  metric: BestBattleMetric;
  emptyState: ReactNode;
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};
