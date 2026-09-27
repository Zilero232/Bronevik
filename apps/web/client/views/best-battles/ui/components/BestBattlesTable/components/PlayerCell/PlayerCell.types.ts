import type { BestBattle } from '@/entities/battle/best-battle';

export type PlayerCellProps = {
  battle: Pick<BestBattle, 'nickname' | 'source'>;
};
