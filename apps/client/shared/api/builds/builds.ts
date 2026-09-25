import type { BuildOptions, LoadoutResult, PopularBuilds } from '@bronevik/schemas';

import { buildOptionsSchema, loadoutResultSchema, popularBuildsSchema } from '@bronevik/schemas';

import type { BuildOptionsInput, CalculateLoadoutInput, PopularBuildsInput } from './builds.types';

import { api, orNotFound } from '../http';
import { fromSource } from '../source';
import { BUILD_REQUEST } from './builds.constants';
import { mockBuildOptions, mockLoadout, mockPopularBuilds } from './mock';

export const getBuildOptions = ({ signal, tankId }: BuildOptionsInput): Promise<BuildOptions> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockBuildOptions(tankId)),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${tankId}/build-options`, { signal });

      return buildOptionsSchema.parse(data);
    }
  });

export const calculateLoadout = ({ signal, tankId, request }: CalculateLoadoutInput): Promise<LoadoutResult> =>
  fromSource({
    signal,
    mock: () => orNotFound(mockLoadout({ tankId, request })),
    fetch: async () => {
      const { data } = await api.post(`/tanks/${tankId}/loadout`, request, { signal });

      return loadoutResultSchema.parse(data);
    }
  });

export const listPopularBuilds = ({ signal, tankId, limit = BUILD_REQUEST.popularLimit }: PopularBuildsInput): Promise<PopularBuilds> =>
  fromSource({
    signal,
    mock: () => mockPopularBuilds({ tankId, limit }),
    fetch: async () => {
      const { data } = await api.get(`/tanks/${tankId}/builds/popular`, { params: { limit }, signal });

      return popularBuildsSchema.parse(data);
    }
  });
