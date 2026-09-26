import type { Watchlist } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { PlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import { addWatchlistPlayer, getWatchlist, removeWatchlistPlayer } from '../../../../api';
import { useWatchToggle } from '../use-watch-toggle';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ getWatchlist: vi.fn(), addWatchlistPlayer: vi.fn(), removeWatchlistPlayer: vi.fn() }));

const WATCHED_ID = 1001;
const OTHER_ID = 2002;
const TEXT = messages.en.watchlist.button;

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };

const WATCHLIST: Watchlist = {
  period: '24h',
  digest: 'daily',
  lastDigestAt: null,
  limit: 10,
  players: [
    {
      followId: '00000000-0000-4000-8000-000000000001',
      accountId: WATCHED_ID,
      nickname: 'Watched',
      clanTag: null,
      watchedSince: '2026-01-01T00:00:00.000Z',
      lastBattleAt: null,
      battles: 0,
      wins: 0,
      winRate: null,
      avgDamage: null,
      marksGained: 0,
      wn8: null
    }
  ]
};

const setup = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, wrapper };
};

const renderSignedIn = async (accountId: number) => {
  vi.mocked(getWatchlist).mockResolvedValue(WATCHLIST);

  const { client, wrapper } = setup(SESSION);
  const view = renderHook(() => useWatchToggle(accountId), { wrapper });

  await waitFor(() => expect(client.getQueryData(QUERY_KEYS.watchlist(WATCHLIST.period))).toEqual(WATCHLIST));

  return { client, ...view };
};

describe('useWatchToggle', () => {
  it('does not load the watchlist for a guest and reports them signed out', () => {
    const { wrapper } = setup(null);
    const { result } = renderHook(() => useWatchToggle(WATCHED_ID), { wrapper });

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.isWatched).toBe(false);
    expect(getWatchlist).not.toHaveBeenCalled();
  });

  it('marks the player as watched only when they are in the watchlist', async () => {
    const watched = await renderSignedIn(WATCHED_ID);
    const other = await renderSignedIn(OTHER_ID);

    expect(watched.result.current.isWatched).toBe(true);
    expect(other.result.current.isWatched).toBe(false);
    expect(other.result.current.isSignedIn).toBe(true);
  });

  it('removes a watched player and announces the removal', async () => {
    vi.mocked(removeWatchlistPlayer).mockResolvedValue();
    const { result } = await renderSignedIn(WATCHED_ID);

    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.removed));
    expect(removeWatchlistPlayer).toHaveBeenCalledWith(WATCHED_ID);
    expect(addWatchlistPlayer).not.toHaveBeenCalled();
  });

  it('adds an unwatched player and refreshes every watchlist period', async () => {
    vi.mocked(addWatchlistPlayer).mockResolvedValue(WATCHLIST);
    const { client, result } = await renderSignedIn(OTHER_ID);

    client.setQueryData(QUERY_KEYS.watchlist('7d'), WATCHLIST);
    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.added));
    expect(addWatchlistPlayer).toHaveBeenCalledWith(OTHER_ID);
    expect(client.getQueryState(QUERY_KEYS.watchlist('7d'))?.isInvalidated).toBe(true);
  });

  it('explains the plan limit when the server requires Plus', async () => {
    vi.mocked(addWatchlistPlayer).mockRejectedValue(new PlusRequiredError({ code: 'PLAN_LIMIT_REACHED', details: {}, message: 'limit' }));
    const { result } = await renderSignedIn(OTHER_ID);

    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.limit));
  });

  it('shows a generic failure for any other error', async () => {
    vi.mocked(addWatchlistPlayer).mockRejectedValue(new Error('down'));
    const { result } = await renderSignedIn(OTHER_ID);

    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
