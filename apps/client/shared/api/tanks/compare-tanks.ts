import type { TankComparison } from '@bronevik/schemas';

import { tankComparisonSchema } from '@bronevik/schemas';

import type { CompareTanksInput } from './tanks.types';

import { api, joinList } from '../http';
import { fromSource } from '../source';
import { mockCompareTanks } from './compare-tanks.mock';

export const compareTanks = ({ signal, tankIds }: CompareTanksInput): Promise<TankComparison> =>
  fromSource({
    signal,
    mock: () => mockCompareTanks({ tankIds }),
    fetch: async () => {
      const { data } = await api.get('/compare/tanks', { params: { tankIds: joinList(tankIds) }, signal });

      return tankComparisonSchema.parse(data);
    }
  });
