import type { MissionProgressItem, UpdateMissionProgressInput } from '@otmetki/schemas';

import { missionProgressItemSchema } from '@otmetki/schemas';

import { api, SESSION_REQUEST } from '@/shared/api/http';
import { fromServer } from '@/shared/api/source';

export const updateMissionProgress = (input: UpdateMissionProgressInput): Promise<MissionProgressItem> =>
  fromServer(async () => missionProgressItemSchema.parse((await api.put('/me/missions/progress', input, SESSION_REQUEST)).data));
