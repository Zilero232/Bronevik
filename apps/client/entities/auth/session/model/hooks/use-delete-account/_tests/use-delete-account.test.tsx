import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session/api';

import * as authApi from '@/entities/auth/session/api/auth/auth';
import { QUERY_KEYS } from '@/shared/constants';

import { useDeleteAccount } from '../use-delete-account';

vi.hoisted(() => vi.resetModules());

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Grom' }, lestaAccountId: 42 };
const USER_SCOPED_KEY = [...QUERY_KEYS.userScoped[0], 'favorites'];
const PUBLIC_KEY = ['tanks', 'list'];

const createClient = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, SESSION);
  client.setQueryData(USER_SCOPED_KEY, ['tank']);
  client.setQueryData(PUBLIC_KEY, ['tank']);

  return client;
};

const wrap =
  (client: QueryClient) =>
  ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

describe('useDeleteAccount', () => {
  it('signs the user out locally and drops every user-scoped query once the account is deleted', async () => {
    vi.spyOn(authApi, 'deleteAccount').mockResolvedValue('deleted');
    const client = createClient();

    const { result } = renderHook(() => useDeleteAccount(), { wrapper: wrap(client) });

    await act(() => result.current.mutateAsync());

    expect(client.getQueryData(QUERY_KEYS.auth.session)).toBeNull();
    expect(client.getQueryData(USER_SCOPED_KEY)).toBeUndefined();
    expect(client.getQueryData(PUBLIC_KEY)).toEqual(['tank']);
  });

  it('keeps the session when the server asks to sign in again first', async () => {
    vi.spyOn(authApi, 'deleteAccount').mockResolvedValue('reauthenticate');
    const client = createClient();

    const { result } = renderHook(() => useDeleteAccount(), { wrapper: wrap(client) });

    await act(() => result.current.mutateAsync());

    await waitFor(() => expect(result.current.data).toBe('reauthenticate'));
    expect(client.getQueryData(QUERY_KEYS.auth.session)).toEqual(SESSION);
    expect(client.getQueryData(USER_SCOPED_KEY)).toEqual(['tank']);
  });

  it('keeps the session when the deletion fails', async () => {
    vi.spyOn(authApi, 'deleteAccount').mockRejectedValue(new Error('auth down'));
    const client = createClient();

    const { result } = renderHook(() => useDeleteAccount(), { wrapper: wrap(client) });

    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined);
    });

    expect(client.getQueryData(QUERY_KEYS.auth.session)).toEqual(SESSION);
  });
});
