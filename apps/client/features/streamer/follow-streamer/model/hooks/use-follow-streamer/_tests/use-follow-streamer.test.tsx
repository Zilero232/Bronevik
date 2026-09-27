import type { StreamerFollow } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { PlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';
import { FORMATS, messages } from '@/shared/i18n';

import { followStreamer, getMyFollows, unfollowStreamer } from '../../../../api';
import { FOLLOW_STREAMER } from '../../../../config';
import { useFollowStreamer } from '../use-follow-streamer';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ getMyFollows: vi.fn(), followStreamer: vi.fn(), unfollowStreamer: vi.fn() }));

const TEXT = messages.en.streamersDirectory.follow;
const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };
const SLUG = 'jove';
const TANK_ID = 2849;

const FOLLOW: StreamerFollow = { slug: SLUG, displayName: 'Jove', tankId: TANK_ID, isLive: false, createdAt: '2026-01-01T00:00:00.000Z' };
const OTHER_FOLLOW: StreamerFollow = { ...FOLLOW, slug: 'other', displayName: 'Other', tankId: null };

const setup = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider formats={FORMATS} locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, wrapper };
};

const renderWithFollows = async (follows: StreamerFollow[]) => {
  vi.mocked(getMyFollows).mockResolvedValue(follows);

  const { client, wrapper } = setup(SESSION);
  const view = renderHook(() => useFollowStreamer(SLUG), { wrapper });

  await waitFor(() => expect(view.result.current.isBusy).toBe(false));

  return { client, ...view };
};

describe('useFollowStreamer', () => {
  it('stays busy while the follows are loading', () => {
    vi.mocked(getMyFollows).mockReturnValue(new Promise(() => {}));
    const { wrapper } = setup(SESSION);
    const { result } = renderHook(() => useFollowStreamer(SLUG), { wrapper });

    expect(result.current.isBusy).toBe(true);
  });

  it('describes the current follow and its tank filter', async () => {
    const { result } = await renderWithFollows([OTHER_FOLLOW, FOLLOW]);

    expect(result.current.state.isFollowing).toBe(true);
    expect(result.current.state.tankId).toBe(TANK_ID);
    expect(result.current.state.followsCount).toBe(2);
  });

  it('is not following a streamer missing from the follows', async () => {
    const { result } = await renderWithFollows([OTHER_FOLLOW]);

    expect(result.current.state.isFollowing).toBe(false);
    expect(result.current.state.tankId).toBeNull();
  });

  it('follows without a tank filter and stores the returned follows', async () => {
    const next = [OTHER_FOLLOW, { ...FOLLOW, tankId: null }];

    vi.mocked(followStreamer).mockResolvedValue(next);
    const { result } = await renderWithFollows([OTHER_FOLLOW]);

    vi.mocked(getMyFollows).mockResolvedValue(next);
    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.followed));
    expect(followStreamer).toHaveBeenCalledWith({ slug: SLUG, tankId: null });
    await waitFor(() => expect(result.current.state.isFollowing).toBe(true));
  });

  it('unfollows a followed streamer and refreshes their profile', async () => {
    vi.mocked(unfollowStreamer).mockResolvedValue();
    const { client, result } = await renderWithFollows([FOLLOW]);

    client.setQueryData(QUERY_KEYS.streamers.profile(SLUG), FOLLOW);
    act(() => result.current.onToggle());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.unfollowed));
    expect(unfollowStreamer).toHaveBeenCalledWith(SLUG);
    expect(followStreamer).not.toHaveBeenCalled();
    expect(client.getQueryState(QUERY_KEYS.streamers.profile(SLUG))?.isInvalidated).toBe(true);
  });

  it('confirms a tank change on an existing follow as a saved filter', async () => {
    vi.mocked(followStreamer).mockResolvedValue([FOLLOW]);
    const { result } = await renderWithFollows([{ ...FOLLOW, tankId: null }]);

    act(() => result.current.state.onTankChange(TANK_ID));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.tankSaved));
    expect(followStreamer).toHaveBeenCalledWith({ slug: SLUG, tankId: TANK_ID });
  });

  it('names the free follow limit when the plan limit is reached', async () => {
    vi.mocked(followStreamer).mockRejectedValue(new PlusRequiredError({ code: 'PLAN_LIMIT_REACHED', details: {}, message: 'limit' }));
    const { result } = await renderWithFollows([OTHER_FOLLOW]);

    act(() => result.current.onToggle());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        createTranslator({ locale: 'en', messages: messages.en, namespace: 'streamersDirectory.follow' })('limit', {
          limit: FOLLOW_STREAMER.freeLimit
        })
      )
    );

    expect(toast.success).not.toHaveBeenCalled();
  });
});
