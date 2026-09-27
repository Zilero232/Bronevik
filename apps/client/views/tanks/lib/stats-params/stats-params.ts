import type { TankStatsParams } from '../../api';
import type { StatsParamsInput } from './stats-params.types';

import { TANKS_VIEW } from '../../config';

export const statsParams = ({ state: { period, cohort, statuses, roles, difficulties }, vehicle }: StatsParamsInput): TankStatsParams => ({
  period,
  cohort,
  ...vehicle,
  statuses,
  roles,
  difficulties,
  limit: TANKS_VIEW.statsLimit
});
