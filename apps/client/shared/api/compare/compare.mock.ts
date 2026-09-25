import type { PlayerComparison } from '@bronevik/schemas';

import { mockPlayerById, mockProfileOf } from '../players/mock';

export const mockComparison = (accountIds: number[]): PlayerComparison => ({
  players: accountIds.map((accountId) => mockProfileOf(mockPlayerById(accountId))),
  commonTankIds: []
});
