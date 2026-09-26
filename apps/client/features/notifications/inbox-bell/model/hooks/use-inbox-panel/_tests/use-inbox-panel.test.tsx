import type { InboxItem, InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { markInboxRead } from '@/entities/notification/inbox/api/notifications/notifications';
import { messages } from '@/shared/i18n';

import { useInboxPanel } from '../use-inbox-panel';

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

const setup = (page?: InboxPage) => {
  vi.mocked(markInboxRead).mockResolvedValue({ updated: 1 });

  const onClose = vi.fn<() => void>();
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { onClose, ...renderHook(() => useInboxPanel({ page, onClose }), { wrapper }) };
};

describe('useInboxPanel', () => {
  it('shows an empty inbox before the page arrives', () => {
    const { result } = setup();

    expect(result.current.unread).toBe(0);
    expect(result.current.items).toEqual([]);
  });

  it('passes the page through', () => {
    const { result } = setup(PAGE);

    expect(result.current.unread).toBe(PAGE.unread);
    expect(result.current.items).toEqual(PAGE.items);
  });

  it('marks an unread linked entry as read and closes the panel to follow it', async () => {
    const { onClose, result } = setup(PAGE);

    act(() => result.current.onSelect(UNREAD_LINK));

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(vi.mocked(markInboxRead).mock.calls[0]?.[0]).toEqual({ ids: [UNREAD_LINK.id] });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('marks an unread entry without a link and keeps the panel open', async () => {
    const { onClose, result } = setup(PAGE);

    act(() => result.current.onSelect(UNREAD_NOTE));

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does nothing for an entry that is already read and has no link', () => {
    const { onClose, result } = setup(PAGE);

    act(() => result.current.onSelect(READ_NOTE));

    expect(markInboxRead).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('marks everything as read without naming entries', async () => {
    const { result } = setup(PAGE);

    act(() => result.current.onMarkAll());

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(vi.mocked(markInboxRead).mock.calls[0]?.[0]).toEqual({});
  });
});
