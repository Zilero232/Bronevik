import type { QueryClient } from '@tanstack/react-query';

import { cacheLife } from 'next/cache';
import { describe, expect, it, vi } from 'vitest';

import { prefetchState } from '../prefetch-state';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife: vi.fn() }));

const clanQuery = { queryKey: ['clan', 'RED'], queryFn: () => Promise.resolve({ tag: 'RED' }) };
const membersQuery = { queryKey: ['clan', 'RED', 'members'], queryFn: () => Promise.resolve([{ nickname: 'Tanker' }]) };

describe('prefetchState', () => {
  it('dehydrates every query the page fetched', async () => {
    const state = await prefetchState((client) => [client.fetchQuery(clanQuery), client.fetchQuery(membersQuery)]);

    expect(state?.queries.map((query) => [query.queryKey, query.state.data])).toEqual([
      [clanQuery.queryKey, { tag: 'RED' }],
      [membersQuery.queryKey, [{ nickname: 'Tanker' }]]
    ]);
  });

  it('returns no state when a fetch fails, so the page loads on the client and the build never needs the API', async () => {
    const missing = { queryKey: ['clan', 'NONE'], queryFn: () => Promise.reject(new Error('not found')) };

    await expect(prefetchState((client) => [client.fetchQuery(clanQuery), client.fetchQuery(missing)])).resolves.toBeNull();
    expect(cacheLife).toHaveBeenCalledWith('seconds');
  });

  it('never retries a failed fetch on the server', async () => {
    const queryFn = vi.fn(() => Promise.reject(new Error('down')));

    await expect(prefetchState((client) => [client.fetchQuery({ queryKey: ['down'], queryFn })])).resolves.toBeNull();
    expect(queryFn).toHaveBeenCalledOnce();
  });

  it('starts every request from an empty cache so one visitor never sees another visitor’s data', async () => {
    const clients: QueryClient[] = [];

    await prefetchState((client) => {
      clients.push(client);

      return [client.fetchQuery(clanQuery)];
    });

    const state = await prefetchState((client) => {
      clients.push(client);

      return [];
    });

    expect(clients[0]).not.toBe(clients[1]);
    expect(state?.queries).toEqual([]);
  });
});
