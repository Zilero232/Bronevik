import type { MissionCampaigns, MissionGarage, MissionOperation, MissionPlan, MissionProgress, MissionTanks } from '@otmetki/schemas';

import {
  missionCampaignsSchema,
  missionGarageSchema,
  missionOperationSchema,
  missionPlanSchema,
  missionProgressSchema,
  missionTanksSchema
} from '@otmetki/schemas';

import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

import type { MissionOperationInput, MissionPlanInput, MissionQuestInput, MissionTanksInput, SignalInput } from './missions.types';

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

export const getMissionPlan = ({ operation, signal }: MissionPlanInput): Promise<MissionPlan> =>
  fromServer(async () => missionPlanSchema.parse((await api.get('/me/missions/plan', { ...SESSION_REQUEST, params: { operation }, signal })).data));
