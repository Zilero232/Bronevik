import type { StatsBlock } from '@otmetki/schemas';

export type UseDashboardFiguresInput = {
  overall: StatsBlock;
  week: StatsBlock | null;
};
