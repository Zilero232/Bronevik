import type { InboxPage } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { INBOX_QUERY } from '@/entities/notification/inbox';
import { getInbox } from '@/entities/notification/inbox/api/notifications/notifications';

import { INBOX_BELL } from '../../../../config';
import { useInboxPreview } from '../use-inbox-preview';

vi.hoisted(() => vi.resetModules());

vi.mock('@/entities/notification/inbox/api/notifications/notifications', () => ({ getInbox: vi.fn(), markInboxRead: vi.fn() }));

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

const renderPreview = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return { client, ...renderHook(() => useInboxPreview(), { wrapper }) };
};

afterAll(() => {
  vi.resetModules();
});

describe('useInboxPreview', () => {
  it('loads a short preview', async () => {
    vi.mocked(getInbox).mockResolvedValue(PAGE);
    const { result } = renderPreview();

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    expect(vi.mocked(getInbox).mock.calls[0]?.[0]).toMatchObject({ limit: INBOX_BELL.previewLimit });
  });

  it('reports an error when nothing loaded and recovers on retry', async () => {
    vi.mocked(getInbox).mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce(PAGE);
    const { result } = renderPreview();

    await waitFor(() => expect(result.current.isError).toBe(true));

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    expect(result.current.isError).toBe(false);
  });

  it('keeps the loaded preview without an error when a later fetch fails', async () => {
    vi.mocked(getInbox).mockResolvedValueOnce(PAGE).mockRejectedValueOnce(new Error('down'));
    const { client, result } = renderPreview();

    await waitFor(() => expect(result.current.page).toEqual(PAGE));
    act(() => result.current.retry());

    await waitFor(() => expect(client.getQueryState(INBOX_QUERY.preview)?.status).toBe('error'));
    await waitFor(() => expect(result.current.isRetrying).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.page).toEqual(PAGE);
  });
});
