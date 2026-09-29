import { vehicleQuery, vehicleTraitQuery } from '@/features/tank/filter-vehicles';

import type { TankStatsQueryInput } from '../../api';
import type { StatsParamsInput } from './stats-params.types';

import { TANKS_VIEW } from '../../config';

export const statsParams = ({ state: { period, cohort, mode, statuses, difficulties, top }, filters }: StatsParamsInput): TankStatsQueryInput => ({
  period,
  cohort,
  mode,
  ...vehicleQuery(filters),
  ...vehicleTraitQuery(filters),
  statuses,
  difficulties,
  ...(top ? TANKS_VIEW.top : { limit: TANKS_VIEW.statsLimit })
});
