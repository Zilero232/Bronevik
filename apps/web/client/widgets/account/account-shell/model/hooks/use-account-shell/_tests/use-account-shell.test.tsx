import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session/api';

import * as authApi from '@/entities/auth/session/api/auth/auth';
import { UnauthorizedError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';

import { useAccountShell } from '../use-account-shell';

vi.hoisted(() => vi.resetModules());

vi.mock('@/shared/i18n/navigation', () => ({ usePathname: () => '/me/watchlist' }));

const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Grom', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: 42
};

const renderShell = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return renderHook(() => useAccountShell(), { wrapper });
};

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.resetModules();
});

describe('useAccountShell', () => {
  it('names the section the guest tried to open', () => {
    vi.spyOn(authApi, 'getAuthSession').mockReturnValue(new Promise(() => undefined));

    const { result } = renderShell();

    expect(result.current.section.href).toBe(ROUTES.account.watchlist);
  });

  it('is pending until the session is known', () => {
    vi.spyOn(authApi, 'getAuthSession').mockReturnValue(new Promise(() => undefined));

    const { result } = renderShell();

    expect(result.current.state).toEqual({ isPending: true, isFailed: false, isSignedIn: false });
  });

  it('opens the account for a signed-in user', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockResolvedValue(SESSION);

    const { result } = renderShell();

    await waitFor(() => expect(result.current.state.isSignedIn).toBe(true));
    expect(result.current.state.isFailed).toBe(false);
  });

  it('treats a guest as signed out, not as a failure', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockResolvedValue(null);

    const { result } = renderShell();

    await waitFor(() => expect(result.current.state.isPending).toBe(false));
    expect(result.current.state).toEqual({ isPending: false, isFailed: false, isSignedIn: false });
  });

  it('treats an expired session as signed out, not as a failure', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockRejectedValue(new UnauthorizedError('expired'));

    const { result } = renderShell();

    await waitFor(() => expect(result.current.state.isPending).toBe(false));
    expect(result.current.state.isFailed).toBe(false);
    expect(result.current.state.isSignedIn).toBe(false);
  });

  it('reports an outage as a failure that can be retried', async () => {
    vi.spyOn(authApi, 'getAuthSession').mockRejectedValueOnce(new Error('auth down')).mockResolvedValueOnce(SESSION);

    const { result } = renderShell();

    await waitFor(() => expect(result.current.state.isFailed).toBe(true));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.state.isSignedIn).toBe(true));
    expect(result.current.state.isFailed).toBe(false);
  });
});
