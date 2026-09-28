import { cacheLife } from 'next/cache';

import { isNotFoundError } from '@/shared/api/source';

import type { RouteEntity, RouteEntityInput, RouteLookupInput, RouteSlugsInput } from './route-meta.types';

export const lookupRouteEntity = async ({ key, load }: RouteEntityInput): Promise<RouteEntity> => {
  try {
    return { name: await load(), isFound: true };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { name: key, isFound: false };
    }

    cacheLife('seconds');

    return { name: key, isFound: true };
  }
};

export const lookupRouteMeta = async <T>(load: () => Promise<T>): Promise<T | null> => {
  try {
    return await load();
  } catch (error) {
    if (!isNotFoundError(error)) {
      cacheLife('seconds');
    }

    return null;
  }
};

export const routeEntity = async ({ key, lookup }: RouteLookupInput): Promise<RouteEntity> => {
  try {
    return await lookup(key);
  } catch {
    return { name: key, isFound: true };
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
