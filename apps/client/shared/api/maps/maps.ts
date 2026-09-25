import type { MapDetail, MapList } from '@bronevik/schemas';

import { mapDetailSchema, mapListSchema } from '@bronevik/schemas';

import type { MapDetailInput, MapListInput } from './maps.types';

import { api, orNotFound } from '../http';
import { fromSource } from '../source';
import { mockMap, mockMaps } from './maps.mock';

export const listMaps = ({ signal, ...query }: MapListInput): Promise<MapList> =>
  fromSource({
    signal,
    mock: () => mockMaps(query),
    fetch: async () => {
      const { data } = await api.get('/maps', { params: query, signal });

      return mapListSchema.parse(data);
    }
  });

export const getMap = ({ signal, idOrSlug }: MapDetailInput): Promise<MapDetail> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockMap(idOrSlug)),
    fetch: async () => {
      const { data } = await api.get(`/maps/${encodeURIComponent(idOrSlug)}`, { signal });

      return mapDetailSchema.parse(data);
    }
  });
