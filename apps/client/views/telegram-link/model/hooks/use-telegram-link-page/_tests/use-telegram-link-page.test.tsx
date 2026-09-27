import type { TelegramLinkCode, TelegramStatus } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import { getTelegramStatus, issueTelegramCode } from '../../../../api';
import { TELEGRAM_LINK } from '../../../../config';
import { useTelegramLinkPage } from '../use-telegram-link-page';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api', () => ({ getTelegramStatus: vi.fn(), issueTelegramCode: vi.fn() }));

const UNLINKED: TelegramStatus = { isLinked: false, username: null, botUsername: 'otmetki_bot' };
const LINKED: TelegramStatus = { isLinked: true, username: 'ivan', botUsername: 'otmetki_bot' };
const CODE: TelegramLinkCode = { code: 'ABCDEFGH', expiresAt: '2026-09-27T12:15:00.000Z', deepLink: 'https://t.me/otmetki_bot?start=ABCDEFGH' };
const NOW = new Date('2026-09-27T12:00:00.000Z');

const renderPage = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return renderHook(() => useTelegramLinkPage(), { wrapper });
};

describe('useTelegramLinkPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, shouldAdvanceTime: true });
    vi.mocked(getTelegramStatus).mockResolvedValue(UNLINKED);
    vi.mocked(issueTelegramCode).mockResolvedValue(CODE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('names no bot until the status arrives, then the configured one', async () => {
    const { result } = renderPage();

    expect(result.current.botUsername).toBeNull();

    await waitFor(() => expect(result.current.botUsername).toBe('otmetki_bot'));
    expect(result.current.code).toBeUndefined();
  });

  it('issues a code on demand and remembers when it was issued', async () => {
    const { result } = renderPage();

    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    act(() => result.current.onIssue());

    await waitFor(() => expect(result.current.code).toEqual(CODE));
    expect(result.current.issuedAt).toBeGreaterThanOrEqual(NOW.getTime());
    expect(result.current.issuedAt).toBeLessThanOrEqual(Date.now());
    expect(result.current.isIssuing).toBe(false);
  });

  it('polls the link status only while a code is out', async () => {
    const { result } = renderPage();

    await waitFor(() => expect(getTelegramStatus).toHaveBeenCalledOnce());
    await act(() => vi.advanceTimersByTimeAsync(TELEGRAM_LINK.pollMs * 3));

    expect(getTelegramStatus).toHaveBeenCalledOnce();

    act(() => result.current.onIssue());
    await waitFor(() => expect(result.current.code).toEqual(CODE));
    await act(() => vi.advanceTimersByTimeAsync(TELEGRAM_LINK.pollMs));

    expect(getTelegramStatus).toHaveBeenCalledTimes(2);
  });

  it('drops the code and celebrates once the bot reports the link', async () => {
    const { result } = renderPage();

    await waitFor(() => expect(result.current.query.isSuccess).toBe(true));
    act(() => result.current.onIssue());
    await waitFor(() => expect(result.current.code).toEqual(CODE));

    vi.mocked(getTelegramStatus).mockResolvedValue(LINKED);
    await act(() => vi.advanceTimersByTimeAsync(TELEGRAM_LINK.pollMs));

    await waitFor(() => expect(result.current.code).toBeUndefined());
    expect(toast.success).toHaveBeenCalledWith(messages.en.telegram.toast.linked);
  });

  it('reports a failed issue without showing a code', async () => {
    vi.mocked(issueTelegramCode).mockRejectedValue(new Error('down'));

    const { result } = renderPage();

    act(() => result.current.onIssue());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(messages.en.telegram.toast.codeFailed));
    expect(result.current.code).toBeUndefined();
  });
});
