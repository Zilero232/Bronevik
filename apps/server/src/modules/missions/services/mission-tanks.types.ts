import type { MissionGarageState, ServerPeriod, SkillCohort } from '@otmetki/schemas';

import type { PlayerTank, TankServerStats } from '../../../../generated';

export type ServerStatsInput = {
  tankIds: number[];
  period: ServerPeriod;
  minBattles?: number;
};

export type ServerStatsResult = {
  cohort: SkillCohort;
  rows: TankServerStats[];
};

export type GarageTank = Pick<PlayerTank, 'battles' | 'inGarage' | 'tankId' | 'wins'>;

export type GarageState = {
  state: MissionGarageState;
  tanks: GarageTank[];
};
