import type { TankComparison } from '@bronevik/schemas';

import type { CompareTanksInput } from './tanks.types';

import { compareControllerCompareTanks } from '../generated';
import { listParam } from '../http';
import { fromSdk } from '../source';

export const compareTanks = ({ signal, tankIds }: CompareTanksInput): Promise<TankComparison> =>
  fromSdk(() => compareControllerCompareTanks({ query: { tankIds: listParam(tankIds) }, signal }));
