import type { InboxItem, InboxPage, MarkReadResult } from '@otmetki/schemas';
import type { InfiniteData } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { markInboxRead } from '../../../../api';
import { INBOX_QUERY } from '../../../../config';
import { useMarkInboxRead } from '../use-mark-inbox-read';

vi.hoisted(() => vi.resetModules());

vi.mock('../../../../api', () => ({ markInboxRead: vi.fn(), getInbox: vi.fn() }));

const NOW = new Date('2026-09-26T12:00:00Z');

const item = (id: string, readAt: string | null): InboxItem => ({
  id,
  event: 'moe_gained',
  title: `Title ${id}`,
  body: 'Body',
  url: null,
  createdAt: '2026-09-25T10:00:00.000Z',
  readAt
});

const FIRST = '00000000-0000-4000-8000-000000000001';
const SECOND = '00000000-0000-4000-8000-000000000002';
const EARLIER = '2026-09-20T10:00:00.000Z';

const PREVIEW: InboxPage = { items: [item(FIRST, null), item(SECOND, null)], unread: 2 };
const FEED: InfiniteData<InboxPage> = {
  pages: [PREVIEW, { items: [item('00000000-0000-4000-8000-000000000003', EARLIER)], unread: 2 }],
  pageParams: [null, EARLIER]
};

const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(INBOX_QUERY.preview, PREVIEW);
  client.setQueryData(INBOX_QUERY.feed, FEED);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, ...renderHook(() => useMarkInboxRead(), { wrapper }) };
};

const deferred = () => {
  const handlers: { resolve: (value: MarkReadResult) => void; reject: (error: Error) => void } = {
    resolve: () => undefined,
    reject: () => undefined
  };

  const promise = new Promise<MarkReadResult>((resolve, reject) => {
    handlers.resolve = resolve;
    handlers.reject = reject;
  });

  return { promise, ...handlers };
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.mocked(markInboxRead).mockReset();
});

afterAll(() => {
  vi.resetModules();
});

describe('useMarkInboxRead', () => {
  it('marks only the chosen items read before the server answers', async () => {
    const request = deferred();

    vi.mocked(markInboxRead).mockReturnValue(request.promise);
    const { client, result } = setup();

    act(() => result.current.mutate({ ids: [FIRST] }));

    await waitFor(() => expect(client.getQueryData<InboxPage>(INBOX_QUERY.preview)?.unread).toBe(PREVIEW.unread - 1));

    const preview = client.getQueryData<InboxPage>(INBOX_QUERY.preview);

    expect(preview?.items.find(({ id }) => id === FIRST)?.readAt).toBe(NOW.toISOString());
    expect(preview?.items.find(({ id }) => id === SECOND)?.readAt).toBeNull();

    request.resolve({ updated: 1 });
  });

  it('marks every page of the feed read when no ids are given', async () => {
    const request = deferred();

    vi.mocked(markInboxRead).mockReturnValue(request.promise);
    const { client, result } = setup();

    act(() => result.current.mutate({}));

    await waitFor(() => expect(client.getQueryData<InfiniteData<InboxPage>>(INBOX_QUERY.feed)?.pages.every(({ unread }) => unread === 0)).toBe(true));

    const feed = client.getQueryData<InfiniteData<InboxPage>>(INBOX_QUERY.feed);

    expect(feed?.pages.flatMap(({ items }) => items).every(({ readAt }) => readAt !== null)).toBe(true);
    expect(feed?.pages[1].items[0].readAt).toBe(EARLIER);

    request.resolve({ updated: 2 });
  });

  it('restores the inbox and tells the user when the server refuses', async () => {
    vi.mocked(markInboxRead).mockRejectedValue(new Error('down'));
    const failed = vi.spyOn(toast, 'error');
    const { client, result } = setup();

    act(() => result.current.mutate({ ids: [FIRST] }));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(client.getQueryData(INBOX_QUERY.preview)).toEqual(PREVIEW);
    expect(client.getQueryData(INBOX_QUERY.feed)).toEqual(FEED);
    expect(failed).toHaveBeenCalledWith(messages.en.inbox.failed);
  });

  it('refetches the inbox after the server confirmed', async () => {
    vi.mocked(markInboxRead).mockResolvedValue({ updated: 1 });
    const { client, result } = setup();

    act(() => result.current.mutate({ ids: [FIRST] }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.getQueryState(INBOX_QUERY.preview)?.isInvalidated).toBe(true);
    expect(client.getQueryState(INBOX_QUERY.feed)?.isInvalidated).toBe(true);
  });
});
