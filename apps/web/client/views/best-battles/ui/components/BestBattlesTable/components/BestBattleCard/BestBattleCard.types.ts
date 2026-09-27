import type { BestBattle } from '@/entities/battle/best-battle';

import type { BestBattlesTableProps } from '../../BestBattlesTable.types';

export type BestBattleCardProps = Pick<BestBattlesTableProps, 'metric'> & {
  battle: BestBattle;
};
