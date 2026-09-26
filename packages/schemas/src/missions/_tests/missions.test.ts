import { describe, expect, it } from 'vitest';

import { MISSION_TANKS_QUERY } from '../missions.constants';
import { missionOperationParamsSchema, missionTanksQuerySchema, updateMissionProgressSchema } from '../missions.schemas';

describe('missions schemas', () => {
  it('coerces route params and defaults the tank query', () => {
    expect(missionOperationParamsSchema.parse({ campaign: '1', operation: '4' })).toEqual({ campaign: 1, operation: 4 });
    expect(missionTanksQuerySchema.parse({})).toEqual({ period: MISSION_TANKS_QUERY.defaultPeriod, limit: MISSION_TANKS_QUERY.defaultLimit });
  });

  it('refuses a progress update without a mission id', () => {
    expect(updateMissionProgressSchema.safeParse({ done: true, honors: false }).success).toBe(false);
  });
});
