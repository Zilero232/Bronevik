import { QueryObserver } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { isServer } from '@/shared/lib/env';

import { getQueryClient } from '../query-client';

vi.mock('@/shared/lib/env', () => ({ isServer: vi.fn(() => false) }));

const KEY = ['pulse'];

const renderOnServer = () => {
  vi.mocked(isServer).mockReturnValue(true);

  const client = getQueryClient();

  client.setQueryData(KEY, { trackedPlayers: 541 });

  return client;
};

describe('getQueryClient', () => {
  afterEach(() => {
    vi.mocked(isServer).mockReturnValue(false);
    vi.restoreAllMocks();
  });

  it('gives every server render its own client', () => {
    vi.mocked(isServer).mockReturnValue(true);

    expect(getQueryClient()).not.toBe(getQueryClient());
  });

  it('shares one client in the browser', () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });

  it('never reads the clock while rendering hydrated data on the server, so a prerender is never cut short', () => {
    const client = renderOnServer();
    const now = vi.spyOn(Date, 'now');
    const observer = new QueryObserver(client, { queryKey: KEY, staleTime: 60_000 });

    const result = observer.getOptimisticResult(client.defaultQueryOptions({ queryKey: KEY, staleTime: 60_000 }));

    expect(result.data).toEqual({ trackedPlayers: 541 });
    expect(result.isStale).toBe(false);
    expect(result.isFetching).toBe(false);
    expect(now).not.toHaveBeenCalled();
  });

  it('keeps real staleness in the browser', () => {
    const client = getQueryClient();

    expect(client.defaultQueryOptions({ queryKey: KEY, staleTime: 60_000 }).staleTime).toBe(60_000);
  });
});
