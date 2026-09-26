import type { PlayerComparison } from '@otmetki/schemas';

import type { ComparePlayersInput } from './compare.types';

import { compareControllerComparePlayers } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const comparePlayers = ({ accountIds, signal }: ComparePlayersInput): Promise<PlayerComparison> =>
  fromSdk(() => compareControllerComparePlayers({ query: { accountIds }, signal }));
