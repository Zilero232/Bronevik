import type { NotificationSettings } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { getNotificationSettings, updateNotificationSettings } from '../../../../../../features/notifications/notification-settings/api';
import { CHECKOUT_NOTIFY } from '../../../../config';
import { useCheckoutNotify } from '../use-checkout-notify';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('@/entities/auth/session', () => ({ useAuthSession: () => ({ data: { user: { id: 'user-1' } }, isPending: false }) }));

vi.mock('../../../../../../features/notifications/notification-settings/api', () => ({
  getNotificationSettings: vi.fn(),
  updateNotificationSettings: vi.fn()
}));

const SETTINGS: NotificationSettings = { channels: ['site'], events: ['moe_gained'], quietHours: null, sessionReport: true, weeklyDigest: false };
const SUBSCRIBED: NotificationSettings = { ...SETTINGS, events: [...SETTINGS.events, CHECKOUT_NOTIFY.event] };
const COPY = messages.en.plus.checkout.notify;

const renderNotify = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useCheckoutNotify(), { wrapper });
};

beforeEach(() => {
  vi.mocked(getNotificationSettings).mockReset().mockResolvedValue(SETTINGS);
  vi.mocked(updateNotificationSettings).mockReset();
});

describe('useCheckoutNotify', () => {
  it('reads off and ignores a toggle until the settings arrive', () => {
    vi.mocked(getNotificationSettings).mockReturnValue(new Promise(() => undefined));

    const { result } = renderNotify();

    expect(result.current.isOn).toBe(false);
    expect(result.current.isPending).toBe(true);

    act(() => {
      result.current.onToggle(true);
    });

    expect(updateNotificationSettings).not.toHaveBeenCalled();
  });

  it('reads on once the checkout event is subscribed', async () => {
    vi.mocked(getNotificationSettings).mockResolvedValue(SUBSCRIBED);

    const { result } = renderNotify();

    await waitFor(() => expect(result.current.isOn).toBe(true));
  });

  it('adds the checkout event next to the existing events and confirms it', async () => {
    vi.mocked(updateNotificationSettings).mockResolvedValue(SUBSCRIBED);

    const { result } = renderNotify();

    await waitFor(() => expect(result.current.isPending).toBe(false));
    vi.mocked(getNotificationSettings).mockResolvedValue(SUBSCRIBED);

    act(() => {
      result.current.onToggle(true);
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(COPY.enabled));
    expect(vi.mocked(updateNotificationSettings).mock.calls[0]?.[0]).toEqual({ events: SUBSCRIBED.events });
    await waitFor(() => expect(result.current.isOn).toBe(true));
  });

  it('removes only the checkout event when switched off', async () => {
    vi.mocked(getNotificationSettings).mockResolvedValue(SUBSCRIBED);
    vi.mocked(updateNotificationSettings).mockResolvedValue(SETTINGS);

    const { result } = renderNotify();

    await waitFor(() => expect(result.current.isOn).toBe(true));

    act(() => {
      result.current.onToggle(false);
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(COPY.disabled));
    expect(vi.mocked(updateNotificationSettings).mock.calls[0]?.[0]).toEqual({ events: SETTINGS.events });
  });

  it('confirms what the server saved rather than what was asked', async () => {
    vi.mocked(updateNotificationSettings).mockResolvedValue(SETTINGS);

    const { result } = renderNotify();

    await waitFor(() => expect(result.current.isPending).toBe(false));

    act(() => {
      result.current.onToggle(true);
    });

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(COPY.disabled));
  });

  it('reports a failed save', async () => {
    vi.mocked(updateNotificationSettings).mockRejectedValue(new Error('down'));

    const { result } = renderNotify();

    await waitFor(() => expect(result.current.isPending).toBe(false));

    act(() => {
      result.current.onToggle(true);
    });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(COPY.failed));
    expect(toast.success).not.toHaveBeenCalled();
  });
});
