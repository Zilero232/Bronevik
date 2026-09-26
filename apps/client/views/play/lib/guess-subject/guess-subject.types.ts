import type { TankServerStatsRow, VehicleSummary } from '@otmetki/schemas';

export type GuessSubjectInput = {
  vehicle: VehicleSummary;
  detail: { serverStats: Pick<TankServerStatsRow, 'avgDamage' | 'cohort' | 'winRate'>[] } | undefined;
};
