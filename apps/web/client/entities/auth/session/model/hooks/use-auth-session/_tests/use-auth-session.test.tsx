import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import type { AuthSession } from '../../../../api';

import * as authApi from '../../../../api/auth/auth';
import { useAuthSession, useSignOut } from '../use-auth-session';

vi.hoisted(() => vi.resetModules());

const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Grom', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: 42
};

const USER_SCOPED_KEY = [...QUERY_KEYS.userScoped[0], 'favorites'];
const PUBLIC_KEY = ['tanks', 'list'];

const createClient = () => new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

const wrap =
  (client: QueryClient) =>
  ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

describe('useAuthSession', () => {
  it('returns the signed-in session once loaded', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockResolvedValue(SESSION);

    const { result } = renderHook(() => useAuthSession(), { wrapper: wrap(createClient()) });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toEqual(SESSION);
    expect(result.current.error).toBeNull();
  });

  it('reports a guest as a settled null session', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockResolvedValue(null);

    const { result } = renderHook(() => useAuthSession(), { wrapper: wrap(createClient()) });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toBeNull();
  });

  it('surfaces a failed session lookup without retrying it', async () => {
    const lookup = vi.spyOn(authApi, 'getAuthSession').mockRejectedValue(new Error('auth down'));

    const { result } = renderHook(() => useAuthSession(), { wrapper: wrap(createClient()) });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(lookup).toHaveBeenCalledTimes(1);
  });

  it('stays pending with no data while rendering on the server, even with a cached session', () => {
    const client = createClient();

    client.setQueryData(QUERY_KEYS.auth.session, SESSION);

    const Probe = () => {
      const { data, isPending } = useAuthSession();

      return `${String(isPending)}:${data === undefined ? 'none' : 'data'}`;
    };

    expect(renderToString(createElement(QueryClientProvider, { client }, createElement(Probe)))).toBe('true:none');
  });
});

describe('useSignOut', () => {
  it('clears the session and every user-scoped query but keeps public data', async () => {
    vi.spyOn(authApi, 'signOut').mockResolvedValue(undefined);
    const client = createClient();

    client.setQueryData(QUERY_KEYS.auth.session, SESSION);
    client.setQueryData(USER_SCOPED_KEY, ['tank']);
    client.setQueryData(PUBLIC_KEY, ['tank']);

    const { result } = renderHook(() => useSignOut(), { wrapper: wrap(client) });

    await act(() => result.current.mutateAsync());

    expect(client.getQueryData(QUERY_KEYS.auth.session)).toBeNull();
    expect(client.getQueryData(USER_SCOPED_KEY)).toBeUndefined();
    expect(client.getQueryData(PUBLIC_KEY)).toEqual(['tank']);
  });

  it('keeps the session when signing out fails', async () => {
    vi.spyOn(authApi, 'signOut').mockRejectedValue(new Error('auth down'));
    const client = createClient();

    client.setQueryData(QUERY_KEYS.auth.session, SESSION);

    const { result } = renderHook(() => useSignOut(), { wrapper: wrap(client) });

    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined);
    });

    expect(client.getQueryData(QUERY_KEYS.auth.session)).toEqual(SESSION);
  });
});
