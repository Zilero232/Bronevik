import type { StatsBlock } from '@otmetki/schemas';

export type DashboardFiguresProps = {
  overall: StatsBlock;
  week: StatsBlock | null;
};
