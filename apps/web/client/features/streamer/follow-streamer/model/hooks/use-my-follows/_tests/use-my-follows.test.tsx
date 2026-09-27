import type { StreamerFollow } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import { getMyFollows, unfollowStreamer } from '../../../../api';
import { useMyFollows } from '../use-my-follows';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ getMyFollows: vi.fn(), unfollowStreamer: vi.fn() }));

const TEXT = messages.en.streamersDirectory.follows;
const SESSION: AuthSession = {
  user: { id: 'user-1', name: 'Tanker', email: 'user-1@example.com', emailVerified: false, createdAt: new Date(0), updatedAt: new Date(0) },
  lestaAccountId: null
};

const FOLLOW: StreamerFollow = { slug: 'jove', displayName: 'Jove', tankId: null, isLive: false, createdAt: '2026-01-01T00:00:00.000Z' };

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

const renderWithFollows = async (follows: StreamerFollow[]) => {
  vi.mocked(getMyFollows).mockResolvedValue(follows);

  const { client, wrapper } = setup(SESSION);
  const view = renderHook(() => useMyFollows(), { wrapper });

  await waitFor(() => expect(client.getQueryData(QUERY_KEYS.me.streamer.follows)).toEqual(follows));

  return { client, ...view };
};

describe('useMyFollows', () => {
  it('is hidden for a guest', () => {
    const { wrapper } = setup(null);
    const { result } = renderHook(() => useMyFollows(), { wrapper });

    expect(result.current.isVisible).toBe(false);
  });

  it('is hidden for a signed-in user who follows nobody', async () => {
    const { result } = await renderWithFollows([]);

    expect(result.current.isVisible).toBe(false);
  });

  it('is visible once the user follows someone', async () => {
    const { result } = await renderWithFollows([FOLLOW]);

    expect(result.current.isVisible).toBe(true);
    expect(result.current.pendingSlug).toBeNull();
  });

  it('marks the streamer being unfollowed as pending until the request settles', async () => {
    let resolve = () => {};

    vi.mocked(unfollowStreamer).mockReturnValue(
      new Promise<void>((settle) => {
        resolve = settle;
      })
    );

    const { client, result } = await renderWithFollows([FOLLOW]);

    client.setQueryData(QUERY_KEYS.streamers.profile(FOLLOW.slug), FOLLOW);
    act(() => result.current.onUnfollow(FOLLOW.slug));

    await waitFor(() => expect(result.current.pendingSlug).toBe(FOLLOW.slug));

    resolve();

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.unfollowed));
    expect(unfollowStreamer).toHaveBeenCalledWith(FOLLOW.slug, expect.anything());
    expect(client.getQueryState(QUERY_KEYS.streamers.profile(FOLLOW.slug))?.isInvalidated).toBe(true);
    await waitFor(() => expect(result.current.pendingSlug).toBeNull());
  });

  it('reports a failed unfollow', async () => {
    vi.mocked(unfollowStreamer).mockRejectedValue(new Error('down'));
    const { result } = await renderWithFollows([FOLLOW]);

    act(() => result.current.onUnfollow(FOLLOW.slug));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
