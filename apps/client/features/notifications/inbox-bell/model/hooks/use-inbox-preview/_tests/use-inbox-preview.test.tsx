import type { InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { INBOX_QUERY } from '@/entities/notification/inbox';
import { getInbox } from '@/entities/notification/inbox/api/notifications/notifications';
import { QUERY_KEYS } from '@/shared/constants';

import { INBOX_BELL } from '../../../../config';
import { useInboxPreview } from '../use-inbox-preview';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/notification/inbox/api/notifications/notifications', () => ({ getInbox: vi.fn(), markInboxRead: vi.fn() }));

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };

const PAGE: InboxPage = {
  items: [
    {
      id: '00000000-0000-4000-8000-000000000001',
      event: 'moe_gained',
      title: 'Third mark',
      body: 'IS-7 reached 95%',
      url: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      readAt: null
    }
  ],
  unread: 1
};

const renderPreview = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return { client, ...renderHook(() => useInboxPreview(), { wrapper }) };
};

afterEach(() => {
  vi.useRealTimers();
});

afterAll(() => {
  vi.resetModules();
});

describe('useInboxPreview', () => {
  it('does not ask for the inbox of a guest', () => {
    const { result } = renderPreview(null);

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.page).toBeUndefined();
    expect(getInbox).not.toHaveBeenCalled();
  });

  it('loads a short preview for a signed-in viewer', async () => {
    vi.mocked(getInbox).mockResolvedValue(PAGE);
    const { result } = renderPreview(SESSION);

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    expect(result.current.isSignedIn).toBe(true);
    expect(vi.mocked(getInbox).mock.calls[0]?.[0]).toMatchObject({ limit: INBOX_BELL.previewLimit });
  });

  it('reports an error when nothing loaded and recovers on retry', async () => {
    vi.mocked(getInbox).mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce(PAGE);
    const { result } = renderPreview(SESSION);

    await waitFor(() => expect(result.current.isError).toBe(true));

    act(() => void result.current.retry());

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    expect(result.current.isError).toBe(false);
  });

  it('keeps the loaded preview without an error when a later poll fails', async () => {
    vi.mocked(getInbox).mockResolvedValueOnce(PAGE).mockRejectedValueOnce(new Error('down'));
    const { client, result } = renderPreview(SESSION);

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    act(() => void result.current.retry());

    await waitFor(() => expect(client.getQueryState(INBOX_QUERY.preview)?.status).toBe('error'));
    await waitFor(() => expect(result.current.isRetrying).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.page).toEqual(PAGE);
  });

  it('polls the inbox on its interval', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(getInbox).mockResolvedValue(PAGE);
    const { result } = renderPreview(SESSION);

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    expect(getInbox).toHaveBeenCalledOnce();

    act(() => vi.advanceTimersByTime(INBOX_BELL.pollMs));

    await waitFor(() => expect(getInbox).toHaveBeenCalledTimes(2));
  });
});
