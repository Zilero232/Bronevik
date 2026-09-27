import type { BillingStatus } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import { startPlusTrial } from '../../../../api';
import { useStartTrial } from '../use-start-trial';

vi.hoisted(() => vi.resetModules());

vi.mock('@/shared/i18n/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock('../../../../api', () => ({
  startPlusTrial: vi.fn(),
  getBillingStatus: vi.fn(),
  getPaymentHistory: vi.fn(),
  getPlusPlans: vi.fn()
}));

const TRIAL_DAYS = 7;

const FREE: BillingStatus = {
  isPlus: false,
  plan: null,
  status: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  card: null,
  isRecurringAvailable: false,
  isCheckoutAvailable: true,
  plus: { state: 'none', periodEnd: null, graceEndsAt: null, trialAvailable: true, trialDays: TRIAL_DAYS },
  plans: []
};

const TRIAL: BillingStatus = {
  ...FREE,
  isPlus: true,
  currentPeriodEnd: '2026-10-03T12:00:00.000Z',
  plus: { ...FREE.plus, state: 'trial', periodEnd: '2026-10-03T12:00:00.000Z', trialAvailable: false }
};

const setup = () => {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.me.billing.status, FREE);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, ...renderHook(() => useStartTrial(), { wrapper }) };
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.mocked(startPlusTrial).mockReset();
});

afterAll(() => {
  vi.resetModules();
});

describe('useStartTrial', () => {
  it('switches the cached billing status to the trial the server granted', async () => {
    vi.mocked(startPlusTrial).mockResolvedValue(TRIAL);
    const { client, result } = setup();

    await act(() => result.current.mutateAsync());

    expect(client.getQueryData(QUERY_KEYS.me.billing.status)).toEqual(TRIAL);
  });

  it('confirms the trial with its length in days', async () => {
    vi.mocked(startPlusTrial).mockResolvedValue(TRIAL);
    const success = vi.spyOn(toast, 'success');
    const { result } = setup();

    await act(() => result.current.mutateAsync());

    expect(success).toHaveBeenCalledWith(expect.stringContaining(String(TRIAL_DAYS)));
  });

  it('keeps the old status and explains the failure when the trial is refused', async () => {
    vi.mocked(startPlusTrial).mockRejectedValue(new Error('no linked account'));
    const failed = vi.spyOn(toast, 'error');
    const { client, result } = setup();

    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined);
    });

    expect(client.getQueryData(QUERY_KEYS.me.billing.status)).toEqual(FREE);

    expect(failed).toHaveBeenCalledWith(
      messages.en.plus.teaser.trialFailed,
      expect.objectContaining({ action: expect.objectContaining({ label: messages.en.plus.teaser.linkAccount }) })
    );
  });
});
