import type { Favorite } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import type { UseFavoriteToggleInput } from '../use-favorite-toggle.types';

import { addFavorite, getFavorites, removeFavorite } from '../../../../api';
import { useFavoriteToggle } from '../use-favorite-toggle';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ getFavorites: vi.fn(), addFavorite: vi.fn(), removeFavorite: vi.fn() }));

const TEXT = messages.en.me.favorites;
const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Tanker', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: null
};

const FAVORITE: Favorite = {
  id: '00000000-0000-4000-8000-000000000001',
  kind: 'player',
  targetId: 1001,
  label: null,
  isOwn: false,
  title: 'Tanker',
  createdAt: '2026-01-01T00:00:00.000Z'
};

const FAVORITE_PLAYER: UseFavoriteToggleInput = { kind: 'player', targetId: FAVORITE.targetId };
const CLAN_WITH_SAME_ID: UseFavoriteToggleInput = { kind: 'clan', targetId: FAVORITE.targetId };

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

const renderSignedIn = async (input: UseFavoriteToggleInput) => {
  vi.mocked(getFavorites).mockResolvedValue([FAVORITE]);

  const { client, wrapper } = setup(SESSION);
  const view = renderHook(() => useFavoriteToggle(input), { wrapper });

  await waitFor(() => expect(client.getQueryData(QUERY_KEYS.me.section('favorites'))).toEqual([FAVORITE]));

  return { client, ...view };
};

describe('useFavoriteToggle', () => {
  it('does not load favorites for a guest', () => {
    const { wrapper } = setup(null);
    const { result } = renderHook(() => useFavoriteToggle(FAVORITE_PLAYER), { wrapper });

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.isFavorite).toBe(false);
    expect(getFavorites).not.toHaveBeenCalled();
  });

  it('matches a favorite by both kind and target id', async () => {
    const player = await renderSignedIn(FAVORITE_PLAYER);
    const clan = await renderSignedIn(CLAN_WITH_SAME_ID);

    expect(player.result.current.isFavorite).toBe(true);
    expect(clan.result.current.isFavorite).toBe(false);
  });

  it('removes an existing favorite by its id and refreshes the list', async () => {
    vi.mocked(removeFavorite).mockResolvedValue();
    const { result } = await renderSignedIn(FAVORITE_PLAYER);

    act(() => result.current.toggle.mutate());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.removed));
    expect(removeFavorite).toHaveBeenCalledWith(FAVORITE.id);
    expect(addFavorite).not.toHaveBeenCalled();
    await waitFor(() => expect(getFavorites).toHaveBeenCalledTimes(2));
  });

  it('adds a missing favorite with its kind and target', async () => {
    vi.mocked(addFavorite).mockResolvedValue({ ...FAVORITE, kind: 'clan' });
    const { result } = await renderSignedIn(CLAN_WITH_SAME_ID);

    act(() => result.current.toggle.mutate());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.added));
    expect(addFavorite).toHaveBeenCalledWith(CLAN_WITH_SAME_ID);
    expect(removeFavorite).not.toHaveBeenCalled();
  });

  it('reports a failure without a success toast', async () => {
    vi.mocked(addFavorite).mockRejectedValue(new Error('down'));
    const { result } = await renderSignedIn(CLAN_WITH_SAME_ID);

    act(() => result.current.toggle.mutate());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
