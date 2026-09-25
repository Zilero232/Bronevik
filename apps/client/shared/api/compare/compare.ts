import type { PlayerComparison } from '@bronevik/schemas';

import { LIST_SEPARATOR, playerComparisonSchema } from '@bronevik/schemas';

import type { ComparePlayersInput } from './compare.types';

import { api } from '../http';
import { fromSource } from '../source';
import { mockComparison } from './compare.mock';

export const comparePlayers = ({ accountIds, signal }: ComparePlayersInput): Promise<PlayerComparison> =>
  fromSource({
    signal,
    mock: () => mockComparison(accountIds),
    fetch: async () =>
      playerComparisonSchema.parse((await api.get('/compare/players', { params: { accountIds: accountIds.join(LIST_SEPARATOR) }, signal })).data)
  });
