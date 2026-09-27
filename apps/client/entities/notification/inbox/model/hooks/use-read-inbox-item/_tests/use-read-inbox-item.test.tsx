import type { InboxItem } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { markInboxRead } from '@/entities/notification/inbox/api';
import { messages } from '@/shared/i18n';

import { useReadInboxItem } from '../use-read-inbox-item';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/notification/inbox/api', () => ({ markInboxRead: vi.fn(), getInbox: vi.fn() }));

const UNREAD: InboxItem = {
  id: '00000000-0000-4000-8000-000000000001',
  event: 'moe_gained',
  title: 'Third mark',
  body: 'IS-7 reached 95%',
  url: null,
  createdAt: '2026-09-25T10:00:00.000Z',
  readAt: null
};

const READ: InboxItem = { ...UNREAD, id: '00000000-0000-4000-8000-000000000002', readAt: '2026-09-25T11:00:00.000Z' };

const setup = () => {
  vi.mocked(markInboxRead).mockResolvedValue({ updated: 1 });

  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useReadInboxItem(), { wrapper });
};

afterEach(() => {
  vi.mocked(markInboxRead).mockReset();
});

afterAll(() => {
  vi.resetModules();
});

describe('useReadInboxItem', () => {
  it('marks an unread item read by its id', async () => {
    const { result } = setup();

    act(() => result.current(UNREAD));

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(vi.mocked(markInboxRead).mock.calls[0]?.[0]).toEqual({ ids: [UNREAD.id] });
  });

  it('leaves an item that is already read alone', () => {
    const { result } = setup();

    act(() => result.current(READ));

    expect(markInboxRead).not.toHaveBeenCalled();
  });
});
