import type { TankServerStatsRow } from '@bronevik/schemas';

export type StatsSummary = {
  tanks: number;
  battles: number;
  strongest: TankServerStatsRow | undefined;
  mostPlayed: TankServerStatsRow | undefined;
};
