import { describe, expect, it } from 'vitest';

import { NotFoundError } from '@/shared/api/source';

import { lookupRouteEntity, routeEntity, routeSlugs } from '../route-meta';

const fail = () => Promise.reject(new Error('down'));

describe('lookupRouteEntity', () => {
  it('returns the loaded name', async () => {
    await expect(lookupRouteEntity({ key: 'object-140', load: async () => 'Объект 140' })).resolves.toEqual({ name: 'Объект 140', isFound: true });
  });

  it('reports a missing entity', async () => {
    await expect(lookupRouteEntity({ key: 'nobody', load: () => Promise.reject(new NotFoundError('404')) })).resolves.toEqual({
      name: 'nobody',
      isFound: false
    });
  });

  it('rethrows a transient failure so the cache does not keep it', async () => {
    await expect(lookupRouteEntity({ key: 'object-140', load: fail })).rejects.toThrow('down');
  });
});

describe('routeEntity', () => {
  it('passes the lookup result through', async () => {
    await expect(routeEntity({ key: 'nobody', lookup: async (name) => ({ name, isFound: false }) })).resolves.toEqual({
      name: 'nobody',
      isFound: false
    });
  });

  it('falls back to the key and stays indexable when the API is down', async () => {
    await expect(routeEntity({ key: 'стример', lookup: fail })).resolves.toEqual({ name: 'стример', isFound: true });
  });
});

describe('routeSlugs', () => {
  it('returns the loaded slugs', async () => {
    await expect(routeSlugs({ fallback: 'x', load: async () => ['a', 'b'] })).resolves.toEqual(['a', 'b']);
  });

  it('falls back when the list is empty or fails', async () => {
    await expect(routeSlugs({ fallback: 'x', load: async () => [] })).resolves.toEqual(['x']);
    await expect(routeSlugs({ fallback: 'x', load: fail })).resolves.toEqual(['x']);
    await expect(routeSlugs({ load: fail })).resolves.toEqual([]);
  });
});
