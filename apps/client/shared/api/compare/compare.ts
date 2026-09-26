import type { PlayerComparison } from '@bronevik/schemas';

import type { ComparePlayersInput } from './compare.types';

import { compareControllerComparePlayers } from '../generated';
import { fromSdk } from '../source';

export const comparePlayers = ({ accountIds, signal }: ComparePlayersInput): Promise<PlayerComparison> =>
  fromSdk(() => compareControllerComparePlayers({ query: { accountIds }, signal }));
