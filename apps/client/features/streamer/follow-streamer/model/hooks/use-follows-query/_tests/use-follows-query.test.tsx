import type { StreamerFollow } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';

import { getMyFollows } from '../../../../api';
import { useFollowsQuery } from '../use-follows-query';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('../../../../api', () => ({ getMyFollows: vi.fn() }));

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };

const FOLLOWS: StreamerFollow[] = [{ slug: 'jove', displayName: 'Jove', tankId: null, isLive: false, createdAt: '2026-01-01T00:00:00.000Z' }];

const createWrapper = (seed: (client: QueryClient) => void) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  seed(client);

  return ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const withSession = (session: AuthSession) => (client: QueryClient) => client.setQueryData(QUERY_KEYS.auth.session, session);

const withPendingSession = (client: QueryClient) => client.setQueryDefaults(QUERY_KEYS.auth.session, { enabled: false });

describe('useFollowsQuery', () => {
  it('stays pending while the session is still unknown', () => {
    const { result } = renderHook(() => useFollowsQuery(), { wrapper: createWrapper(withPendingSession) });

    expect(result.current.isPending).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(getMyFollows).not.toHaveBeenCalled();
  });

  it('settles a guest immediately with no follows and no request', () => {
    const { result } = renderHook(() => useFollowsQuery(), { wrapper: createWrapper(withSession(null)) });

    expect(result.current.isPending).toBe(false);
    expect(result.current.follows).toEqual([]);
    expect(getMyFollows).not.toHaveBeenCalled();
  });

  it('stays pending for a signed-in user until their follows arrive', async () => {
    vi.mocked(getMyFollows).mockResolvedValue(FOLLOWS);
    const { result } = renderHook(() => useFollowsQuery(), { wrapper: createWrapper(withSession(SESSION)) });

    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.follows).toEqual(FOLLOWS);
  });
});
