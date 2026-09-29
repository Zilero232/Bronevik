import type { StatsBlock } from '@otmetki/schemas';

import type { KeyFigureProps } from '@/ui-kit';

import type { StatsTrendKey } from '../../../lib/stats-view';

export type UseStatsTilesInput = {
  stats: StatsBlock;
  reference?: StatsBlock | null;
  trends?: Partial<Record<StatsTrendKey, number[]>>;
};

export type StatsTile = Omit<KeyFigureProps, 'className' | 'icon'> & {
  key: string;
};
