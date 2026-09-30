import { cacheLife } from 'next/cache';
import { connection } from 'next/server';

import { UNAVAILABLE_CACHE_LIFE } from '@/shared/api/query-client';
import { isNotFoundError } from '@/shared/api/source';

import type { RouteEntity, RouteEntityInput, RouteLookup, RouteLookupInput, RouteSlugsInput } from './route-meta.types';

export const lookupRouteEntity = async ({ key, load }: RouteEntityInput): Promise<RouteLookup> => {
  try {
    return { name: await load(), isFound: true, isAvailable: true };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { name: key, isFound: false, isAvailable: true };
    }

    cacheLife(UNAVAILABLE_CACHE_LIFE);

    return { name: key, isFound: true, isAvailable: false };
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

const settledLookup = async ({ key, lookup }: RouteLookupInput): Promise<RouteLookup> => {
  try {
    return await lookup(key);
  } catch {
    return { name: key, isFound: true, isAvailable: false };
  }
};

export const routeEntity = async (input: RouteLookupInput): Promise<RouteEntity> => {
  const { name, isFound, isAvailable } = await settledLookup(input);

  if (!isAvailable) {
    await connection();
  }

  return { name, isFound };
};

export const routeSlugs = async ({ load, fallback }: RouteSlugsInput) => {
  try {
    const values = await load();

    return values.length > 0 || fallback === undefined ? values : [fallback];
  } catch {
    return fallback === undefined ? [] : [fallback];
  }
};
