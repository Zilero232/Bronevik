import type { StatsBlock } from '@otmetki/schemas';

import type { KeyFigureProps } from '@/ui-kit';

export type StatsTrendKey = 'avgDamage' | 'winRate' | 'wn8';

export type UseStatsTilesInput = {
  stats: StatsBlock;
  reference?: StatsBlock | null;
  trends?: Partial<Record<StatsTrendKey, number[]>>;
};

export type StatsTile = Omit<KeyFigureProps, 'className' | 'icon'> & {
  key: string;
};
