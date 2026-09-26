import type { PlayerComparison } from '@otmetki/schemas';

import { compareControllerComparePlayers } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { ComparePlayersInput } from './compare.types';

export const comparePlayers = ({ accountIds, signal }: ComparePlayersInput): Promise<PlayerComparison> =>
  fromSdk(() => compareControllerComparePlayers({ query: { accountIds }, signal }));
