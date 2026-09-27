import type { InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { getInbox } from '@/entities/notification/inbox/api/notifications/notifications';
import { QUERY_KEYS } from '@/shared/constants';

import { INBOX_BELL } from '../../../../config';
import { useInboxUnread } from '../use-inbox-unread';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/notification/inbox/api/notifications/notifications', () => ({ getInbox: vi.fn(), markInboxRead: vi.fn() }));

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };

const PAGE: InboxPage = { items: [], unread: 3 };

const renderUnread = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return renderHook(() => useInboxUnread(), { wrapper });
};

afterEach(() => {
  vi.useRealTimers();
});

afterAll(() => {
  vi.resetModules();
});

describe('useInboxUnread', () => {
  it('does not ask for the inbox of a guest', () => {
    const { result } = renderUnread(null);

    expect(result.current).toEqual({ isSignedIn: false, unread: 0 });
    expect(getInbox).not.toHaveBeenCalled();
  });

  it('counts the unread entries of a signed-in viewer', async () => {
    vi.mocked(getInbox).mockResolvedValue(PAGE);
    const { result } = renderUnread(SESSION);

    await waitFor(() => expect(result.current.unread).toBe(PAGE.unread));
    expect(result.current.isSignedIn).toBe(true);
    expect(vi.mocked(getInbox).mock.calls[0]?.[0]).toMatchObject({ limit: INBOX_BELL.previewLimit });
  });

  it('polls the inbox on its interval', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(getInbox).mockResolvedValue(PAGE);
    const { result } = renderUnread(SESSION);

    await waitFor(() => expect(result.current.unread).toBe(PAGE.unread));
    expect(getInbox).toHaveBeenCalledOnce();

    act(() => vi.advanceTimersByTime(INBOX_BELL.pollMs));

    await waitFor(() => expect(getInbox).toHaveBeenCalledTimes(2));
  });
});
