import type { BillingStatus } from '@otmetki/schemas';
import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { getBillingStatus, startPlusTrial } from '@/entities/plus/subscription/api/billing/billing';
import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import { usePlusTeaser } from '../use-plus-teaser';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('@/entities/plus/subscription/api/billing/billing', () => ({
  getBillingStatus: vi.fn(),
  getPaymentHistory: vi.fn(),
  getPlusPlans: vi.fn(),
  startPlusTrial: vi.fn()
}));

const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: 1001 };

const TRIAL_OFFER: BillingStatus = {
  isPlus: false,
  plan: null,
  status: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  card: null,
  isRecurringAvailable: true,
  isCheckoutAvailable: true,
  plus: { state: 'none', periodEnd: null, graceEndsAt: null, trialAvailable: true, trialDays: 7 },
  plans: []
};

const NO_TRIAL: BillingStatus = { ...TRIAL_OFFER, plus: { ...TRIAL_OFFER.plus, trialAvailable: false } };

const ON_TRIAL: BillingStatus = {
  ...TRIAL_OFFER,
  isPlus: true,
  status: 'trialing',
  plus: { ...TRIAL_OFFER.plus, state: 'trial', periodEnd: '2026-01-08T00:00:00.000Z', trialAvailable: false }
};

const renderTeaser = async (session: AuthSession, status: BillingStatus = TRIAL_OFFER) => {
  vi.mocked(getBillingStatus).mockResolvedValue(status);

  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  const view = renderHook(() => usePlusTeaser(), { wrapper });

  await waitFor(() => expect(view.result.current.isPending).toBe(false));

  return view;
};

describe('usePlusTeaser', () => {
  it('asks a guest to sign in', async () => {
    const { result } = await renderTeaser(null);

    expect(result.current.action).toBe('signIn');
  });

  it('offers a trial while one is available', async () => {
    const { result } = await renderTeaser(SESSION, TRIAL_OFFER);

    expect(result.current.action).toBe('trial');
    expect(result.current.trialDays).toBe(TRIAL_OFFER.plus.trialDays);
  });

  it('offers a subscription once the trial is used up', async () => {
    const { result } = await renderTeaser(SESSION, NO_TRIAL);

    expect(result.current.action).toBe('subscribe');
  });

  it('switches to the active state after the trial starts', async () => {
    vi.mocked(startPlusTrial).mockResolvedValue(ON_TRIAL);
    const { result } = await renderTeaser(SESSION, TRIAL_OFFER);

    act(() => result.current.onStartTrial());

    await waitFor(() => expect(result.current.action).toBe('active'));
    expect(toast.success).toHaveBeenCalledOnce();
    expect(result.current.isStarting).toBe(false);
  });

  it('keeps offering the trial when starting it fails', async () => {
    vi.mocked(startPlusTrial).mockRejectedValue(new Error('no linked account'));
    const { result } = await renderTeaser(SESSION, TRIAL_OFFER);

    act(() => result.current.onStartTrial());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(messages.en.plus.teaser.trialFailed, expect.objectContaining({ action: expect.anything() }))
    );

    expect(result.current.action).toBe('trial');
  });
});
