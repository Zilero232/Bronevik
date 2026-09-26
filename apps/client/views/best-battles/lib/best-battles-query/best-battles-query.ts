import type { BestBattlesQuery } from '@/entities/battle/best-battle';

import type { BestBattlesState } from './best-battles-query.types';

import { BEST_BATTLES_VIEW } from '../../config';

export const toBestBattlesQuery = ({ period, metric, tank, map, medal }: BestBattlesState): BestBattlesQuery => ({
  period,
  metric,
  limit: BEST_BATTLES_VIEW.pageSize,
  ...(tank === null ? {} : { tankId: tank }),
  ...(map === null ? {} : { arenaId: map }),
  ...(medal === null ? {} : { medal })
});

export const hasBattleFilters = ({ tank, map, medal }: BestBattlesState): boolean => tank !== null || map !== null || medal !== null;
