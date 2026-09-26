import type { TankComparison } from '@otmetki/schemas';

import type { CompareTanksInput } from './tanks.types';

import { compareControllerCompareTanks } from '@/shared/api/generated';
import { listParam } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const compareTanks = ({ signal, tankIds }: CompareTanksInput): Promise<TankComparison> =>
  fromSdk(() => compareControllerCompareTanks({ query: { tankIds: listParam(tankIds) }, signal }));
