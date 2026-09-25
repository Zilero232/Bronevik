import type { TankServerStatsRow, TankTrendPoint } from '@bronevik/schemas';
import type { LucideIcon } from 'lucide-react';

import type { ProgressTone } from '@/ui-kit';

export type StatTileKey = 'avgDamage' | 'avgFrags' | 'avgSpotted' | 'battles' | 'players' | 'survivalRate' | 'winRate' | 'winRateDiff';

export type StatTileConfig = {
  key: StatTileKey;
  icon: LucideIcon;
  unit?: 'percent' | 'pp';
  format: Intl.NumberFormatOptions;
  pick: (row: TankServerStatsRow) => number;
  tone: (row: TankServerStatsRow) => ProgressTone;
  trend?: (point: TankTrendPoint) => number | null;
};
