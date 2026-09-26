import type { TankServerStatsRow, VehicleSummary } from '@bronevik/schemas';

export type GuessSubjectInput = {
  vehicle: VehicleSummary;
  detail: { serverStats: Pick<TankServerStatsRow, 'avgDamage' | 'cohort' | 'winRate'>[] } | undefined;
};
