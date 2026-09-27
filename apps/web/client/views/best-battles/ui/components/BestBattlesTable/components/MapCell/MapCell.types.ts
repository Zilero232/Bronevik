import type { BestBattle } from '@/entities/battle/best-battle';

export type MapCellProps = {
  battle: Pick<BestBattle, 'arena' | 'playedAt' | 'result'>;
};
