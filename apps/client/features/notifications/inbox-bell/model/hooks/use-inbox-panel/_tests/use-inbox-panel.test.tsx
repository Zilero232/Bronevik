import type { InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { INBOX_QUERY } from '@/entities/notification/inbox';
import { getInbox, markInboxRead } from '@/entities/notification/inbox/api/notifications/notifications';
import { messages } from '@/shared/i18n';

import { useInboxPanel } from '../use-inbox-panel';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('@/entities/notification/inbox/api/notifications/notifications', () => ({ getInbox: vi.fn(), markInboxRead: vi.fn() }));

const PAGE: InboxPage = { items: [], unread: 2 };

const setup = (page?: InboxPage) => {
  vi.mocked(getInbox).mockReturnValue(new Promise(() => undefined));
  vi.mocked(markInboxRead).mockResolvedValue({ updated: 2 });

  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } } });

  if (page) {
    client.setQueryData(INBOX_QUERY.preview, page);
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useInboxPanel(), { wrapper });
};

describe('useInboxPanel', () => {
  it('shows no unread entries before the preview arrives', () => {
    expect(setup().result.current.unread).toBe(0);
  });

  it('reads the unread count from the cached preview', () => {
    expect(setup(PAGE).result.current.unread).toBe(PAGE.unread);
  });

  it('marks everything as read without naming entries', async () => {
    const { result } = setup(PAGE);

    act(() => result.current.onMarkAll());

    await waitFor(() => expect(markInboxRead).toHaveBeenCalledOnce());
    expect(vi.mocked(markInboxRead).mock.calls[0]?.[0]).toEqual({});
  });
});
