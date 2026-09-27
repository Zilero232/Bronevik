import type { MissionTanksQuery, UpdateMissionProgressInput } from '@otmetki/schemas';

import type { Mission, MissionBranch, MissionOperation } from '../../../generated';

export type MissionContext = {
  mission: Mission;
  branch: MissionBranch;
};

export type OperationRows = {
  operation: MissionOperation;
  branches: MissionBranch[];
  missions: Mission[];
};

export type OperationLookup = {
  gameVersionId: number;
  campaignId: number;
  operationId: number;
};

export type UserQuestInput = {
  userId: string;
  questId: number;
};

export type UserOperationInput = {
  userId: string;
  operationId: number;
};

export type NextMissionLine = {
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
