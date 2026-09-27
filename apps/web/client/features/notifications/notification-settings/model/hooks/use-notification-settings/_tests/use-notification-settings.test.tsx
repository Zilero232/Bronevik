import type { NotificationSettings } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';

import { getNotificationSettings, updateNotificationSettings } from '../../../../api';
import { useNotificationSettings } from '../use-notification-settings';

vi.mock('@/entities/auth/session', () => ({ useAuthSession: () => ({ data: { user: { id: 'user-1' } }, isPending: false }) }));
vi.mock('../../../../api', () => ({ getNotificationSettings: vi.fn(), updateNotificationSettings: vi.fn() }));

const KEY = QUERY_KEYS.me.section('notifications');
const BASE: NotificationSettings = { events: [], channels: [], quietHours: null, sessionReport: false, weeklyDigest: false };

const settings = (patch: Partial<NotificationSettings>): NotificationSettings => ({ ...BASE, ...patch });

const deferred = () => {
  let resolve: (value: NotificationSettings) => void = () => undefined;
  let reject: (error: Error) => void = () => undefined;

  vi.mocked(updateNotificationSettings).mockReturnValueOnce(
    new Promise<NotificationSettings>((onResolve, onReject) => {
      resolve = onResolve;
      reject = onReject;
    })
  );

  return { resolve: (value: NotificationSettings) => resolve(value), reject: (error: Error) => reject(error) };
};

const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  const onError = vi.fn();
  const hook = renderHook(() => useNotificationSettings({ onError }), { wrapper });

  return { client, onError, ...hook };
};

beforeEach(() => {
  vi.mocked(getNotificationSettings).mockReset().mockResolvedValue(BASE);
  vi.mocked(updateNotificationSettings).mockReset();
});

describe('useNotificationSettings', () => {
  it('keeps a pending patch when an earlier one resolves and refetches once after the last', async () => {
    const { client, result } = setup();

    await waitFor(() => expect(result.current.settings).toEqual(BASE));

    const first = deferred();
    const second = deferred();

    act(() => result.current.onPatch({ events: ['moe_gained'] }));
    act(() => result.current.onPatch({ channels: ['site'] }));

    await waitFor(() => expect(client.getQueryData(KEY)).toEqual(settings({ events: ['moe_gained'], channels: ['site'] })));

    await act(async () => first.resolve(settings({ events: ['moe_gained'] })));

    expect(client.getQueryData(KEY)).toEqual(settings({ events: ['moe_gained'], channels: ['site'] }));
    expect(getNotificationSettings).toHaveBeenCalledTimes(1);

    vi.mocked(getNotificationSettings).mockResolvedValue(settings({ events: ['moe_gained'], channels: ['site'] }));
    await act(async () => second.resolve(settings({ events: ['moe_gained'], channels: ['site'] })));

    await waitFor(() => expect(getNotificationSettings).toHaveBeenCalledTimes(2));
  });

  it('does not drop a pending patch when an earlier one fails', async () => {
    const { client, onError, result } = setup();

    await waitFor(() => expect(result.current.settings).toEqual(BASE));

    const first = deferred();
    const second = deferred();

    act(() => result.current.onPatch({ events: ['moe_gained'] }));
    act(() => result.current.onPatch({ channels: ['site'] }));

    await act(async () => first.reject(new Error('down')));

    expect(onError).toHaveBeenCalledTimes(1);
    expect(client.getQueryData(KEY)).toEqual(settings({ events: ['moe_gained'], channels: ['site'] }));

    vi.mocked(getNotificationSettings).mockResolvedValue(settings({ channels: ['site'] }));
    await act(async () => second.resolve(settings({ channels: ['site'] })));

    await waitFor(() => expect(client.getQueryData(KEY)).toEqual(settings({ channels: ['site'] })));
  });
});
