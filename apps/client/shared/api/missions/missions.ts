import type {
  MissionCampaigns,
  MissionGarage,
  MissionOperation,
  MissionPlan,
  MissionProgress,
  MissionProgressItem,
  MissionTanks,
  UpdateMissionProgressInput
} from '@otmetki/schemas';

import {
  missionCampaignsSchema,
  missionGarageSchema,
  missionOperationSchema,
  missionPlanSchema,
  missionProgressItemSchema,
  missionProgressSchema,
  missionTanksSchema
} from '@otmetki/schemas';

import type { MissionOperationInput, MissionPlanInput, MissionQuestInput, MissionTanksInput, SignalInput } from './missions.types';

import { api, SESSION_REQUEST } from '../http';
import { fromServer } from '../source';

export const getMissionCampaigns = ({ signal }: SignalInput): Promise<MissionCampaigns> =>
  fromServer(async () => missionCampaignsSchema.parse((await api.get('/missions', { signal })).data));

export const getMissionOperation = ({ campaign, operation, signal }: MissionOperationInput): Promise<MissionOperation> =>
  fromServer(async () => missionOperationSchema.parse((await api.get(`/missions/${campaign}/${operation}`, { signal })).data));

export const getMissionTanks = ({ questId, period, signal }: MissionTanksInput): Promise<MissionTanks> =>
  fromServer(async () => missionTanksSchema.parse((await api.get(`/missions/${questId}/tanks`, { params: { period }, signal })).data));

export const getMissionGarage = ({ questId, signal }: MissionQuestInput): Promise<MissionGarage> =>
  fromServer(async () => missionGarageSchema.parse((await api.get(`/me/missions/${questId}/garage`, { ...SESSION_REQUEST, signal })).data));

export const getMissionProgress = ({ signal }: SignalInput): Promise<MissionProgress> =>
  fromServer(async () => missionProgressSchema.parse((await api.get('/me/missions/progress', { ...SESSION_REQUEST, signal })).data));

export const updateMissionProgress = (input: UpdateMissionProgressInput): Promise<MissionProgressItem> =>
  fromServer(async () => missionProgressItemSchema.parse((await api.put('/me/missions/progress', input, SESSION_REQUEST)).data));

export const getMissionPlan = ({ operation, signal }: MissionPlanInput): Promise<MissionPlan> =>
  fromServer(async () => missionPlanSchema.parse((await api.get('/me/missions/plan', { ...SESSION_REQUEST, params: { operation }, signal })).data));
