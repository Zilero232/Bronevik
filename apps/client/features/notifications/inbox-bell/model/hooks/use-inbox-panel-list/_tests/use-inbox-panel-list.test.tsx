import type { InboxItem, InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { INBOX_QUERY } from '@/entities/notification/inbox';
import { getInbox, markInboxRead } from '@/entities/notification/inbox/api/notifications/notifications';
import { messages } from '@/shared/i18n';

import { InboxPanelContext } from '../../../context';
import { useInboxPanelList } from '../use-inbox-panel-list';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/notification/inbox/api/notifications/notifications', () => ({ getInbox: vi.fn(), markInboxRead: vi.fn() }));

const UNREAD_LINK: InboxItem = {
  id: '00000000-0000-4000-8000-000000000001',
  event: 'moe_gained',
  title: 'Third mark',
  body: 'IS-7 reached 95%',
  url: '/tanks/is-7',
  createdAt: '2026-01-01T00:00:00.000Z',
  readAt: null
};

const READ_NOTE: InboxItem = { ...UNREAD_LINK, id: '00000000-0000-4000-8000-000000000002', url: null, readAt: '2026-01-02T00:00:00.000Z' };
const UNREAD_NOTE: InboxItem = { ...UNREAD_LINK, id: '00000000-0000-4000-8000-000000000003', url: null };

const PAGE: InboxPage = { items: [UNREAD_LINK, READ_NOTE, UNREAD_NOTE], unread: 2 };

const setup = () => {
  vi.mocked(getInbox).mockResolvedValue(PAGE);
  vi.mocked(markInboxRead).mockResolvedValue({ updated: 1 });

  const close = vi.fn<() => void>();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } } });

  client.setQueryData(INBOX_QUERY.preview, PAGE);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        <InboxPanelContext value={{ close }}>{children}</InboxPanelContext>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { close, ...renderHook(() => useInboxPanelList(), { wrapper }) };
};

describe('useInboxPanelList', () => {
  it('lists the cached preview', () => {
    const { result } = setup();

    expect(result.current.items).toEqual(PAGE.items);
    expect(result.current.isPending).toBe(false);
  });

  it('marks an unread linked entry as read and closes the panel to follow it', async () => {
    const { close, result } = setup();

    act(() => result.current.onSelect(UNREAD_LINK));

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(vi.mocked(markInboxRead).mock.calls[0]?.[0]).toEqual({ ids: [UNREAD_LINK.id] });
    expect(close).toHaveBeenCalledOnce();
  });

  it('marks an unread entry without a link and keeps the panel open', async () => {
    const { close, result } = setup();

    act(() => result.current.onSelect(UNREAD_NOTE));

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(close).not.toHaveBeenCalled();
  });

  it('does nothing for an entry that is already read and has no link', () => {
    const { close, result } = setup();

    act(() => result.current.onSelect(READ_NOTE));

    expect(markInboxRead).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });
});
