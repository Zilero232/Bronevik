import type { MissionGarageState, MissionTanksQuery, ServerPeriod, SkillCohort, UpdateMissionProgressInput } from '@otmetki/schemas';

import type { Mission, MissionBranch, MissionOperation, PlayerTank, TankServerStats } from '../../../generated';

export type MissionContext = {
  mission: Mission;
  branch: MissionBranch;
};

export type OperationRows = {
  operation: MissionOperation;
  branches: MissionBranch[];
  missions: Mission[];
};

export type OperationLookup = Pick<MissionOperation, 'campaignId' | 'gameVersionId' | 'operationId'>;

export type UserQuestInput = {
  userId: string;
  questId: number;
};

export type UserOperationInput = {
  userId: string;
  operationId: number;
};

type NextMissionLine = {
  branchKey: string;
  title: string;
  condition: string | null;
};

export type NextMissions = {
  operationName: string;
  campaignId: number;
  operationId: number;
  missions: NextMissionLine[];
};

export type UpdateProgressInput = UpdateMissionProgressInput & {
  userId: string;
};

export type MissionTanksInput = MissionTanksQuery & {
  questId: number;
};

export type MissionVersion = {
  id: number;
  version: string;
};

export type ServerStatsInput = {
  tankIds: number[];
  period: ServerPeriod;
  minBattles?: number;
};

export type ServerStatsResult = {
  cohort: SkillCohort;
  rows: TankServerStats[];
};

type GarageTank = Pick<PlayerTank, 'battles' | 'inGarage' | 'tankId' | 'wins'>;

export type GarageState = {
  state: MissionGarageState;
  tanks: GarageTank[];
};
