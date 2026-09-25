import type { TechTree } from '@bronevik/schemas';

import { techTreeSchema } from '@bronevik/schemas';

import type { TechTreeInput } from './tree.types';

import { api, orNotFound } from '../http';
import { fromSource } from '../source';
import { mockTree } from './tree.mock';

export const getTechTree = ({ signal, nation }: TechTreeInput): Promise<TechTree> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockTree(nation)),
    fetch: async () => {
      const { data } = await api.get(`/tree/${encodeURIComponent(nation)}`, { signal });

      return techTreeSchema.parse(data);
    }
  });
