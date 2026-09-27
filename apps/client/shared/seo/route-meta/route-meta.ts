import { isNotFoundError } from '@/shared/api/source';

import type { RouteEntity, RouteEntityInput, RouteSlugsInput } from './route-meta.types';

export const routeEntity = async ({ key, load }: RouteEntityInput): Promise<RouteEntity> => {
  try {
    return { name: await load(), isFound: true };
  } catch (error) {
    return { name: decodeURIComponent(key), isFound: !isNotFoundError(error) };
  }
};

export const routeSlugs = async ({ load, fallback }: RouteSlugsInput) => {
  try {
    const values = await load();

    return values.length > 0 || fallback === undefined ? values : [fallback];
  } catch {
    return fallback === undefined ? [] : [fallback];
  }
};
