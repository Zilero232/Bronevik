import type { TankServerStatsRow } from '@otmetki/schemas';

export type StatsSummary = {
  tanks: number;
  battles: number;
  strongest: TankServerStatsRow | undefined;
  mostPlayed: TankServerStatsRow | undefined;
  leaders: TankServerStatsRow[];
};
